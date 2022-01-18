import { Schema, model } from 'mongoose'
import removeDiacritics from '@utils/removeDiacritis'

const PlaceSchema = new Schema({
  name: {
    type: String,
    required: [true, 'É necessário fornecer um nome para o local']
  },
  searchableName: {
    type: String,
    set: removeDiacritics,
    default: function () {
      return removeDiacritics((this as any).name)
    }
  },
  photo: String
})

PlaceSchema.pre('save', function (next) {
  this.searchableName = removeDiacritics(this.name)
  next()
})

export default model('Place', PlaceSchema)
