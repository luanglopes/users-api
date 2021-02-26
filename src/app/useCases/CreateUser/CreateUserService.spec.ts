import { EmailAlreadyInUseError } from 'src/app/errors/EmailAlreadyInUseError'
import { PasswordTooShortError } from 'src/app/errors/PasswordTooShortError'
import { FakeHashProvider } from 'src/app/providers/fakes/FakeHashProvider'
import { InMemoryUserRepository } from 'src/app/repositories/fakes/InMemoryUserRepository'
import { CreateUserService } from 'src/app/useCases/CreateUser/CreateUserService'
import { RoleKeysEnum } from 'src/domain/enums/RoleKeysEnum'
import { UserStatusEnum } from 'src/domain/enums/UserStatusEnum'

describe('CreateUser', () => {
  const makeSut = () => {
    const userRepository = new InMemoryUserRepository()
    const hashProvider = new FakeHashProvider()
    const sut = new CreateUserService(userRepository, hashProvider)

    return { sut, userRepository, hashProvider }
  }

  const makeTestInputData = () => {
    return {
      email: 'test@example.com',
      name: 'test',
      password: '12345',
      roleKey: RoleKeysEnum.GENERAL,
    }
  }

  it('should return error if password has less then 5 characters', async () => {
    const { sut } = makeSut()

    const data = makeTestInputData()

    data.password = '1234'

    const result = await sut.execute(data)

    expect(result.isFail()).toBe(true)
    expect(result.value).toBeInstanceOf(PasswordTooShortError)
  })

  it('should set status to active by default', async () => {
    const { sut } = makeSut()

    const data = makeTestInputData()

    const result = await sut.execute(data)

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.status).toBe(UserStatusEnum.ACTIVE)
    }
  })

  it('should call repository to persist user', async () => {
    const { sut, userRepository } = makeSut()

    const repositoryCreateMethodSpy = jest.spyOn(userRepository, 'create')

    const data = makeTestInputData()

    await sut.execute(data)

    expect(repositoryCreateMethodSpy).toHaveBeenCalledTimes(1)
    expect(repositoryCreateMethodSpy).toHaveBeenCalledWith({
      ...data,
      status: UserStatusEnum.ACTIVE,
    })
  })

  it('should encrypt password before persist', async () => {
    const { sut, userRepository, hashProvider } = makeSut()

    const repositoryCreateMethodSpy = jest.spyOn(userRepository, 'create')
    const hashProviderEncryptSpy = jest.spyOn(hashProvider, 'encrypt')

    const data = makeTestInputData()

    const expectedPassword = `${data.password}-encrypted`

    hashProviderEncryptSpy.mockImplementationOnce(() => Promise.resolve(expectedPassword))

    await sut.execute(data)

    expect(hashProviderEncryptSpy).toHaveBeenCalledTimes(1)
    expect(hashProviderEncryptSpy).toHaveBeenCalledWith(data.password)
    expect(repositoryCreateMethodSpy).toHaveBeenCalledWith({
      ...data,
      password: expectedPassword,
      status: UserStatusEnum.ACTIVE,
    })
  })

  it('should return created user', async () => {
    const { sut, userRepository } = makeSut()

    const repositoryCreateMethodSpy = jest.spyOn(userRepository, 'create')

    const expectedReturn = {
      ...makeTestInputData(),
      role: {
        description: '',
        name: '',
        key: makeTestInputData().roleKey,
        permissions: [],
      },
      id: 1,
      status: UserStatusEnum.ACTIVE,
    }
    repositoryCreateMethodSpy.mockImplementationOnce(() => Promise.resolve(expectedReturn))

    const data = makeTestInputData()

    const result = await sut.execute(data)

    expect(result.isSuccess()).toBe(true)

    if (result.isSuccess()) {
      expect(result.value).toBe(expectedReturn)
    }
  })

  it('should return error if email passed was already taken by another user', async () => {
    const { sut } = makeSut()

    const data = makeTestInputData()

    await sut.execute(data)

    const result = await sut.execute(data)

    expect(result.isFail()).toBe(true)
    if (result.isFail()) {
      expect(result.value).toBeInstanceOf(EmailAlreadyInUseError)
    }
  })
})
