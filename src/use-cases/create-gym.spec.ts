import { InMemoryGymRepository }
  from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
