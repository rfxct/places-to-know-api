import { checkSchema } from 'express-validator'
const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1).toLowerCase()

export default class AuthValidator {
  // Auth
  public static auth = checkSchema({
    email: {
      isEmail: { errorMessage: 'O e-mail fornecido é inválido' }
    },
    password: {
      isLength: {
        errorMessage: 'A senha deve ter no mínimo 6 dígitos', options: { min: 6 }
      }
    }
  })

  // Login
  public static store = checkSchema({
    name: {
      custom: {
        errorMessage: 'Forneça o primeiro e o último nome (utilize somente letras)',
        options: (value) => /[a-z]{1,}\s+[a-z]{1,}/i.test(value)
      },
      customSanitizer: {
        options: (value) => value?.trim().split(/\s+/).map(capitalize).join(' ')
      }
    },
    email: {
      isEmail: { errorMessage: 'O e-mail fornecido é inválido' }
    },
    password: {
      isLength: {
        errorMessage: 'A senha deve ter no mínimo 6 dígitos', options: { min: 6 }
      },
      custom: {
        errorMessage: 'A senha deve conter letras e números',
        options: (value) => /([a-z].*[0-9]|[0-9].*[a-z])/i.test(value)
      }
    }
  })
}
