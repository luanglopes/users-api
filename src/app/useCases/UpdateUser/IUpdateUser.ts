import { UserModel } from 'src/app/models/UserModel'
import { PasswordTooShortError } from 'src/app/errors/PasswordTooShortError'
import { ResultType } from 'src/core/Result'
import { User } from 'src/domain/entities/User'
import { RoleKeysEnum } from 'src/domain/enums/RoleKeysEnum'

export type UpdateUserResult = ResultType<PasswordTooShortError, UserModel>

export type UpdateUserDTO = Omit<User, 'password' | 'role'> & {
  password?: User['password'] | null
  roleKey: RoleKeysEnum
}

export interface IUpdateUser {
  execute(id: number, data: UpdateUserDTO): Promise<UpdateUserResult>
}
