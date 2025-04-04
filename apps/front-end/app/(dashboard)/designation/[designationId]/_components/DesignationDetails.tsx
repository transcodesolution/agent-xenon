'use client'
import {
  TextInput,
  Stack,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";
import { Permission } from "@agent-xenon/constants";
import { IconX } from "@tabler/icons-react";
import { useParams } from 'next/navigation';
import { showNotification } from "@mantine/notifications";
import { usePermissions } from "@/libs/hooks/usePermissions";
import { useGetDesignationById, useUpdateDesignation } from "@agent-xenon/react-query-hooks";
import { useDebouncedCallback } from "@mantine/hooks";

export const DesignationDetails = () => {
  const { designationId } = useParams<{ designationId: string }>();
  const { data: designation, isLoading } = useGetDesignationById({ designationId: designationId });
  const { mutate: updateDesignation } = useUpdateDesignation();
  const permission = usePermissions();

  const debouncedUpdate = useDebouncedCallback((field: string, value: string | Permission[]) => {
    updateDesignation(
      {
        _id: designationId,
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
    if (!permission?.hasDesignationUpdate) {
      showNotification({
        message: "You do not have permission to update designation",
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
        placeholder="Enter designation name"
        defaultValue={designation?.data?.name ?? ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <Textarea
        label="Description"
        placeholder="Enter description"
        defaultValue={designation?.data?.description ?? ""}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </Stack>
  );
};
