import request from 'supertest'
import nock from 'nock'

import bootstrap from '../bootstrap'
import app from '../../src/App'
import * as unsplash from '../payloads/unsplash'

const { token } = bootstrap()

describe('POST /places', () => {
  nock('https://api.unsplash.com')
    .get('/photos/random')
    .query({ query: 'Boituva' })
    .reply(200, unsplash.photosRandom)

  it('should return validation error', async () => {
    const response = await request(app).post('/places')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    expect(response.body.errors[0].param).toEqual('name')
  })

  it('should create a place successfully', async () => {
    const response = await request(app).post('/places')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Boituva' })
      .expect(201)
    console.log(response.body)
    expect(response.body).toHaveProperty('_id')
    expect(response.body.name).toEqual('Boituva')
  })

  it('should return a place already exists error', async () => {
    const response = await request(app).post('/places')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Boituva' })
      .expect(409)

    expect(response.body.code).toEqual('PLACE_ALREADY_EXISTS')
  })
})
