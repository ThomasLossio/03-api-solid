import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository }
  from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './checkin'
import { InMemoryGymRepository }
  from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckInsError }
  from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: 52.0543210,
      longitude: 55.1234567,
    })

    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
