/* eslint-disable prettier/prettier */
import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: true })
} else {
  config()
}

// Schema -> um formato de dados
// Nesse caso, dentro do schema vai estar o formato de dado que eu vou receber de dados das variaveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

// o parse vai fazer uma validação desse schema.
const _env = envSchema.safeParse(process.env)

if(_env.success === false){
  console.error('Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data



