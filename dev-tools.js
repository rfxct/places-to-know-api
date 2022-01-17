const fs = require('fs')
const path = require('path')

const [, , command, ...args] = process.argv

switch (command) {
  case 'create:controller': {
    if (!args[0]) return die('Forneça um nome para o Controller')

    const controllerName = capitalize(args[0]).replace('controller', '') + 'Controller'
    const fullPath = path.resolve('src', 'controllers', `${controllerName}.ts`)

    fs.writeFileSync(fullPath, `export default class ${controllerName} {\n\n}\n`, { encoding: 'utf-8' })
    console.log(`O controller ${controllerName} foi criado`)
    break
  }
  default: die('Nenhum comando especificado')
}

function die (message) {
  console.error(message)
  process.exit(1)
}

function capitalize (string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}
