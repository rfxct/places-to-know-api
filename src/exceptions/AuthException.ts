import IExceptionHandler from '@interfaces/IExceptionHandler'
import Exception from './Exception'

export default class LoginException extends Exception {
  constructor (
    message: string = 'Você precisa estar autenticado para acessar este recurso',
    status: number = 401,
    code: string = 'UNAUTHORIZED_ACCESS'
  ) {
    super(message, status, code)
  }

  handle ({ res }: IExceptionHandler) {
    this.respondWithJSON(res)
  }
}
