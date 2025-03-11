"use client";

import { Box, Flex, Paper, Text, TextInput, Title } from "@mantine/core";
import { setUser, useUserStore } from "../../store/useUserStore";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { IUser } from "@agent-xenon/interfaces";
import { isEquals } from "@/libs/utils/ui-helpers";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { updateUser } from "@/libs/web-apis/src";

export const ProfileDetail = () => {
  const { user } = useUserStore();
  const [userDetails, setUserDetails] = useState<IUser | null>(null);

  useEffect(() => {
    setUserDetails(user ? { ...user } : null);
  }, [user]);

  const debouncedUpdateUser = useDebouncedCallback((updatedUser: IUser) => {
    if (user && !isEquals(updatedUser, user)) {
      updateUser({ _id: user._id, firstName: updatedUser.firstName, lastName: updatedUser.lastName, })
        .then(() => {
          setUser(updatedUser);
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

  const handleChange = (field: keyof IUser, value: string) => {
    if (!userDetails) return;
    const updatedUser = { ...userDetails, [field]: value };
    setUserDetails(updatedUser);
    debouncedUpdateUser(updatedUser);
  };

  if (!userDetails) {
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
            value={userDetails.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={userDetails.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            mb="md"
            required
          />
          <TextInput
            label="Email"
            name="email"
            value={userDetails.email || ""}
            mb="md"
            disabled
          />
        </Box>
      </Flex>
    </Paper>
  );
};
