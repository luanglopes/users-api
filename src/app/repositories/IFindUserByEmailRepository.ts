import { UserModel } from '../models/UserModel'

export interface IFindByUserByEmailRepository {
  findByEmail(email: string): Promise<UserModel | undefined>
}
