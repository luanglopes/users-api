import { EmailAlreadyInUseError } from 'src/app/errors/EmailAlreadyInUseError'
import { PasswordTooShortError } from 'src/app/errors/PasswordTooShortError'
import { IHashProvider } from 'src/app/providers/IHashProvider'
import { IFindByUserByEmailRepository } from 'src/app/repositories/IFindUserByEmailRepository'
import { IUpdateUserRepository } from 'src/app/repositories/IUpdateUserRepository'
import { Result } from 'src/core/Result'
import { IUpdateUser, UpdateUserDTO, UpdateUserResult } from './IUpdateUser'

export class UpdateUserService implements IUpdateUser {
  constructor(
    private userRepository: IUpdateUserRepository &
      IFindByUserByEmailRepository,
    private hashProvider: IHashProvider,
  ) {}

  async execute(id: number, data: UpdateUserDTO): Promise<UpdateUserResult> {
    const minPasswordLength = 5

    const userWithEmail = await this.userRepository.findByEmail(data.email)

    if (userWithEmail && userWithEmail.id !== id) {
      return Result.fail(new EmailAlreadyInUseError(data.email))
    }

    if (data.password && data.password.length < minPasswordLength) {
      return Result.fail(new PasswordTooShortError(minPasswordLength))
    }

    const userData = { ...data }

    if (userData.password) {
      userData.password = await this.hashProvider.encrypt(userData.password)
    } else {
      delete userData.password
    }

    const updatedUser = await this.userRepository.update({ id, ...userData })

    return Result.success(updatedUser)
  }
}
