import { NextFunction, Request, Response } from 'express'
import jwt, { TokenExpiredError, JsonWebTokenError, JwtPayload } from 'jsonwebtoken'

import AuthException from '@exceptions/AuthException'
import UserModel from '@models/UserModel'

export default async function auth (req: Request, _res: Response, next: NextFunction) {
  if (!req.headers.authorization) throw new AuthException()
  const [, token] = req.headers.authorization.trim().split(/\s+/)

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.user = await UserModel.findById(id)
    if (!req.user) throw new AuthException('Token inválido')
  } catch (error: any) {
    if (error instanceof TokenExpiredError) throw new AuthException('Token expirado. Faça login novamente')
    if (error instanceof JsonWebTokenError) throw new AuthException('Forneça um token de acesso')
    if (error instanceof AuthException) throw error
    throw new AuthException()
  }
  return next()
}
