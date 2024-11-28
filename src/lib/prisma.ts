import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prsima = new PrismaClient({
  log: env.NODE_ENV === 'dev'
    ? ['query']
    : [],
})
