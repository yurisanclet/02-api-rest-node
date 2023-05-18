"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
// No método down eu faço exatamente o contrario do método up. Exemplo: Se eu subo uma tabela no método up, no
// método down eu dropo essa tabela, se eu faço uma alteração na tabela no método up, no método down eu desfaço
// essa alteração.
async function up(knex) {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary();
        table.text('title').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable('transactions');
}
exports.down = down;
