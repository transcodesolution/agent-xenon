"use client";
import { IUser } from "@agent-xenon/interfaces";
import { UserForm } from "../_components/UserForm";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useCreateUser } from "@/libs/react-query-hooks/src";

export default function page() {

  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const handleCreateUser = (user: Partial<IUser>) => {
    createUser(
      {
        ...user
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User Created Successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        },
        onError: (error) => {
          showNotification({
            title: "Create Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };
  return <UserForm onSubmit={handleCreateUser} isLoading={isCreating} />;
} 