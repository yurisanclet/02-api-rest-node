* Instalações necessárias:

- npm i -D typescript

- npx tsc --init -> permite configurar o typescript, assim como converter o código ts para js

- npm i fastify

- npm i -D @types/node -> é necessário instalar essa tipagem para node pois originalmente o node entende apenas 
código javascript, então precisamos baixar esse pacote de tipagem como dependencia de desenvolvimento.

- npm i tsx -D -> automatiza o processo de conversão do arquivo ts para js, para que não seja necessário rodar o 
comando npx tsc para gerar o arquivo js. Isso deixa o código mais limpo e fácil de entender.

* Nota: rodar o servidor usando npx tsx só é recomendado para ambiente de desenvolvimento. Em ambiente de produção vai ser necessário converter o código ts para js, até porque rodar o código em js é muito mais rápido do que em ts.

- npm i eslint @rocketseat/eslint-config -D

- npm i knex sqlite3 -> instalação do Query Builder(Knex) e o driver do banco de dados do sqlite

* Nota: Conforme dito no vídeo, existem 3 formas de se estabelecer uma conexão com o banco de dados, que são: Utilizando o Driver do banco, utilizando um Query Builder que abstrai toda a linguagem sql para o código da linguagem que voce esta utilizando, e utilizando ORMs.

* Nota: Eu não posso editar uma migration após a sua criação. A única situação possível é caso você ainda não tenha enviado essa migration para o restante do seu time, nesse caso você pode executar o comando npm run knex -- migrate:rollback, dessa forma ele desfaz a migration que você rodou, e assim é possível editar a migration.


- npm i dotenv -> faz com que o node consiga ler o arquivo .env

- npm i zod -> biblioteca para validação de dados

- npm i @fastify/cookie

- npm i vitest -D -> ferramenta para fazer testes da nossa aplicação.

- npm i supertest -D -> essa ferramente permite fazer requisições para a nossa aplicação sem colocar a aplicação no ar, ou seja, sem usar o método listen

- npm i -D @types/supertest -> devido ao fato do supertest ser uma ferramenta que foi desenvolvida usando apenas javascript, é necessário instalar esse pacote de tipagem que foi feito pela própria comunidade.

npm i tsup -D -> ferramenta usada para fazer o processo de build do nosso projeto, que é converter de typescript para javascript. 