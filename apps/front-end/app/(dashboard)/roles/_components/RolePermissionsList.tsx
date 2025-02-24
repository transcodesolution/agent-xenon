import { Permission, permissionsListByModuleWise } from '@agent-xenon/constants'
import { Checkbox, Flex, Stack, Title } from '@mantine/core'
import React from 'react'

interface IRolePermissionsList {
  permissions: Permission[];
  onChange: (permissions: Permission) => void;
}

export const RolePermissionsList = ({ permissions, onChange }: IRolePermissionsList) => {

  return (
    <React.Fragment>
      <Stack gap='md'>
        {
          Object.keys(permissionsListByModuleWise).map((module) => {
            return (
              <Stack key={module} gap='sm'>
                <Title order={3} style={{ textTransform: 'capitalize' }}>{module}</Title>
                <Flex gap='sm'>
                  {
                    permissionsListByModuleWise[module].map(({ label, value }) => {
                      return (
                        <Checkbox key={value} id={value} label={label} checked={permissions.includes(value)} onChange={() => onChange(value)} />
                      )
                    })
                  }
                </Flex>
              </Stack>
            )
          }
          )
        }
      </Stack>
    </React.Fragment>
  )
}