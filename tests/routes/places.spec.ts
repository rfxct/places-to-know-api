import request from 'supertest'
import mongoose from 'mongoose'
import nock from 'nock'

import bootstrap from '../bootstrap'
import app from '../../src/App'
import * as unsplash from '../payloads/unsplash'

const { token, defaultPlaces } = bootstrap()

beforeEach(() => nock.cleanAll())

describe('POST /places', () => {
  nock('https://api.unsplash.com')
    .get('/photos/random')
    .query({ query: 'Boituva' })
    .reply(200, unsplash.boituvaData)

  it('should return a unauthorized error', async () => {
    const result = await request(app).post('/places').expect(401)

    expect(result.body.code).toEqual('UNAUTHORIZED_ACCESS')
  })

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

describe('GET /places', () => {
  it('should return a unauthorized error', async () => {
    const result = await request(app).get('/places').expect(401)

    expect(result.body.code).toEqual('UNAUTHORIZED_ACCESS')
  })

  it('should return all places with default limit', async () => {
    const count = await mongoose.models.Place.count({}).exec()
    const amount = count > 50 ? 50 : count

    const response = await request(app).get('/places')
      .set('Authorization', `Bearer ${token}`)
      .query({ limit: amount })
      .expect(200)

    expect(response.body.constructor.name).toEqual('Array')
    expect(response.body.length).toEqual(amount)
  })

  it('should return places ordered by name', async () => {
    const response = await request(app).get('/places')
      .set('Authorization', `Bearer ${token}`)
      .query({ order: 'name' })
      .expect(200)

    expect(response.body[0].name).toEqual('Boituva')
  })

  it('should return a Maringá place document', async () => {
    const response = await request(app).get('/places')
      .set('Authorization', `Bearer ${token}`)
      .query({ search: 'ringa' })
      .expect(200)

    expect(response.body[0].name).toEqual('Maringá')
  })
})

describe('GET /places/:placeId', () => {
  it('should return a unauthorized error', async () => {
    const result = await request(app).get('/places/----------').expect(401)

    expect(result.body.code).toEqual('UNAUTHORIZED_ACCESS')
  })

  it('should return a invalid id error', async () => {
    const response = await request(app).get('/places/----------')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    expect(response.body.errors[0].param).toEqual('placeId')
  })

  it('should return not found error', async () => {
    const response = await request(app).get(`/places/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    expect(response.body.code).toEqual('INEXISTENT_PLACE')
  })

  it('should return a place successfully', async () => {
    const documentId = defaultPlaces[0]._id.toString()
    const response = await request(app).get(`/places/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body._id).toEqual(documentId)
  })
})

describe('PUT /places/', () => {
  nock('https://api.unsplash.com')
    .get('/photos/random')
    .query({ query: 'Botucatu' })
    .reply(200, unsplash.botucatuData)

  it('should return a unauthorized error', async () => {
    const result = await request(app).put('/places').expect(401)

    expect(result.body.code).toEqual('UNAUTHORIZED_ACCESS')
  })

  it('should return a validation error', async () => {
    const response = await request(app).put('/places/')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    expect(response.body.errors).toHaveLength(2)
  })

  it('should update and return place successfully', async () => {
    const document = defaultPlaces[1]
    const response = await request(app).put('/places/')
      .set('Authorization', `Bearer ${token}`)
      .send({ _id: document._id.toString(), name: 'Botucatu' })
      .expect(200)

    expect(response.body.name).toEqual('Botucatu')
    expect(response.body.photo).not.toEqual(document.photo)
  })

  it('should not update and return place successfully', async () => {
    const document = defaultPlaces[0]
    const response = await request(app).put('/places/')
      .set('Authorization', `Bearer ${token}`)
      .send(document)
      .expect(200)

    expect(response.body.name).toEqual(document.name)
    expect(response.body.photo).toEqual(document.photo)
  })
})

describe('DELETE /places/:placeId', () => {
  it('should return a unauthorized error', async () => {
    const result = await request(app).delete('/places/----------').expect(401)

    expect(result.body.code).toEqual('UNAUTHORIZED_ACCESS')
  })

  it('should return a invalid id error', async () => {
    const response = await request(app).delete('/places/----------')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    expect(response.body.errors[0].param).toEqual('placeId')
  })

  it('should return not found error', async () => {
    const response = await request(app).delete(`/places/${new mongoose.Types.ObjectId()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    expect(response.body.code).toEqual('INEXISTENT_PLACE')
  })

  it('should delete and return place successfully', async () => {
    const documentId = defaultPlaces[0]._id.toString()
    const response = await request(app).delete(`/places/${documentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body._id).toEqual(documentId)
  })
})
