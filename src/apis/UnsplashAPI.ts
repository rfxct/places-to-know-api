import IUnsplashPhoto from '@interfaces/IUnsplashPhoto'
import APIWrapper from '@structures/APIWrapper'

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

  public async getUniquePhoto (query: string, fullUrl: string) {
    const { data } = await this.getPhoto(query)

    return data.results.find((d: IUnsplashPhoto) => d.urls.full !== fullUrl) || data.results.photos[0]
  }

  public async getRandomPhoto (query: string) {
    return this.request('GET', '/photos/random', { params: { query } })
  }
}

export default new UnsplashAPI()
