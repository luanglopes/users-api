import { UserModel } from 'src/app/models/UserModel'
import {
  CreateDBUserDTO,
  ICreateUserRepository,
} from 'src/app/repositories/ICreateUSerRepository'

export class InMemoryUserRepository implements ICreateUserRepository {
  private users: UserModel[] = []

  async create(data: CreateDBUserDTO): Promise<UserModel> {
    const newUser = {
      id: this.users.length + 1,
      ...data,
    }

    this.users.push(newUser)

    return newUser
  }
}
