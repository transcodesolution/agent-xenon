"use client";

import { Box, Flex, Paper, Text, Textarea, TextInput, Title } from "@mantine/core";
import { IconBuilding, IconX } from "@tabler/icons-react";
import { setOrganization, useOrganizationStore } from "../../../../libs/store/src/lib/organization";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { IOrganization } from "@agent-xenon/interfaces";
import { isEquals } from "@/libs/utils/ui-helpers";
import { showNotification } from "@mantine/notifications";
import { updateOrganization } from "@agent-xenon/web-apis";

export const OrganizationDetail = () => {
  const { organization } = useOrganizationStore();

  const [organizationDetails, setOrganizationDetails] = useState<IOrganization | null>(null);

  useEffect(() => {
    setOrganizationDetails(organization ? { ...organization } : null);
  }, [organization]);

  const debouncedUpdateOrganization = useDebouncedCallback((updatedOrganization: IOrganization) => {
    if (organization && !isEquals(updatedOrganization, organization)) {
      updateOrganization({ name: updatedOrganization.name, address: updatedOrganization.address, description: updatedOrganization.description })
        .then(() => {
          setOrganization(updatedOrganization);
        }).catch((error) => {
          showNotification({
            title: "Update Failed",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
            color: "red",
            icon: <IconX size={16} />,
          });
        })
    }
  }, 600);

  const handleChange = (field: keyof IOrganization, value: string) => {
    if (!organizationDetails) return;
    const updatedOrganization = { ...organizationDetails, [field]: value };
    setOrganizationDetails(updatedOrganization);
    debouncedUpdateOrganization(updatedOrganization);
  };

  if (!organizationDetails) {
    return <Text>No organization data available</Text>;
  }

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Title order={2} mb="md">Organization Settings</Title>
      <Flex direction="column" align="center" gap="md">
        <Box w="100%">
          <TextInput
            label="Organization Name"
            name="name"
            value={organizationDetails.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            leftSection={<IconBuilding size="18" />}
            required
            mb="md"
          />
          <TextInput
            label="Description"
            name="description"
            value={organizationDetails.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            mb="md"
          />
          <Textarea
            label="Address"
            name="address"
            value={organizationDetails.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Box>
      </Flex>
    </Paper>
  );
};
