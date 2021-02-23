import { UserModel } from 'src/app/models/UserModel'

export type CreateDBUserDTO = Omit<UserModel, 'id'>

export interface ICreateUserRepository {
  create(data: CreateDBUserDTO): Promise<UserModel>
}
