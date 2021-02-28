import { WrongEmailOrPasswordError } from 'src/app/errors/WrongEmailOrPasswordError'
import { UserModel } from 'src/app/models/UserModel'
import { ResultType } from 'src/core/Result'

export type LoginUserResult = ResultType<WrongEmailOrPasswordError, { token: string; user: UserModel }>

export type LoginUserDTO = { email: string; password: string }

export interface ILoginUser {
  execute(credentials: LoginUserDTO): Promise<LoginUserResult>
}
