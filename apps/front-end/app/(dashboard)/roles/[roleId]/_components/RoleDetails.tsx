import {
  Title,
  TextInput,
  Stack,
  Group,
  Paper,
  Flex,
  LoadingOverlay,
} from "@mantine/core";
import { Permission } from "@agent-xenon/constants";
import { IconUsers, IconX } from "@tabler/icons-react";
import { RolePermissionsList } from "./RolePermissionsList";
import { useParams } from 'next/navigation';
import { useGetRoleById, useUpdateRole } from '@agent-xenon/react-query-hooks';
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { usePermissions } from "@/libs/hooks/usePermissions";

let timeOut: string | number | NodeJS.Timeout | undefined;

export const RoleDetails = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const { data: getRoleResponse, isLoading } = useGetRoleById({ roleId });
  const roleData = getRoleResponse?.data;
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const { mutate: updateRole } = useUpdateRole();
  const permission = usePermissions()

  useEffect(() => {
    if (roleData?.permissions) {
      setSelectedPermissions(roleData.permissions);
    }
  }, [roleData]);

  const handleChange = (field: string, value: string | Permission[]) => {
    if (!permission?.hasRoleUpdate) {
      showNotification({
        message: "You do not have permission to update role",
        color: 'red',
      });
      return;
    }
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      updateRole({
        _id: roleId,
        [field]: value,
      }, {
        onError: (error) => {
          showNotification({
            title: "Update Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      });
    }, 600);
  };

  const handlePermissionsChange = (permissions: Permission[]) => {
    if (!permission?.hasJobRoleUpdate) {
      showNotification({
        message: "You do not have permission to update role",
        color: 'red',
      });
      return;
    }
    setSelectedPermissions(permissions);
    handleChange("permissions", permissions);
  };

  return (
    <Stack gap="lg">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Paper shadow="sm" radius="md" withBorder p='lg'>
        <Stack gap="md">
          <Flex align="center" gap="md">
            <Title order={2}>Role</Title>
          </Flex>
          <Group grow>
            <TextInput
              label="Role Name"
              placeholder="Enter role name"
              leftSection={<IconUsers size='18' />}
              defaultValue={roleData?.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </Group>
        </Stack>
      </Paper>

      <RolePermissionsList
        selectedPermissions={selectedPermissions}
        onPermissionsChange={handlePermissionsChange}
      />
    </Stack>
  );
}
