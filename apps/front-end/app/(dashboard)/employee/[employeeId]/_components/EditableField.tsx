import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Text,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

interface IEditableField {
  label: string;
  currentValue: string;
  onSave: (value: string) => void;
  type?: "text" | "password";
}

export const EditableField = ({ label, currentValue, onSave, type = "text" }: IEditableField) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(currentValue);

  const handleBlur = () => {
    if (editedValue !== currentValue) {
      onSave(editedValue);
    }
    setIsEditing(false);
  };

  const InputComponent = type === "password" ? PasswordInput : TextInput;

  return isEditing ? (
    <InputComponent
      label={label}
      value={editedValue || currentValue}
      onChange={(e) => setEditedValue(e.target.value)}
      onBlur={handleBlur}
      autoFocus
    />
  ) : (
    <div>
      <Text size="sm" fw={500}>{label}</Text>
      <Group justify="space-between" mt={4}>
        <Text>
          {type === "password" ? "•••••••" : editedValue || currentValue}
        </Text>
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => setIsEditing(true)}
        >
          <IconEdit size={18} />
        </ActionIcon>
      </Group>
    </div>
  );
};
