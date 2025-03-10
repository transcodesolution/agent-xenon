import {
  Title,
  TextInput,
  Stack,
  Group,
  Paper,
  Flex,
} from "@mantine/core";
import { Permission } from "@agent-xenon/constants";
import { IconUsers } from "@tabler/icons-react";
import { IRolePermissionsList } from "./RolePermissionsList";
import { useParams } from 'next/navigation';
import { useGetRoleById, useUpdateRole } from '@agent-xenon/react-query-hooks';
import { useEffect, useState } from "react";

let timeOut: string | number | NodeJS.Timeout | undefined;

export const RoleDetails = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const { data: roleData } = useGetRoleById({ roleId: roleId });
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const { mutate: updateRole } = useUpdateRole();

  useEffect(() => {
    if (roleData?.data?.permissions) {
      setSelectedPermissions(roleData.data.permissions);
    }
  }, [roleData]);

  const handleChange = (field: string, value: string | Permission[]) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      updateRole({
        _id: roleId,
        [field]: value,
      });
    }, 600);
  };

  const handlePermissionsChange = (permissions: Permission[]) => {
    setSelectedPermissions(permissions);
    handleChange("permissions", permissions);
  };

  return (
    <Stack gap="lg">
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
              defaultValue={roleData?.data?.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Group>
        </Stack>
      </Paper>

      <IRolePermissionsList
        selectedPermissions={selectedPermissions}
        onPermissionsChange={handlePermissionsChange}
      />
    </Stack>
  );
}
