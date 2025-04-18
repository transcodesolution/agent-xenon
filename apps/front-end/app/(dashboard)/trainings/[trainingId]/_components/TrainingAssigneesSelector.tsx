import {
  ActionIcon,
  Avatar,
  Combobox,
  Group,
  Popover,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { IconChevronDown, IconChevronRight, IconTrash } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
import { IAssignedEmployees } from "@/libs/types-api/src";
import { useGetUnassignedEmployees } from "@/libs/react-query-hooks/src";

interface Props {
  trainingId: string;
  assignedEmployees: IAssignedEmployees[];
  onAdd: (emp: IAssignedEmployees) => void | Promise<void>;
  onRemove: (emp: IAssignedEmployees) => void | Promise<void>;
  classNames?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const TrainingAssigneesSelector = ({
  trainingId,
  assignedEmployees,
  onAdd,
  onRemove,
}: Props) => {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchText, 500);
  const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });

  const { data, isLoading } = useGetUnassignedEmployees({
    trainingId,
    searchString: debouncedSearch,
    enabled: debouncedSearch.length > 0,
  });

  const employees = data?.data?.employees || [];

  const [opened, setOpened] = useState(false);
  const firstFive = assignedEmployees.slice(0, 5);
  const extra = assignedEmployees.slice(5);

  const handleSelect = (id: string) => {
    const emp = employees.find((e) => e._id === id);
    if (!emp) return;

    const newEmp: IAssignedEmployees = {
      id: emp._id,
      _id: emp._id,
      firstName: emp.firstName,
      lastName: emp.lastName,
    };

    onAdd(newEmp);
    setSearchText("");
    combobox.closeDropdown();
  };

  const handleRemove = async (emp: IAssignedEmployees) => {
    await onRemove(emp);
  };

  return (
    <Stack gap='xs'>
      <Text fw={500} size="sm">Assigned Employees</Text>
      <Group w="100%" align="center" >
        <Popover width={300} position="bottom-start" withArrow opened={opened} >
          <Popover.Target>
            <ActionIcon onClick={() => setOpened((o) => !o)} variant="light">
              {opened ? <IconChevronDown /> : <IconChevronRight />}
            </ActionIcon>
          </Popover.Target>

          <Popover.Dropdown>
            <Combobox store={combobox} onOptionSubmit={handleSelect}>
              <Combobox.Target>
                <TextInput
                  label="Assign Employees"
                  placeholder="Search employees..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.currentTarget.value);
                    combobox.resetSelectedOption();
                    e.currentTarget.value.trim() === ""
                      ? combobox.closeDropdown()
                      : combobox.openDropdown();
                  }}
                />
              </Combobox.Target>
              <Combobox.Dropdown>
                <Combobox.Options>
                  {isLoading ? (
                    <Combobox.Option disabled value="loading">
                      Loading...
                    </Combobox.Option>
                  ) : employees.length === 0 ? (
                    <Combobox.Empty>No employees found</Combobox.Empty>
                  ) : (
                    employees
                      .filter((emp) => !assignedEmployees.some((sel) => sel._id === emp._id))
                      .map((emp) => (
                        <Combobox.Option key={emp._id} value={emp._id}>
                          {emp.firstName} {emp.lastName}
                        </Combobox.Option>
                      ))
                  )}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>

            <Stack mt="md" gap="xs">
              {assignedEmployees.map((emp) => (
                <Group key={emp._id} justify="space-between" wrap="nowrap">
                  <Group gap="xs">
                    <Avatar color="blue" radius="xl"
                      styles={{
                        placeholder: {
                          fontSize: 'var(--mantine-font-size-xs)',
                        },
                      }}>
                      {getInitials(`${emp.firstName} ${emp.lastName}`)}
                    </Avatar>
                    <Text size="sm">
                      {emp.firstName} {emp.lastName}
                    </Text>
                  </Group>
                  <ActionIcon variant="light" color="red" onClick={() => handleRemove(emp)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>
        <Group gap="xs" wrap="nowrap">
          {assignedEmployees.length === 0 && (
            <Text size="sm" c="dimmed" ta="center">
              No employees assigned
            </Text>
          )}
          <Avatar.Group spacing="sm">
            {firstFive.map((emp) => (
              <Tooltip key={emp._id} label={`${emp.firstName} ${emp.lastName}`} withArrow>
                <Avatar
                  color="blue" radius="xl"
                  styles={{
                    placeholder: {
                      fontSize: 'var(--mantine-font-size-xs)',
                    },
                  }}
                >
                  {getInitials(`${emp.firstName} ${emp.lastName}`)}
                </Avatar>
              </Tooltip>
            ))}
            {extra.length > 0 && (
              <Tooltip
                withArrow
                label={
                  <>
                    {extra.map((e) => (
                      <div key={e._id}>
                        {e.firstName} {e.lastName}
                      </div>
                    ))}
                  </>
                }
              >
                <Avatar color="blue" radius="xl">
                  +{extra.length}
                </Avatar>
              </Tooltip>
            )}
          </Avatar.Group>
        </Group>
      </Group>
    </Stack>
  );
};
