/* eslint-disable prettier/prettier */
import { it, expect, beforeAll, afterAll, describe, beforeEach} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
// beforeAll é uma função que vai ser executada antes de todos os testes.
// Nesse caso, antes de executas todos os testes, essa função vai aguardar o app estar pronto para receber 
// requisições ( vai aguardar o fastify terminar de cadastrar os plugins ). Fazemos isso com o app.ready()
describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })
  
  // Depois de executar todos os testes, ele vai fechar o app, ou seja, tirá-lo de memória.
  afterAll( async() =>{
    await app.close()
  })
  
  beforeEach( () => {
    execSync('npm run knex migrate:rollback --all')  
    execSync('npm run knex migrate:latest')  
  })

  // fazer a chamada HTTP p/ criar uma nova transação
  it('should be able to create a new transaction', async () => {
    // o supertest sempre recebe o parametro do servidor do node
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  // NOTA IMPORTANTE: Eu jamais posso escrever um teste que depende de outro teste
  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })
    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    ])
  })

  it('should be able to get a specific transactions', async () => {
    const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server) 
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)


    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 5000,
      type: 'credit',
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
    .post('/transactions')
    .set('Cookie', cookies)
    .send({
      title: 'Debit transaction',
      amount: 2000,
      type: 'debit',
    })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)


    expect(summaryResponse.body.summary).toEqual({
      amount: 3000
    })
  })


})
