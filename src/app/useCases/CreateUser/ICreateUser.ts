import { UserModel } from 'src/app/models/UserModel'
import { PasswordTooShortError } from 'src/app/errors/PasswordTooShortError'
import { ResultType } from 'src/core/Result'
import { User } from 'src/domain/entities/User'

export type CreateUserResult = ResultType<PasswordTooShortError, UserModel>

export type CreateUserDTO = Omit<User, 'status'>

export interface ICreateUser {
  execute(data: CreateUserDTO): Promise<CreateUserResult>
}
