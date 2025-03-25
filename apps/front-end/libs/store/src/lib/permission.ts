import { Permission } from '@agent-xenon/constants'
import { create } from 'zustand'

interface IUsePermissionStore {
  permissions: Permission[]
}

export const usePermissionStore = create<IUsePermissionStore>(() => ({
  permissions: []
}))

export const setPermissions = (permissions: Permission[]) => {
  usePermissionStore.setState({ permissions })
}

export const checkPermissions = ({ permissions, isPartial = false }: { permissions: Permission[], isPartial?: boolean }) => {
  const userPermissions = usePermissionStore.getState().permissions;
  if (permissions.length === 0) return false;
  const isAllowed = isPartial
    ? permissions.some((permission) => userPermissions.includes(permission))
    : permissions.every((permission) => userPermissions.includes(permission));

  return isAllowed;
};
