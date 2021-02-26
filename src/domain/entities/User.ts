import { UserStatusEnum } from 'src/domain/enums/UserStatusEnum'
import { Role } from './Role'

export type User = {
  name: string
  password: string
  email: string
  status: UserStatusEnum
  role: Role
}
