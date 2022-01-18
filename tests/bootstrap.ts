import 'dotenv/config'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

import { defaultUser } from './payloads/database'

export default () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri(), { dbName: 'test-backend-tindin-fase2' })

    await Promise.all([
      ...Object.values(mongoose.connection.collections).map(collection => collection.deleteMany({})),
      mongoose.models.User.create(defaultUser)
    ])
  })

  afterAll(async () => {
    if (mongoose.connection.readyState) await mongoose.disconnect()
    if (mongoServer) await mongoServer.stop()
  })

  return {
    token: jwt.sign({ id: defaultUser._id.toString() }, process.env.JWT_SECRET!),
    defaultUser: { ...defaultUser, email: 'marc@fwck.me', password: 'marc123' }
  }
}
