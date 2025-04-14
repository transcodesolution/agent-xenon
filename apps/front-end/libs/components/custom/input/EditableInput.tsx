import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Textarea,
  Text,
  Group,
  ActionIcon,
  NumberInput,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

export interface EditableInputProps {
  label: string;
  currentValue: string;
  onSave: (value: string) => void;  
  type?: "text" | "password" | "textarea" | "number";
  placeholder?: string;
  inputProps?: Record<string, any>;
}

export const EditableInput = ({
  label,
  currentValue,
  onSave,
  type = "text",
  placeholder,
  inputProps = {},
}: EditableInputProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(currentValue);

  const handleBlur = () => {
    if (editedValue !== currentValue) {
      onSave(editedValue);  
    }
    setIsEditing(false);
  };

  let InputComponent;
  switch (type) {
    case "password":
      InputComponent = PasswordInput;
      break;
    case "textarea":
      InputComponent = Textarea;
      break;
    case "number":
      InputComponent = NumberInput;
      break;
    default:
      InputComponent = TextInput;
  }

  return isEditing ? (
    <InputComponent
      label={label}
      value={type === "number" ? Number(editedValue || currentValue) : editedValue || currentValue}
      onChange={(val: any) =>
        setEditedValue(type === "number" ? String(val) : val.target.value)
      }
      onBlur={handleBlur}
      onKeyDown={(e: any) => {
        if (e.key === "Enter") handleBlur();
      }}
      autoFocus
      placeholder={placeholder}
      {...inputProps}
    />
  ) : (
    <div>
      <Text size="sm" fw={500}>{label}</Text>
      <Group justify="space-between" mt={4}>
        <Text>
          {type === "password" ? "•••••••" : editedValue || currentValue}
        </Text>
        <ActionIcon variant="light" color="blue" onClick={() => setIsEditing(true)}>
          <IconEdit size={18} />
        </ActionIcon>
      </Group>
    </div>
  );
};
