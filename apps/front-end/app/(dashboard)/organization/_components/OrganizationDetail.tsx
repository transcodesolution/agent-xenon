"use client";

import { Box, Flex, Paper, Text, Textarea, TextInput, Title } from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";
import { updateOrganizationData, useOrganizationStore } from "../../store/useOrganizationStore";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "@mantine/hooks";

export const OrganizationDetail = () => {
  const { organization } = useOrganizationStore();

  const [organizationDetails, setOrganizationDetails] = useState({
    name: "",
    description: "",
    address: "",
  });

  useEffect(() => {
    if (organization) {
      setOrganizationDetails({
        name: organization.name || "",
        description: organization.description || "",
        address: organization.address || "",
      });
    }
  }, [organization]);

  const debouncedUpdateOrganization = useDebouncedCallback((updatedDetails) => {
    if (
      organization &&
      (updatedDetails.name !== organization.name ||
        updatedDetails.description !== organization.description ||
        updatedDetails.address !== organization.address)
    ) {
      updateOrganizationData(updatedDetails);
    }
  }, 600);

  const handleChange = (field: "name" | "description" | "address", value: string) => {
    const updatedDetails = { ...organizationDetails, [field]: value };
    setOrganizationDetails(updatedDetails);
    debouncedUpdateOrganization(updatedDetails);
  };

  if (!organization) {
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
            value={organizationDetails.name}
            onChange={(e) => handleChange("name", e.target.value)}
            leftSection={<IconBuilding size="18" />}
            required
            mb="md"
          />
          <TextInput
            label="Description"
            name="description"
            value={organizationDetails.description}
            onChange={(e) => handleChange("description", e.target.value)}
            mb="md"
          />
          <Textarea
            label="Address"
            name="address"
            value={organizationDetails.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Box>
      </Flex>
    </Paper>
  );
};
