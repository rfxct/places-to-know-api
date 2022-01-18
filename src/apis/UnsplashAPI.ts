import APIWrapper from '@structures/APIWrapper'
// eslint-disable-next-line no-unused-vars
import { AxiosError } from 'axios'

const UnsplashAPI = class extends APIWrapper {
  constructor () {
    super({ necessary: true, envs: ['UNSPLASH_ACCESS_KEY'] }, {
      baseURL: 'https://api.unsplash.com',
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    })
  }

  public async getPhoto (query: string) {
    return this.request('GET', '/search/photos', { params: { query } })
  }

  public async getRandomPhoto (query: string) {
    return this.request('GET', '/photos/random', { params: { query } })
  }
}

export default new UnsplashAPI()
