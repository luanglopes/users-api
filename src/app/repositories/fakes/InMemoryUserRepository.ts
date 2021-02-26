import { UserModel } from 'src/app/models/UserModel'
import { CreateDBUserDTO, ICreateUserRepository } from 'src/app/repositories/ICreateUserRepository'
import { IUpdateUserRepository, UpdateDBUserDTO } from 'src/app/repositories/IUpdateUserRepository'
import { IFindByUserByEmailRepository } from '../IFindUserByEmailRepository'

export class InMemoryUserRepository
  implements ICreateUserRepository, IUpdateUserRepository, IFindByUserByEmailRepository {
  private users: UserModel[] = []

  async create(data: CreateDBUserDTO): Promise<UserModel> {
    const { roleKey, ...userData } = data

    const role = {
      description: '',
      key: roleKey,
      name: '',
      permissions: [],
    }

    const newUser = {
      id: this.users.length + 1,
      role: role,
      ...userData,
    }

    this.users.push(newUser)

    return newUser
  }

  async update(data: UpdateDBUserDTO): Promise<UserModel> {
    const userIndex = this.users.findIndex((usr) => usr.id === data.id)

    const user = this.users[userIndex]
    const updatedUser = {
      ...user,
      ...data,
      password: data.password || user.password,
    }

    this.users.splice(userIndex, 1, updatedUser)

    return updatedUser
  }

  async findByEmail(email: string): Promise<UserModel | undefined> {
    const user = this.users.find((usr) => usr.email === email)

    return user
  }
}
