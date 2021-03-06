import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import AuthException from '@exceptions/AuthException'
import GenericException from '@exceptions/GenericException'

import UserModel from '@models/UserModel'

export default class AuthController {
  public static async login (req: Request, res: Response) {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email }, 'name email password')
    const passwordIsValid = !!user?.password && await bcrypt.compare(password, user.password)
    if (!passwordIsValid) throw new AuthException('As credenciais de acesso fornecidas estão inválidas')

    const sanitized = _.omitBy({ ...user._doc, password: null }, _.isNull)

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

    const sanitized = _.omitBy({ ...document, password: null }, _.isNull)

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: sanitized
    })
  }
}
