import { Permission } from "@agent-xenon/constants";
import { Accordion, Badge, Checkbox, Flex, Text, Tooltip } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

interface IPermissionList {
  listKey: string;
  listLabel: string;
  permissions: Array<{ label: string; value: Permission }>;
  selectedPermissions: Permission[];
  onPermissionToggle: (permission: Permission) => void;
  onSelectAll: (permissions: Permission[]) => void;
}

export const PermissionList = ({
  listKey,
  listLabel,
  permissions,
  selectedPermissions,
  onPermissionToggle,
  onSelectAll,
}: IPermissionList) => {
  const allSelected = permissions.every((p) =>
    selectedPermissions.includes(p.value)
  );
  const someSelected =
    !allSelected && permissions.some((p) => selectedPermissions.includes(p.value));

  return (
    <Accordion.Item value={listKey} className="rounded-lg border shadow-sm">
      <Accordion.Control>
        <Flex align="center" gap="md">
          <Text fw={500} className="text-lg">{listLabel}</Text>
          <Badge
            variant="light"
            radius="sm"
            leftSection={<IconCheck />}
            className={`${selectedPermissions.filter((p) =>
              permissions.map((x) => x.value).includes(p)
            ).length > 0
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
              }`}
          >
            {selectedPermissions.filter((p) =>
              permissions.map((x) => x.value).includes(p)
            ).length || 0}{" "}
            / {permissions.length}
          </Badge>
        </Flex>
      </Accordion.Control>
      <Accordion.Panel>
        <Flex wrap="wrap" gap="md">
          <Checkbox
            size="md"
            radius="sm"
            label={<Text fw={500}>Select All</Text>}
            checked={allSelected}
            indeterminate={someSelected}
            onChange={() => {
              if (allSelected) {
                onSelectAll([]);
              } else {
                onSelectAll(permissions.map((p) => p.value));
              }
            }}
          />
          {permissions.map((permission) => (
            <Tooltip key={permission.value} label={permission.value} position="top">
              <Checkbox
                label={
                  <Flex align="center" gap="xs">
                    <Text>{permission.label}</Text>
                  </Flex>
                }
                checked={selectedPermissions.includes(permission.value)}
                onChange={() => onPermissionToggle(permission.value)}
                size="md"
                radius="sm"
              />
            </Tooltip>
          ))}
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  );
}
