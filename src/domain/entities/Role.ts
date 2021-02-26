import { UserRolesEnum } from '../enums/UserRolesEnum'
import { Permission } from './Permission'

export type Role = {
  name: string
  description: string
  key: UserRolesEnum
  permissions: Permission[]
}
