"use client";

import { useState, useEffect } from "react";
import { useGetRoles, useGetUserById } from "@/libs/react-query-hooks/src";
import { useUpdateUser } from "@/libs/react-query-hooks/src/lib/user/useUpdateUser";
import { IUser } from "@agent-xenon/interfaces";
import { Box, Flex, Paper, PasswordInput, Select, TextInput, Title, ActionIcon, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconEdit } from "@tabler/icons-react";

interface IUserDetail {
  userId: string;
}

type EditableUserFields = Pick<IUser, "firstName" | "lastName" | "email" | "password" | "roleId">;

export const UserDetail = ({ userId }: IUserDetail) => {
  const { mutate: updateUser } = useUpdateUser();
  const { data: roleDataResponse } = useGetRoles({ page: 1, limit: 10, search: '' });
  const { data } = useGetUserById({ id: userId });

  const user = data?.data?.user;
  const roles = roleDataResponse?.data?.roleData || [];
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const form = useForm<EditableUserFields>({
    mode: "uncontrolled",
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roleId: '',
    },
    validate: {
      email: (value: string) =>
        value.length === 0 ? "Email is required" : /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password: (value) => {
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?':{}|<>]/.test(value)) return "Password must contain at least one special character";
        return null;
      },
    }
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOnChange = useDebouncedCallback((field: string, value: string) => {
    if (!user?._id || value.trim() === "") return;
    form.setFieldValue(field, value);

    updateUser(
      { _id: user._id, [field]: value },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User Updated Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });

          if (field === "email") setIsEditingEmail(false);
          if (field === "password") setIsEditingPassword(false);
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
            color: "red",
            icon: <IconCheck size={16} />,
          });
        },
      }
    );
  }, 1000);

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Title order={2} mb="md">User Details</Title>
      <Flex direction="column" align="center" gap="md">
        <Box w="100%">
          <TextInput
            label="First Name"
            placeholder="Enter First Name"
            mb="md"
            {...form.getInputProps("firstName")}
            onChange={(e) => {
              handleOnChange("firstName", e.target.value);
            }}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter Last Name"
            mb="md"
            {...form.getInputProps("lastName")}
            onChange={(e) => {
              handleOnChange("lastName", e.target.value);
            }}
          />
          {isEditingEmail ? (
            <TextInput
              label="Email"
              placeholder="Enter Email"
              mb="md"
              {...form.getInputProps("email")}
              onBlur={(e) => handleOnChange("email", e.target.value)}
            />
          ) : (
            <Flex align="center" justify="space-between" mb="md">
              <Text>{form.values.email || user?.email}</Text>
              <ActionIcon onClick={() => setIsEditingEmail(true)}>
                <IconEdit size={16} />
              </ActionIcon>
            </Flex>
          )}
          {isEditingPassword ? (
            <PasswordInput
              label="Password"
              placeholder="Enter Password"
              mb="md"
              {...form.getInputProps("password")}
              onBlur={(e) => handleOnChange("password", e.target.value)}
            />
          ) : (
            <Flex align="center" justify="space-between" mb="md">
              <Text>••••••••</Text>
              <ActionIcon onClick={() => setIsEditingPassword(true)}>
                <IconEdit size={16} />
              </ActionIcon>
            </Flex>
          )}
          <Select
            label="Role"
            placeholder="Select Role"
            data={roles?.map((role, index) => role.name || `role-without-name-${index}`)}
            onChange={(role) => {
              const selectedRole = roles.find((_role) => _role.name === role);
              if (selectedRole) {
                handleOnChange("roleId", selectedRole._id);
              }
            }}
          />
        </Box>
      </Flex>
    </Paper>
  );
};
