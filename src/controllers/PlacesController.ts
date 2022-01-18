import { Request, Response } from 'express'

import UnsplashAPI from '@apis/UnsplashAPI'
import GenericException from '@exceptions/GenericException'
import PlaceModel from '@models/PlaceModel'

export default class PlacesController {
  public static async index (req: Request, res: Response) {
  }

  public static async store (req: Request, res: Response) {
    const { name } = req.body

    const alreadyExists = await PlaceModel.findOne({ name })
    if (alreadyExists) throw new GenericException('Já existe um local cadastrado com este nome')

    const { status, data } = await UnsplashAPI.getRandomPhoto(name)
    if (status !== 200) {
      throw new GenericException('Ocorreu um erro ao obter a imagem')
    }

    const { _doc: document } = await PlaceModel.create({ name, photo: data?.urls?.full ?? null })
    res.status(201).json(document)
  }
}
