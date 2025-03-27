import { useGetRoles } from "@/libs/react-query-hooks/src";
import { IUser } from "@agent-xenon/interfaces";
import { Box, Flex, Paper, PasswordInput, Select, TextInput, Title, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

interface IUserFormProps {
  onSubmit: (values: Partial<IUser>) => void;
  isLoading?: boolean;
  user?: IUser;
}

type EditableUserFields = Pick<IUser, "firstName" | "lastName" | "email" | "password" | "roleId">;

export const UserForm = ({ onSubmit, isLoading, user }: IUserFormProps) => {
  const { data: roleDataResponse } = useGetRoles({ page: 1, limit: 10, search: '' });
  const roles = roleDataResponse?.data?.roleData || [];

  const form = useForm<EditableUserFields>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      roleId: user?.roleId || "",
    },
    validate: {
      firstName: (value) => (value.trim() ? null : "First name is required"),
      lastName: (value) => (value.trim() ? null : "Last name is required"),
      email: (value) => (value.trim() ? (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format") : "Email is required"),
      password: (value) => (!user && !value.trim() ? "Password is required" : null), // Required only for new users
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        roleId: user.roleId || "",
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!form.validate().hasErrors) {
      onSubmit?.(form.values);
    }
  };

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Flex direction="column" align="center" gap="md">
        <Box w="100%">
          <TextInput label="First Name" placeholder="Enter First Name" mb="md" {...form.getInputProps("firstName")} />
          <TextInput label="Last Name" placeholder="Enter Last Name" mb="md" {...form.getInputProps("lastName")} />
          <TextInput label="Email" placeholder="Enter Email" mb="md" {...form.getInputProps("email")} />
          <PasswordInput label="Password" placeholder="Enter Password" mb="md" {...form.getInputProps("password")} />
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
          <Flex mt="md" justify="flex-end" gap="sm">
            <Button onClick={handleSubmit} loading={isLoading}>
              {user ? "Save User" : "Create User"}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Paper>
  );
};
