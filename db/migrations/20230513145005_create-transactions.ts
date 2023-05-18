import { Knex } from 'knex'

// No método down eu faço exatamente o contrario do método up. Exemplo: Se eu subo uma tabela no método up, no
// método down eu dropo essa tabela, se eu faço uma alteração na tabela no método up, no método down eu desfaço
// essa alteração.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
