"use client";

import { useGetRoles, useGetUserById } from "@/libs/react-query-hooks/src";
import { useUpdateUser } from "@/libs/react-query-hooks/src/lib/user/useUpdateUser";
import { IUser } from "@agent-xenon/interfaces";
import { Box, Flex, Paper, PasswordInput, Select, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedCallback } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useEffect } from "react";

interface IUserDetail {
  userId: string;
}

type EditableUserFields = Pick<IUser, "firstName" | "lastName" | "email" | "password" | "roleId">;

export const UserDetail = ({ userId }: IUserDetail) => {
  const { mutate: updateUser } = useUpdateUser();
  const { data: rolesResponse } = useGetRoles({ page: 1, limit: 10, search: '' });
  const { data } = useGetUserById({ id: userId });

  const user = data?.data?.user;
  const roles = rolesResponse?.data?.roles || [];

  const handleUpdate = useDebouncedCallback((values: EditableUserFields) => {
    const dirtyFields = form.getDirty();
    const updatedUser: Partial<EditableUserFields> = {};

    Object.keys(dirtyFields).forEach((key) => {
      if (dirtyFields[key as keyof EditableUserFields]) {
        updatedUser[key as keyof EditableUserFields] = values[key as keyof EditableUserFields];
      }
    });

    if (Object.keys(updatedUser).length === 0) {
      return;
    }

    updateUser(
      { _id: user?._id, ...updatedUser },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User Updated Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
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

    form.resetDirty()
  }, 1000);


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
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?':{}|<>]/.test(value)) return "Password must contain at least one special character";
        return null;
      },
    },
    onValuesChange: handleUpdate
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: user.password || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Title order={2} mb="md">
        User Details
      </Title>
      <Flex direction="column" align="center" gap="md">
        <Box w="100%">
          <TextInput
            label="First Name"
            placeholder="Enter First Name"
            mb="md"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter Last Name"
            mb="md"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Email"
            name="email"
            placeholder="Enter Email"
            mb="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter Password"
            required
            {...form.getInputProps("password")}
          />
          <Select
            label="Role"
            placeholder="Select Role"
            data={roles?.map((role, index) => role.name || `role-without-name-${index}`)}
            onChange={(role) => {
              const selectedRole = roles.find((_role) => _role.name === role);
              if (selectedRole) {
                form.setFieldValue('roleId', selectedRole._id)
              }
            }}
          />
        </Box>
      </Flex>
    </Paper>
  );
};