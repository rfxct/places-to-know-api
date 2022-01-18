import request from 'supertest'

import bootstrap from '../bootstrap'
import app from '../../src/App'

const { defaultUser: user } = bootstrap()

describe('POST /register', () => {
  it('should return a created user', async () => {
    const result = await request(app).post('/register').send(user).expect(201)

    expect(result.body.message).toEqual('Usuário criado com sucesso')
  })

  it('should return a email already in use error', async () => {
    const result = await request(app).post('/register').send(user).expect(409)

    expect(result.body.message).toEqual('O e-mail fornecido já pertence a uma conta')
  })

  it('should return a validation error', async () => {
    const result = await request(app).post('/register').send({ ...user, password: null }).expect(400)

    expect(result.body.errors[0].param).toEqual('password')
  })
})

describe('POST /login', () => {
  it('should login successfully', async () => {
    const result = await request(app).post('/login').send(user).expect(200)

    expect(result.body).toHaveProperty('token')
    expect(result.body.user).toHaveProperty('_id')
  })
})
