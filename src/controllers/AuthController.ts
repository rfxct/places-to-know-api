import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import GenericException from '@exceptions/GenericException'
import UserModel from '@models/UserModel'
import AuthException from '@exceptions/AuthException'

export default class AuthController {
  public static async authenticate (req: Request, res: Response) {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    const passwordIsValid = !!user?.password && await bcrypt.compare(password, user.password)
    if (!passwordIsValid) throw new AuthException('As credenciais de acesso fornecidas estão inválidas')

    // Remover campos sensíveis/indesejados
    const toRemove = ['__v', 'password']
    const sanitized = _.omitBy(user._doc, (_value, key) => toRemove.includes(key))

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.status(200).send({ token, user: sanitized })
  }

  public static async register (req: Request, res: Response) {
    const { email, password: rawPassword, name } = req.body

    const alreadyUsed = await UserModel.findOne({ email })
    if (alreadyUsed) {
      throw new GenericException('O e-mail fornecido já pertence a uma conta', 409, 'EMAIL_ALREADY_IN_USE')
    }

    const password = await bcrypt.hash(rawPassword, Number(process.env.BCRYPT_SALT_ROUNDS) || 5)
    const { _doc: document } = await UserModel.create({ name, password, email })

    // Remover campos sensíveis/indesejados
    const toRemove = ['__v', 'password']
    const sanitized = _.omitBy(document, (_value, key) => toRemove.includes(key))

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: sanitized
    })
  }
}
