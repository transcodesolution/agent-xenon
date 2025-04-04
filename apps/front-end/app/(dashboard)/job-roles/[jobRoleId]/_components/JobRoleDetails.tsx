'use client'
import {
  TextInput,
  Stack,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { Permission } from "@agent-xenon/constants";
import { IconUsers, IconX } from "@tabler/icons-react";
import { useParams } from 'next/navigation';
import { useGetJobRoleById, useUpdateJobRole } from '@agent-xenon/react-query-hooks';
import { showNotification } from "@mantine/notifications";
import { usePermissions } from "@/libs/hooks/usePermissions";
import { useDebouncedCallback } from "@mantine/hooks";

export const JobRoleDetails = () => {
  const { jobRoleId } = useParams<{ jobRoleId: string }>();
  const { data: jobRoles, isLoading } = useGetJobRoleById({ jobRoleId });
  const { mutate: updateRole } = useUpdateJobRole();
  const permission = usePermissions();

  const debouncedUpdate = useDebouncedCallback((field: string, value: string | Permission[]) => {
    updateRole(
      {
        _id: jobRoleId,
        [field]: value,
      },
      {
        onError: (error) => {
          showNotification({
            title: "Update Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  }, 600);

  const handleChange = (field: string, value: string | Permission[]) => {
    if (!permission?.hasJobRoleUpdate) {
      showNotification({
        message: "You do not have permission to update jobRole",
        color: 'red',
      });
      return;
    }

    debouncedUpdate(field, value);
  };

  return (
    <Stack gap="lg">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <TextInput
        label="Name"
        placeholder="Enter jobRole name"
        leftSection={<IconUsers size='18' />}
        defaultValue={jobRoles?.data?.name ?? ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <Textarea
        label="Description"
        placeholder="Enter description"
        defaultValue={jobRoles?.data?.description ?? ""}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </Stack>
  );
};
