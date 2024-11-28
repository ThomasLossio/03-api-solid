import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { InMemoryRepository } from '@/repositories/in-memory-users-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new InMemoryRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    const errorMessage = err instanceof Error
      ? err.message
      : 'Unexpected error'
    return reply.status(409).send({
      message: errorMessage,
    })
  }

  return reply.status(201).send()
}
