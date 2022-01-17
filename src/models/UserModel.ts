import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'É necessário fornecer um nome para o usuário']
  },
  email: {
    type: String,
    required: [true, 'É necessário fornecer um e-mail para o usuário']
  },
  password: {
    type: String,
    required: [true, 'É necessário fornecer uma senha para o usuário']
  }
})

export default model('User', UserSchema)
