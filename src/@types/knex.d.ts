/* eslint-disable prettier/prettier */
// Arquivo para definição de tipos
// eslint-disable-next-line
import { Knex } from 'knex'

// Permite mapear as tabelas que a gente tem no nosso banco.  
declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string,
      title: string,
      amount: number,
      created_at: string,
      session_id?: string 
    }
  }
}