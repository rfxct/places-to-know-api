import fs from 'fs/promises'
import mongoose from 'mongoose'
import { Signale } from 'signale'

import app from './App'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default class Server {
  public app
  public log

  private connectionAttempts: number = 1
  private connectionAttemptsLimit = Number(process.env.CONNECTION_ATTEMPTS_LIMIT!) || 5
  private connectionAttemptsMS = Number(process.env.CONNECTION_ATTEMPTS_MS_TO_RETRY!) || 5000

  private applicationPort = process.env.PORT || 3000

  constructor () {
    this.app = app
    this.log = new Signale()
  }

  public async start () {
    await this.checkAPIs()
    await this.mongooseConnect()

    this.app.listen(this.applicationPort, () =>
      this.log.scope('Servidor').success('Servidor iniciado com sucesso')
    )
  }

  public async checkAPIs () {
    const apis = (await fs.readdir('./src/apis'))

    for (const name of apis) {
      const { default: instance } = require(`./apis/${name}`)

      try {
        instance.checkEnvs()
      } catch (e: Error | any) {
        this.log.scope(instance.constructor.name).error(e.message)
        if (instance.necessary) process.exit(1)
      }
    }
  }

  public async mongooseConnect () {
    // Tenta se conectar novamente ao banco de dados até que haja sucesso ou o limite de tentativas se exceda
    try {
      await mongoose.connect(process.env.MONGODB_URI!)
      this.log.scope('MongoDB').success('Conectado com sucesso ao banco de dados')
    } catch (error) {
      this.log
        .scope('MongoDB', `Tentativa ${this.connectionAttempts} de ${this.connectionAttemptsLimit}`)
        .debug('Não foi possível se conectar ao banco de dados. Tentando Novamente...')
    } finally {
      if (this.connectionAttempts === this.connectionAttemptsLimit && mongoose.connection.readyState === 0) {
        this.log.scope('MongoDB').fatal('Não foi possível se conectar ao banco de dados')
        process.exit(1)
      }

      if (this.connectionAttempts < this.connectionAttemptsLimit && mongoose.connection.readyState === 0) {
        this.connectionAttempts++
        await sleep(this.connectionAttemptsMS)
        await this.mongooseConnect()
      }
    }
  }
}
