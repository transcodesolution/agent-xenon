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

export interface IEditableInput {
  label: string;
  currentValue: string;
  onSave: (value: string) => void;
  type?: "text" | "password" | "textarea" | "number";
  placeholder?: string;
  inputProps?: Record<string, unknown>;
}

export const EditableInput = ({
  label,
  currentValue,
  onSave,
  type = "text",
  placeholder,
  inputProps = {},
}: IEditableInput) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(currentValue);

  const handleBlur = () => {
    if (editedValue !== currentValue) {
      onSave(editedValue);
    }
    setIsEditing(false);
  };

  let InputComponent:
    | typeof TextInput
    | typeof PasswordInput
    | typeof Textarea
    | typeof NumberInput;

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

  const handleChange = (eventOrValue: unknown) => {
    if (type === "number") {
      setEditedValue(String(eventOrValue ?? ""));
    } else if (
      typeof eventOrValue === "object" &&
      eventOrValue !== null &&
      "target" in eventOrValue &&
      eventOrValue.target instanceof HTMLInputElement
    ) {
      setEditedValue(eventOrValue.target.value);
    }
  };

  return isEditing ? (
    <InputComponent
      label={label}
      value={editedValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={(e) => {
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