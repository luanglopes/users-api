import { WrongEmailOrPasswordError } from 'src/app/errors/WrongEmailOrPasswordError'
import { IHashProvider } from 'src/app/providers/IHashProvider'
import { ITokenProvider } from 'src/app/providers/ITokenProvider'
import { IFindByUserByEmailRepository } from 'src/app/repositories/IFindUserByEmailRepository'
import { Result } from 'src/core/Result'
import { ILoginUser, LoginUserDTO, LoginUserResult } from './ILoginUser'

export class LoginUserService implements ILoginUser {
  constructor(
    private userRepository: IFindByUserByEmailRepository,
    private hashProvider: IHashProvider,
    private tokenProvider: ITokenProvider,
  ) {}

  async execute({ email, password }: LoginUserDTO): Promise<LoginUserResult> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return Result.fail(new WrongEmailOrPasswordError())
    }

    const passwordMatch = await this.hashProvider.compare(password, user.password)

    if (!passwordMatch) {
      return Result.fail(new WrongEmailOrPasswordError())
    }

    const token = await this.tokenProvider.generate({ sub: user.id })

    return Result.success({
      token,
      user,
    })
  }
}
