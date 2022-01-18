const fs = require('fs')
const path = require('path')

const [, , command, ...args] = process.argv
const models = fs.readdirSync('./dist/templates')

if (command.toLowerCase().startsWith('create')) {
  const structure = capitalize(command.split(':').pop())
  if (!models.includes(structure)) die('Estrutura inválida')

  const model = fs.readFileSync(`./dist/templates/${structure}`, { encoding: 'utf-8' })
  return createStructure(structure, model.toString())
} else {
  die('Nenhum comando especificado')
}

// Functions
function createStructure (structureName, fileContent) {
  if (!args[0]) return die(`Forneça um nome para a estrutura ${structureName}`)

  const resolvedName = capitalize(args[0]).replace(new RegExp(structureName, 'igm'), '')
  const fullPath = path.resolve('src', `${structureName.toLowerCase()}s`, `${resolvedName}${structureName}.ts`)

  fs.writeFileSync(fullPath, fileContent.replace(/{{name}}/igm, resolvedName), { encoding: 'utf-8' })
  console.log(`O arquivo ${structureName}${resolvedName} foi criado (${fullPath})`)
}

function die (message) {
  console.error(message)
  process.exit(1)
}

function capitalize (string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}
