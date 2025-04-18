'use client';
import {
  TextInput,
  Stack,
  LoadingOverlay,
  Textarea,
  Anchor,
} from "@mantine/core";
import { Permission } from "@agent-xenon/constants";
import { IconX } from "@tabler/icons-react";
import { useParams } from 'next/navigation';
import { showNotification } from "@mantine/notifications";
import { useGetTrainingById, useUpdateTraining } from "@agent-xenon/react-query-hooks";
import { useDebouncedCallback } from "@mantine/hooks";
import { TrainingAssigneesSelector } from "./TrainingAssigneesSelector";
import { useEffect, useState } from "react";
import { IAssignedTraining } from "@agent-xenon/interfaces";
import { IAssignedEmployees } from "@/libs/types-api/src";
import { assignEmployeeToTraining, removeEmployeeFromTraining } from "@/libs/web-apis/src";
import Link from "next/link";

export const TrainingDetails = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { data: getTrainingByIdResponse, isLoading } = useGetTrainingById({ trainingId });
  const { mutate: updateTraining } = useUpdateTraining();
  const training = getTrainingByIdResponse?.data;
  const [selectedEmployees, setSelectedEmployees] = useState<IAssignedEmployees[]>([]);

  useEffect(() => {
    if (training?.assignees) {
      setSelectedEmployees(
        training.assignees.map((assignee: IAssignedTraining) => ({
          id: assignee.employeeId,
          _id: assignee.employee?._id || '',
          firstName: assignee.employee?.firstName || '',
          lastName: assignee.employee?.lastName || '',
        }))
      );
    }
  }, [training?.assignees]);

  const debouncedUpdate = useDebouncedCallback((field: string, value: string | Permission[]) => {
    updateTraining(
      {
        _id: trainingId,
        [field]: value,
      },
      {
        onError: (error) => {
          showNotification({
            title: "Update Failed",
            message: error.message,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  }, 600);

  const handleChange = (field: string, value: string | Permission[]) => {
    debouncedUpdate(field, value);
  };

  const handleAddEmployee = async (employee: IAssignedEmployees) => {
    assignEmployeeToTraining({ trainingId, employeeId: employee._id }).then(() => setSelectedEmployees((prev) => [...prev, employee]));
  };

  const handleRemoveEmployee = async (employee: IAssignedEmployees) => {
    removeEmployeeFromTraining({ trainingId, employeeId: employee._id }).then(() => setSelectedEmployees((prev) => prev.filter((e) => e._id !== employee._id)));
  };

  return (
    <Stack gap="lg">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <TextInput
        label="Name"
        placeholder="Enter training name"
        defaultValue={training?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <Textarea
        label="Description"
        placeholder="Enter description"
        defaultValue={training?.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <TrainingAssigneesSelector
        trainingId={trainingId}
        assignedEmployees={selectedEmployees}
        onAdd={handleAddEmployee}
        onRemove={handleRemoveEmployee}
      />

      <Anchor href={`/trainings/${trainingId}/topics`} component={Link}>
        Manage Topics
      </Anchor>
    </Stack>
  );
};
