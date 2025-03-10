"use client";

import { Box, Flex, Paper, Text, TextInput, Title } from "@mantine/core";
import { updateUserData, useUserStore } from "../../store/useUserStore";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";

export const ProfileDetail = () => {
  const { user } = useUserStore();

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (user) {
      setUserDetails({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const debouncedUpdateUser = useDebouncedCallback((updatedDetails) => {
    if (user && (updatedDetails.firstName !== user.firstName || updatedDetails.lastName !== user.lastName)) {
      updateUserData({ ...user, ...updatedDetails });
    }
  }, 600);

  const handleChange = (field: "firstName" | "lastName", value: string) => {
    const updatedDetails = { ...userDetails, [field]: value };
    setUserDetails(updatedDetails);
    debouncedUpdateUser(updatedDetails);
  };

  if (!user) {
    return <Text>No user data available</Text>;
  }

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Title order={2} mb="md">Profile</Title>
      <Flex direction="column" align="center" gap="md">
        <Box w="100%">
          <TextInput
            label="First Name"
            name="firstName"
            value={userDetails.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={userDetails.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Email"
            name="email"
            value={user.email}
            mb="md"
            disabled
          />
        </Box>
      </Flex>
    </Paper>
  );
};
