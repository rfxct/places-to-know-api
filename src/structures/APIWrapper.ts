// eslint-disable-next-line no-unused-vars
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, Method } from 'axios'

interface WrapperConfig {
  necessary: boolean
  envs: [string]
}

export default class APIWrapper {
  private envs
  public axiosConfig
  public webservice: AxiosInstance | null
  public necessary: boolean

  constructor ({ necessary, envs }: WrapperConfig, axiosConfig: AxiosRequestConfig) {
    // Indica se a API é necessária para o funcionamento do sistema
    this.necessary = !!necessary
    this.envs = envs
    this.axiosConfig = axiosConfig
    this.webservice = axios.create(this.axiosConfig)
  }

  public checkEnvs () {
    const invalidEnvs = this.envs.filter(key => !process.env[key])
    if (invalidEnvs.length) throw new Error(`O Wrapper necessita das seguintes variáveis de ambiente: ${invalidEnvs}`)
  }

  public async request (method: Method, url: string, config: AxiosRequestConfig) {
    try {
      const response = await this.webservice!.request({ method, url, ...config })
      return response
    } catch (e: AxiosError | any) {
      return e.response
    }
  }
}
