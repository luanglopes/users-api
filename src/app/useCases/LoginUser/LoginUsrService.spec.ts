import { WrongEmailOrPasswordError } from 'src/app/errors/WrongEmailOrPasswordError'
import { UserModel } from 'src/app/models/UserModel'
import { FakeHashProvider } from 'src/app/providers/fakes/FakeHashProvider'
import { FakeTokenProvider } from 'src/app/providers/fakes/FakeTokenProvider'
import { InMemoryUserRepository } from 'src/app/repositories/fakes/InMemoryUserRepository'
import { RoleKeysEnum } from 'src/domain/enums/RoleKeysEnum'
import { UserStatusEnum } from 'src/domain/enums/UserStatusEnum'
import { ILoginUser } from './ILoginUser'
import { LoginUserService } from './LoginUserService'

describe('LoginUser', () => {
  let sut: ILoginUser
  let hashProvider: FakeHashProvider
  let userRepository: InMemoryUserRepository
  let tokenProvider: FakeTokenProvider
  let testUser: UserModel

  const makeTestUserData = () => {
    return {
      email: 'test@example.com',
      name: 'test',
      password: '12345',
      roleKey: RoleKeysEnum.GENERAL,
      status: UserStatusEnum.ACTIVE,
    }
  }

  const makeTestInputData = () => {
    const user = makeTestUserData()

    return {
      email: user.email,
      password: user.password,
    }
  }

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    hashProvider = new FakeHashProvider()
    tokenProvider = new FakeTokenProvider()
    sut = new LoginUserService(userRepository, hashProvider, tokenProvider)

    testUser = await userRepository.create(makeTestUserData())
  })

  it('should get user from database with provided email', async () => {
    const findUSerByEmailMethodSpy = jest.spyOn(userRepository, 'findByEmail')

    const inputData = makeTestInputData()

    await sut.execute(inputData)

    expect(findUSerByEmailMethodSpy).toHaveBeenCalledWith(inputData.email)
  })

  it('should return an error if no user is found with provided email', async () => {
    const findUSerByEmailMethodSpy = jest.spyOn(userRepository, 'findByEmail')

    findUSerByEmailMethodSpy.mockImplementationOnce(() => Promise.resolve(undefined))

    const inputData = makeTestInputData()

    const result = await sut.execute(inputData)

    expect(result.isFail()).toBe(true)
    if (result.isFail()) {
      expect(result.value).toBeInstanceOf(WrongEmailOrPasswordError)
    }
  })

  it('should use hash provider to compare user password with provided password', async () => {
    const compareMethodSpy = jest.spyOn(hashProvider, 'compare')

    const inputData = makeTestInputData()

    await sut.execute(inputData)

    expect(compareMethodSpy).toHaveBeenCalledWith(inputData.password, testUser.password)
  })

  it('should return an error if provided password is wrong', async () => {
    const compareMethodSpy = jest.spyOn(hashProvider, 'compare')
    compareMethodSpy.mockImplementationOnce(() => Promise.resolve(false))

    const inputData = makeTestInputData()

    const result = await sut.execute(inputData)

    expect(result.isFail()).toBe(true)
    if (result.isFail()) {
      expect(result.value).toBeInstanceOf(WrongEmailOrPasswordError)
    }
  })

  it('should use token provider to generate token with user id as sub', async () => {
    const generateMethodSpy = jest.spyOn(tokenProvider, 'generate')

    const inputData = makeTestInputData()

    await sut.execute(inputData)

    expect(generateMethodSpy).toHaveBeenCalledWith({ sub: testUser.id })
  })

  it('should return user and token if valid credentials are provided', async () => {
    const generateMethodSpy = jest.spyOn(tokenProvider, 'generate')

    const expectedToken = 'token'

    generateMethodSpy.mockImplementationOnce(() => Promise.resolve(expectedToken))

    const inputData = makeTestInputData()

    const result = await sut.execute(inputData)

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.token).toBe(expectedToken)
      expect(result.value.user).toBe(testUser)
    }
  })
})
