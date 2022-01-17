import Server from './src/Server'

if (process.env.NODE_ENV !== 'production') {
  const swaggerAutogen = require('swagger-autogen')

  swaggerAutogen('./src/docs/swagger_output.json', ['./src/routes/index.ts'], {
    info: { title: 'teste-backend-tindin' }
  })
}

const server = new Server()
server.start()
