import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Textarea,
  Text,
  Group,
  ActionIcon,
  NumberInput,
  Box,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

export interface IEditableInput {
  label?: string;
  currentValue: string;
  onSave: (value: string) => void;
  type?: "text" | "password" | "textarea" | "number";
  placeholder?: string;
  inputProps?: Record<string, unknown>;
  isEditInput?: boolean;
  renderValue?: (value: string) => React.ReactNode;
}

export const EditableInput = ({
  label,
  currentValue,
  onSave,
  type = "text",
  placeholder,
  inputProps = {},
  isEditInput = false,
  renderValue
}: IEditableInput) => {
  const [isEditing, setIsEditing] = useState(isEditInput);
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
    <Box w='100%' p='0'>
      {label && <Text size="sm" fw={500} pb={4}>{label}</Text>}
      <Group justify="space-between" >
        {renderValue ? (
          renderValue(editedValue || currentValue)
        ) : (
          <Text>{type === "password" ? "•••••••" : editedValue || currentValue}</Text>
        )}
        <ActionIcon variant="transparent" color="blue" onClick={() => setIsEditing(true)}>
          <IconEdit size={18} />
        </ActionIcon>
      </Group>
    </Box>
  );
};