import { PasswordTooShortError } from 'src/app/errors/PasswordTooShortError'
import { FakeHashProvider } from 'src/app/providers/fakes/FakeHashProvider'
import { InMemoryUserRepository } from 'src/app/repositories/fakes/InMemoryUserRepository'
import { UserRolesEnum } from 'src/domain/enums/UserRolesEnum'
import { UserStatusEnum } from 'src/domain/enums/UserStatusEnum'
import { UpdateUserService } from 'src/app/useCases/UpdateUser/UpdateUserService'
import { IUpdateUser, UpdateUserDTO } from './IUpdateUser'
import { UserModel } from 'src/app/models/UserModel'
import { CreateDBUserDTO } from 'src/app/repositories/ICreateUSerRepository'
import { User } from 'src/domain/entities/User'
import { EmailAlreadyInUseError } from 'src/app/errors/EmailAlreadyInUseError'

describe('UpdateUser', () => {
  let sut: IUpdateUser
  let hashProvider: FakeHashProvider
  let userRepository: InMemoryUserRepository
  let testUser: UserModel

  const makeTestInputData = (): UpdateUserDTO => {
    return {
      email: 'test@example.com',
      name: 'test',
      password: '12345',
      role: UserRolesEnum.GENERAL,
      status: UserStatusEnum.ACTIVE,
    }
  }

  beforeEach(async () => {
    hashProvider = new FakeHashProvider()
    userRepository = new InMemoryUserRepository()
    sut = new UpdateUserService(userRepository, hashProvider)

    testUser = await userRepository.create(makeTestInputData() as CreateDBUserDTO)
  })

  it('should return error if password is provided and has less then 5 characters', async () => {
    const data = makeTestInputData()

    data.password = '1234'

    const result = await sut.execute(testUser.id, data)

    expect(result.isFail()).toBe(true)
    expect(result.value).toBeInstanceOf(PasswordTooShortError)
  })

  it('should return error if email was already taken by another user', async () => {
    const data = makeTestInputData()

    data.email = 'test2@example.com'

    await userRepository.create(data as CreateDBUserDTO)

    const result = await sut.execute(testUser.id, data)

    expect(result.isFail()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyInUseError)
  })

  it('should call repository to persist user', async () => {
    const repositoryUpdateMethodSpy = jest.spyOn(userRepository, 'update')

    const data = makeTestInputData()

    await sut.execute(testUser.id, data)

    expect(repositoryUpdateMethodSpy).toHaveBeenCalledTimes(1)
    expect(repositoryUpdateMethodSpy).toHaveBeenCalledWith({
      id: testUser.id,
      ...data,
    })
  })

  it('should encrypt password before persist', async () => {
    const repositoryUpdateMethodSpy = jest.spyOn(userRepository, 'update')
    const hashProviderEncryptSpy = jest.spyOn(hashProvider, 'encrypt')

    const data = makeTestInputData()

    const expectedPassword = `${data.password}-encrypted`

    hashProviderEncryptSpy.mockImplementationOnce(() => Promise.resolve(expectedPassword))

    await sut.execute(testUser.id, data)

    expect(hashProviderEncryptSpy).toHaveBeenCalledTimes(1)
    expect(hashProviderEncryptSpy).toHaveBeenCalledWith(data.password)
    expect(repositoryUpdateMethodSpy).toHaveBeenCalledWith({
      id: testUser.id,
      ...data,
      password: expectedPassword,
    })
  })

  it('should not pass password to repository if it is null', async () => {
    const repositoryUpdateMethodSpy = jest.spyOn(userRepository, 'update')

    const data = makeTestInputData()
    const expectedData = { ...data }

    data.password = null

    delete expectedData.password

    await sut.execute(testUser.id, data)

    expect(repositoryUpdateMethodSpy).toHaveBeenCalledWith({
      id: testUser.id,
      ...expectedData,
    })
  })

  it('should return updated user', async () => {
    const repositoryUpdateMethodSpy = jest.spyOn(userRepository, 'update')

    const expectedReturn = {
      ...(makeTestInputData() as User),
      id: 1,
    }
    repositoryUpdateMethodSpy.mockImplementationOnce(() => Promise.resolve(expectedReturn))

    const data = makeTestInputData()

    const result = await sut.execute(testUser.id, data)

    expect(result.isSuccess()).toBe(true)

    if (result.isSuccess()) {
      expect(result.value).toBe(expectedReturn)
    }
  })
})
