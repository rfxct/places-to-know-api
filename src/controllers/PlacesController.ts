// @ts-nocheck
import { Request, Response } from 'express'

import GenericException from '@exceptions/GenericException'
import UnsplashAPI from '@apis/UnsplashAPI'
import PlaceModel from '@models/PlaceModel'

import removeDiacritics from '@utils/removeDiacritis'

export default class PlacesController {
  public static async index (req: Request, res: Response) {
    const { search, order, page: rawPage, limit } = req.query
    const page = Math.max(1, Number(rawPage) || 0)
    const perPage = Number(limit) || Number(process.env.PAGINATION_ITEMS_LIMIT) || 50

    const places = await PlaceModel.find({
      searchableName: { $regex: `.*${removeDiacritics(search)}.*`, $options: 'i' }
    }, '_id name photo').sort({ [order]: 1 }).skip(perPage * (page - 1)).limit(perPage)

    res.status(200).json(places)
  }

  public static async show (req: Request, res: Response) {
    const { placeId } = req.params

    const place = await PlaceModel.findById(placeId, '_id name photo')
    if (!place) throw new GenericException('O id fornecido não pertence a nenhum registro', 404, 'INEXISTENT_PLACE')

    res.status(200).json(place)
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

  public static async delete (req: Request, res: Response) {
    const { placeId } = req.params

    const place = await PlaceModel.findOneAndDelete({ _id: placeId }, '_id name photo')
    if (!place?._doc) throw new GenericException('O id fornecido não pertence a nenhum registro', 404, 'INEXISTENT_PLACE')

    res.status(200).json(place._doc)
  }
}
