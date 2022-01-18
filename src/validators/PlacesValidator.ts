import { checkSchema } from 'express-validator'
import { mongo, isValidObjectId } from 'mongoose'

export default class PlacesValidator {
  public static checkIdParam = checkSchema({
    placeId: {
      in: ['params'],
      custom: {
        errorMessage: 'O id fornecido é inválido',
        options: (value) => value && isValidObjectId(value)
      },
      customSanitizer: {
        options: (value) => value && isValidObjectId(value) ? new mongo.ObjectId(value) : value
      }
    }

  })

  public static store = checkSchema({
    name: {
      isLength: {
        errorMessage: 'O nome do lugar não pode estar vazio', options: { min: 1 }
      }
    }
  })
}
