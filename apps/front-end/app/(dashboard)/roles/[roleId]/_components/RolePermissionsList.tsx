import { Permission, permissionsListByModuleWise } from "@agent-xenon/constants";
import {
  Accordion,
  TextInput,
  Stack,
  Text,
  ActionIcon,
  Flex,
  Title,
  Paper,
} from "@mantine/core";
import { IconFilter, IconSearch, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { PermissionList } from "./PermissionList";

interface IRolePermissionsList {
  selectedPermissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
}

export const RolePermissionsList = ({
  selectedPermissions,
  onPermissionsChange,
}: IRolePermissionsList) => {
  const [search, setSearch] = useState("");

  const filteredPermissions = Object.entries(permissionsListByModuleWise).filter(
    ([_, list]) =>
      list.label.toLowerCase().includes(search.toLowerCase()) ||
      list.permissions.some(
        (p) =>
          p.label.toLowerCase().includes(search.toLowerCase()) ||
          p.value.toLowerCase().includes(search.toLowerCase())
      )
  );

  const handlePermissionToggle = (permission: Permission) => {
    if (selectedPermissions.includes(permission)) {
      onPermissionsChange(selectedPermissions.filter((p) => p !== permission));
    } else {
      onPermissionsChange([...selectedPermissions, permission]);
    }
  };

  const handleListSelectAll = (listKey: string, permissions: Permission[]) => {
    const currentListPermissions = permissionsListByModuleWise[listKey].permissions.map(
      (p) => p.value
    );
    const otherPermissions = selectedPermissions.filter(
      (p) => !currentListPermissions.includes(p)
    );
    onPermissionsChange([...otherPermissions, ...permissions]);
  };

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Stack gap="md">
        <Flex justify="space-between" align="center">
          <Title order={3}>Manage Permissions</Title>
          <Text size="sm" c="dimmed">
            {selectedPermissions.length} permissions selected
          </Text>
        </Flex>

        <Flex align="center" gap="sm">
          <TextInput
            placeholder="Search permissions..."
            value={search}
            w="100%"
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<IconSearch size="18" />}
            rightSection={
              search ? (
                <ActionIcon
                  variant="subtle"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <IconX size="18" />
                </ActionIcon>
              ) : (
                <IconFilter size="18" />
              )
            }
          />
        </Flex>

        {filteredPermissions.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No permissions found matching your search
          </Text>
        ) : (
          <Accordion variant="separated">
            {filteredPermissions.map(([key, list]) => (
              <PermissionList
                key={key}
                listKey={key}
                listLabel={list.label}
                permissions={list.permissions}
                selectedPermissions={selectedPermissions}
                onPermissionToggle={handlePermissionToggle}
                onSelectAll={(permissions) =>
                  handleListSelectAll(key, permissions)
                }
              />
            ))}
          </Accordion>
        )}
      </Stack>
    </Paper>
  );
}
