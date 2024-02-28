<a href="./dist/collection-insomnia.json">Collection Insomnia</a>

# Projeto
O projeto foi desenvolvido utilizando a arquitetura MVC, a partir do boilerplate criado para o projeto anterior.

A API do Unsplash foi isolada em um wrapper, visando a possibilidade de, futuramente, adicionar outros Wrappers e reaproveitar a estrutura construída sem ter que escrever muito mais código.

Antes de iniciar o servidor, todos os wrappers existentes são carregados e ocorre uma verificação para ver se todos que necessitam de variáveis de ambiente possuem-as.

## Dependências do projeto:
* `express`: para criação do servidor;
* `express-validator`: para validar dados vindos do client;
* `express-async-errors`: para tratar erros assíncronos disparados no servidor;
* `morgan`: para logs de requisições;
* `signale`: para logs do servidor;
* `mongoose`: para manipular os dados do MongoDB de forma menos verbosa;
* `bcrypt`: gerar um hash da senha do usuário;
* `jsonwebtoken`: gerar os tokens de usuário;
* `lodash`: utilitário para manipular dados;
* `axios`: para fazer requisições às APIs externas;
* `swagger-ui-express`: gerar uma documentação inical para a API;

## Dependências de testes:
* `jest`: para criar e rodar os testes;
* `mongodb-memory-server`: para criar um mock do mongoose, sem a necessidade de conectar a um banco real;
* `nock`: interceptar requisições feitas às APIs externas, devolvendo um mock como resultado;


# Resoluções
* **Busca por documentos:**
Optei por criar um campo com os textos desacentuados e em  letra minúscula em cada documento Place já que, depois de várias tentativas (desde indíces até expressões regulares), foi a que melhor funcionou;

* **Atualização de documento:**
Adicionei a propriedade `forcePhotoUpdate` para, caso o usuário queira, forçar a busca de uma imagem diferente na API do Unsplash;
