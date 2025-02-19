import { Permission } from '@agent-xenon/constants'
import { create } from 'zustand'

interface IUsePermissionStore {
  permissions: Permission[]
}

const usePermissionStore = create<IUsePermissionStore>(() => ({
  permissions: []
}))

export const setPermissions = (permissions: Permission[]) => {
  usePermissionStore.setState({ permissions })
}

export const checkPermissions = (permissions: Permission[]) => {
  const userPermissions = usePermissionStore.getState().permissions;
  const isAllowed = permissions.every((permission) => userPermissions.includes(permission));
  return isAllowed;
}