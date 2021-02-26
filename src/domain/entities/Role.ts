import { RoleKeysEnum } from '../enums/RoleKeysEnum'
import { Permission } from './Permission'

export type Role = {
  name: string
  description: string
  key: RoleKeysEnum
  permissions: Permission[]
}
