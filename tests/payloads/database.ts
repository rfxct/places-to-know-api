import { mongo } from 'mongoose'

export const defaultUser = {
  _id: new mongo.ObjectId('21e6dbbd03d20ed4f1a1d561'),
  name: 'Marcos Ferreira',
  email: 'marc@jest.js',
  password: '$2b$05$9gQgmVaj7rUwKVUG7eHzDuaAw1qsLZlEyCMlkVXFDKg/XAc78iOdC' // marc123
}

export const defaultPlaces = [
  {
    _id: new mongo.ObjectId('61e70c976918ce604dd6b4c8'),
    name: 'Sorocaba',
    photo: 'https://images.unsplash.com/photo-1612215840919-d7eba2ab6e26?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyOTIxMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI1MzE5OTA&ixlib=rb-1.2.1&q=85'
  },
  {
    _id: new mongo.ObjectId('61e70c9b6918ce604dd6b4cc'),
    name: 'Maringá',
    photo: 'https://images.unsplash.com/photo-1573820290191-3e1215f7a71c?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyOTIxMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI1MzE5OTU&ixlib=rb-1.2.1&q=85'
  },
  {
    _id: new mongo.ObjectId('61e70f56ca7778d4020a385c'),
    name: 'Salto',
    photo: 'https://images.unsplash.com/photo-1549994409-da779fb2b65c?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyOTIxMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI1MzI2OTQ&ixlib=rb-1.2.1&q=85'
  },
  {
    _id: new mongo.ObjectId('61e70f66ca7778d4020a3860'),
    name: 'Campinas',
    photo: 'https://images.unsplash.com/photo-1548342142-c9873357abb8?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyOTIxMDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NDI1MzI3MDk&ixlib=rb-1.2.1&q=85'
  }
]
