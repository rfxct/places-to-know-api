import { checkSchema } from 'express-validator'

export default class PlacesValidator {
  public static store = checkSchema({
    name: {
      isLength: {
        errorMessage: 'O nome do lugar não pode estar vazio', options: { min: 1 }
      }
    }
  })
}
