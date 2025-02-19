import { PATH_AUTH } from '@/libs/routes';
import { getPermissions } from '@/libs/web-apis/src/lib/permission';
import { Permission } from '@agent-xenon/constants';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

interface IProtectedLayoutWrapper {
  permissions: Permission[];
  children: ReactNode
}
export const ProtectedLayoutWrapper = async ({ permissions, children }: IProtectedLayoutWrapper) => {
  const userPermissions = (await getPermissions()).data.permissions;

  const isUserHavePermissionToAccess = permissions.every((permission) => userPermissions.includes(permission))

  if (isUserHavePermissionToAccess) {
    return children
  }

  redirect(`${PATH_AUTH.signin}`)
}