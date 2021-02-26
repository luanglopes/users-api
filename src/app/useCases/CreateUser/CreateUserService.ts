import { EmailAlreadyInUseError } from 'src/app/errors/EmailAlreadyInUseError'
import { PasswordTooShortError } from 'src/app/errors/PasswordTooShortError'
import { IHashProvider } from 'src/app/providers/IHashProvider'
import { ICreateUserRepository } from 'src/app/repositories/ICreateUSerRepository'
import { IFindByUserByEmailRepository } from 'src/app/repositories/IFindUserByEmailRepository'
import { Result } from 'src/core/Result'
import { UserStatusEnum } from 'src/domain/enums/UserStatusEnum'
import { CreateUserDTO, CreateUserResult, ICreateUser } from './ICreateUser'

export class CreateUserService implements ICreateUser {
  constructor(
    private userRepository: ICreateUserRepository & IFindByUserByEmailRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute(data: CreateUserDTO): Promise<CreateUserResult> {
    const minPasswordLength = 5

    if (data.password.length < minPasswordLength) {
      return Result.fail(new PasswordTooShortError(minPasswordLength))
    }

    const userWithEmail = await this.userRepository.findByEmail(data.email)

    if (userWithEmail) {
      return Result.fail(new EmailAlreadyInUseError(data.email))
    }

    const hashedPassword = await this.hashProvider.encrypt(data.password)

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      status: UserStatusEnum.ACTIVE,
    })

    return Result.success(user)
  }
}
