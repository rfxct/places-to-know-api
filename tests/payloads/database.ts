import { mongo } from 'mongoose'

export const defaultUser = {
  _id: new mongo.ObjectId('21e6dbbd03d20ed4f1a1d561'),
  name: 'Marcos Ferreira',
  email: 'marc@jest.js',
  password: '$2b$05$9gQgmVaj7rUwKVUG7eHzDuaAw1qsLZlEyCMlkVXFDKg/XAc78iOdC' // marc123
}
