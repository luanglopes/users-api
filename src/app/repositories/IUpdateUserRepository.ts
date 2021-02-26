import { UserModel } from 'src/app/models/UserModel'
import { RoleKeysEnum } from 'src/domain/enums/RoleKeysEnum'

export type UpdateDBUserDTO = Omit<UserModel, 'password' | 'role'> & {
  id: UserModel['id']
  password?: UserModel['password'] | null
  roleKey: RoleKeysEnum
}

export interface IUpdateUserRepository {
  update(data: UpdateDBUserDTO): Promise<UserModel>
}
