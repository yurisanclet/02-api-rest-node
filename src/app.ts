/* eslint-disable prettier/prettier */
import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'
// import crypto  from 'node:crypto'

export const app = fastify()
// prefix é uma configuração que passamos para ele identificar qual plugin estamos acessando quando utilizamos esse
// prefixo. Nas rotas esse prefixo sempre vai estar presente.
app.register(cookie)
app.register(transactionsRoutes, {
  prefix: 'transactions',
})

// Separamos o nosso servidor em dois arquivos, um server.ts e outro app.ts, dessa forma a gente consegue importar no testes o app, sem o listen.