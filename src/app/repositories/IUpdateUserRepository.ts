import { UserModel } from 'src/app/models/UserModel'

export type UpdateDBUserDTO = Omit<UserModel, 'password'> & {
  id: UserModel['id']
  password?: UserModel['password'] | null
}

export interface IUpdateUserRepository {
  update(data: UpdateDBUserDTO): Promise<UserModel>
}
