import { UserModel } from 'src/app/models/UserModel'
import { RoleKeysEnum } from 'src/domain/enums/RoleKeysEnum'

export type CreateDBUserDTO = Omit<UserModel, 'id' | 'role'> & { roleKey: RoleKeysEnum }

export interface ICreateUserRepository {
  create(data: CreateDBUserDTO): Promise<UserModel>
}
