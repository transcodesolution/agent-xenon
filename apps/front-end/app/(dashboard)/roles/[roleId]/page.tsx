'use client'
import { IRole } from '@agent-xenon/interfaces';
import { TextInput } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { RolePermissionsList } from '../_components/RolePermissionsList';

export default function Page() {
  const [role, setRole] = useState<IRole | null>(null);

  const handleChangeRoleDetails = <K extends keyof IRole>(field: K, value: IRole[K]) => {
    if (role) {
      setRole({
        ...role,
        [field]: value,
      });
    }
  }

  useEffect(() => {
    setRole({
      name: 'Admin',
      permissions: [],
      isAdministratorRole: true,
      _id: '1',
    })
  }, [])

  return (
    <React.Fragment>
      <TextInput label='Name' value={role?.name} onChange={(e) => handleChangeRoleDetails('name', e.target.value)} mb='md' />
      <RolePermissionsList permissions={role?.permissions || []} onChange={(permission) => {
        const currentPermissions = role?.permissions || [];
        if (currentPermissions.includes(permission)) {
          handleChangeRoleDetails('permissions', currentPermissions.filter((p) => p !== permission));
        } else {
          handleChangeRoleDetails('permissions', [...currentPermissions, permission]);
        }
      }} />
    </React.Fragment>
  )
}