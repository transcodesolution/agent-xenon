'use client'
import React from 'react';
import { Button, Stack, Title } from '@mantine/core';
import { useCreateEmployee } from '@agent-xenon/react-query-hooks';
import { IApiResponse, IEmployee } from '@agent-xenon/interfaces';
import { useRouter } from 'next/navigation';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { usePermissions } from '@/libs/hooks/usePermissions';
import { EmployeeFilter } from './_components/EmployeeFilter';
import { EmployeeList } from './_components/EmployeeList';

export default function Page() {
  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee();
  const router = useRouter()
  const permission = usePermissions()

  const handleCreateEmployee = () => {
    createEmployee(
      {},
      {
        onSuccess: (newEmployee: IApiResponse<IEmployee>) => {
          const employeeId = newEmployee?.data?._id
          if (employeeId) {
            router.push(`/employee/${employeeId}`);
          }
        },
        onError: (error) => {
          showNotification({
            title: "Create Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };

  if (!permission?.hasEmployeeRead) return null;

  return (
    <Stack gap='sm'>
      <Title order={4} >Employee</Title>
      {permission.hasEmployeeCreate &&
        <Button component='a' disabled={isCreating} onClick={handleCreateEmployee} w='fit-content' loading={isCreating}>Create +</Button>
      }
      <EmployeeFilter />
      <EmployeeList />
    </Stack>
  )
}