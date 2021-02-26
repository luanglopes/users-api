import { PermissionKeysEnum } from '../enums/PermissionKeysEnum'

export type Permission = {
  name: string
  description: string
  key: PermissionKeysEnum
}
