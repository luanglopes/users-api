import { UserStatusEnum } from 'src/domain/enums/UserStatusEnum'
import { UserRolesEnum } from 'src/domain/enums/UserRolesEnum'

export type User = {
  name: string
  password: string
  email: string
  status: UserStatusEnum
  role: UserRolesEnum
}
