import { Schema, model } from 'mongoose'

const PlaceSchema = new Schema({
  name: {
    type: String,
    required: [true, 'É necessário fornecer um nome para o local']
  },
  photo: String
})

PlaceSchema.index({ name: 'text' }, { default_language: 'pt' })

export default model('Place', PlaceSchema)
