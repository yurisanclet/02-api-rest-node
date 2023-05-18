/* eslint-disable prettier/prettier */
import { FastifyInstance } from "fastify"
import { knex } from "../dbConfig/database"
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"

// Todo plugin do fastify precisa ser uma função assincrona
// Cookie => Formas da gente manter contexto entre requisições
// O middleware é um interceptador, ele intercepta dados na requisição antes de rodar o código.
// No fastify ele é chamado de preHandler, e sempre deve ser chamado entre o path da rota, e a função executada ao acessar a rota. Ele é chamado bem no meio. Ex: app.get('/path', { preHandler: [função middleware], async(req, rep)})
export async function transactionsRoutes(app: FastifyInstance){
  // Abaixo temos um handler global, que será executado em todas as rotas que acessarmos. Porém, por mais que seja global, ele se restringe apenas as rotas do plugin. Nesse exemplo, esse handler abaixo só vai estar disponivel para as rotas presentes no plugin transactionsRoutes
  // app.addHook('preHandler', async(request, reply) => {
  //   console.log(`[${request.method}] ${request.url}`)
  // })

  app.get('/', 
  {
    preHandler: [checkSessionIdExists] 
  },
  async (request) =>{
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()
    return {
      transactions
    }
  })

  app.get('/summary', 
  {
    preHandler: [checkSessionIdExists] 
  },
  async(request) =>{
    const { sessionId } = request.cookies
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', {as : 'amount'})
      .first()

    return {
      summary
    }
  })

  app.get('/:id',
  {
    preHandler: [checkSessionIdExists] 
  },
  async(request)=>{
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    
    const { id } = getTransactionParamsSchema.parse(request.params)
    const { sessionId } = request.cookies

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id
      })
      .first()

    return {
      transaction
    }
  })

  app.post('/', async (request, reply) => {
    // { title, amount, type: credit ou debit}
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId


    // Os cookies são como parametros, porém, que são criados pela nossa própria aplicação e são enviados automaticamente em todas as requisições( ou as requisições que eu quiser, levando em consideração o path)
    if(!sessionId){
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',  // Quais rotas vão poder acessar esse cookie
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    // Geralmente, em rotas de criação na api, a gente não faz retornos.
    await knex('transactions').insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId
      }) 

    return reply.status(201).send()   
  })
}