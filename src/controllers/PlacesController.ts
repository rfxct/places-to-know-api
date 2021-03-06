import { Request, Response } from 'express'

import GenericException from '@exceptions/GenericException'
import UnsplashAPI from '@apis/UnsplashAPI'
import PlaceModel from '@models/PlaceModel'

import removeDiacritics from '@utils/removeDiacritis'
import IUnsplashPhoto from '@interfaces/IUnsplashPhoto'

export default class PlacesController {
  public static async index (req: Request, res: Response) {
    const { search, order, page: rawPage, limit } = req.query
    const page = Math.max(1, Number(rawPage) || 0)
    const perPage = Number(limit) || Number(process.env.PAGINATION_ITEMS_LIMIT) || 50

    const places = await PlaceModel.find({
      searchableName: { $regex: `.*${removeDiacritics(search as string)}.*`, $options: 'i' }
    }).select('_id name photo')
      .sort({ [order as string]: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)

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
    if (alreadyExists) throw new GenericException('Já existe um local cadastrado com este nome', 409, 'PLACE_ALREADY_EXISTS')

    const { data } = await UnsplashAPI.getRandomPhoto(name)
    const { _doc: document } = await PlaceModel.create({ name, photo: data?.urls?.full ?? null })

    res.status(201).json(document)
  }

  public static async put (req: Request, res: Response) {
    const { _id, name, forcePhotoUpdate } = req.body

    const placeExists = await PlaceModel.findOne({ _id }, '_id name photo')
    if (!placeExists) throw new GenericException('O id fornecido não pertence a nenhum registro', 404, 'INEXISTENT_PLACE')
    if (!forcePhotoUpdate && placeExists.name.toLowerCase() === name.toLowerCase()) {
      return res.status(200).json({ ...placeExists._doc, name })
    }

    const makeRequest = forcePhotoUpdate || removeDiacritics(placeExists.name) !== removeDiacritics(name)
    const defaultPayload = { urls: { full: placeExists.photo } }

    const photo: IUnsplashPhoto = (makeRequest ? await UnsplashAPI.getUniquePhoto(name, placeExists?.photo) : defaultPayload)

    const place = await PlaceModel
      .findOneAndUpdate({ _id }, { name, photo: photo?.urls?.full ?? null }, { new: true })
      .select('_id name photo')

    res.status(200).json(place._doc)
  }

  public static async delete (req: Request, res: Response) {
    const { placeId } = req.params

    const place = await PlaceModel.findByIdAndDelete(placeId).select('_id name photo')
    if (!place?._doc) throw new GenericException('O id fornecido não pertence a nenhum registro', 404, 'INEXISTENT_PLACE')

    res.status(200).json(place._doc)
  }
}
