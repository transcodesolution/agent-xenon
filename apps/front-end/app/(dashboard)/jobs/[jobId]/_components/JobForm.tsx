'use client'
import React, { useState, useEffect } from 'react'
import { Button, Flex, LoadingOverlay, Modal, Paper, Select, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { InterviewRound } from './InterviewRound';
import {
  useUpdateJob,
  useJobRoleAndDesignation,
  useCreateInterviewRound,
  useDeleteInterviewRounds,
  useGetJobById,
  useUpdateInterviewRound,
  useUpdateInterviewRoundOrder,
} from '@agent-xenon/react-query-hooks';
import { JobInterviewRoundList } from './JobInterviewRoundList';
import { IInterviewRound } from '@agent-xenon/interfaces';
import { showNotification } from '@mantine/notifications';
import { usePermissions } from '@/libs/hooks/usePermissions';

export const JobForm = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { jobId } = useParams<{ jobId: string }>();
  const { data: getJobByIdResponse, isLoading, refetch } = useGetJobById({ jobId });
  const [rounds, setRounds] = useState<IInterviewRound[]>([]);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    designation: '',
    role: '',
  });

  const { mutate: updateJob } = useUpdateJob();
  const { data: jobRoleAndDesignationResponse } = useJobRoleAndDesignation();
  const { mutate: createRound } = useCreateInterviewRound();
  const { mutate: updateRound } = useUpdateInterviewRound();
  const { mutate: updateRoundOrder } = useUpdateInterviewRoundOrder();
  const { deleteInterviewRoundMutation } = useDeleteInterviewRounds();
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const permission = usePermissions();
  const job = getJobByIdResponse?.data;
  const jobRoleAndDesignation = jobRoleAndDesignationResponse?.data

  useEffect(() => {
    if (job) {
      setRounds(job.rounds as IInterviewRound[]);
      setFormState({
        title: job.title || '',
        description: job.description || '',
        designation: job.designation?._id || '',
        role: job.role?._id || '',
      });
    }
  }, [job]);

  const designationsOptions =
    jobRoleAndDesignation?.designations.map((designation) => ({
      value: designation._id,
      label: designation.name,
    })) || [];

  const rolesOptions =
    jobRoleAndDesignation?.jobRoles.map((role) => ({
      value: role._id,
      label: role.name,
    })) || [];

  const debouncedUpdateJob = useDebouncedCallback((field: keyof typeof formState, value: string | null) => {
    updateJob({
      _id: jobId,
      [field]: value,
    });
  }, 600);

  const handleChange = (field: keyof typeof formState, value: string | null) => {
    if (!permission?.hasJobUpdate) {
      showNotification({
        message: "You do not have permission to update job",
        color: 'red',
      });
      return;
    }

    const updatedFormState = {
      ...formState,
      [field]: value,
    };

    setFormState(updatedFormState);
    debouncedUpdateJob(field, value);
  };

  const handleAddRound = (params: Partial<IInterviewRound>) => {
    if (selectedRoundId) {
      updateRound(params, {
        onSuccess: (response) => {
          showNotification({ message: response.message, color: 'green' });
          close();
          refetch();
        },
        onError: (error) => {
          showNotification({ message: error.message, color: 'red' });
        },
      });
    } else {
      createRound(params, {
        onSuccess: (response) => {
          showNotification({ message: response.message, color: 'green' });
          close();
          refetch();
        },
        onError: (error) => {
          showNotification({ message: error.message, color: 'red' });
        },
      });
    }
  };

  const onDelete = (roundIds: string[]) => {
    deleteInterviewRoundMutation.mutate(
      { roundIds },
      {
        onSuccess: () => {
          setRounds((prev) => prev.filter((r) => !roundIds.includes(r._id)));
        },
      }
    );
  };

  const handleEditRound = (roundId: string) => {
    setSelectedRoundId(roundId);
    open();
  };

  const handleReorderRounds = (reorderedIds: string[]) => {
    const newOrder = reorderedIds
      .map((id) => rounds.find((r) => r._id === id))
      .filter((r): r is IInterviewRound => !!r);

    setRounds(newOrder);

    if (!permission?.hasInterviewRoundUpdate) {
      showNotification({
        message: 'You do not have permission to reorder rounds',
        color: 'red',
      });
      return;
    }

    updateRoundOrder(
      { roundOrderIds: reorderedIds },
      {
        onError: (error) => {
          showNotification({
            message: error.message || 'Failed to reorder rounds',
            color: 'red',
          });
          refetch();
        },
      }
    );
  };

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Paper withBorder shadow="md" p="md">
        <TextInput
          label="Title"
          value={formState.title}
          onChange={(e) => handleChange('title', e.target.value)}
          mb="md"
        />
        <Textarea
          label="Description"
          value={formState.description}
          onChange={(e) => handleChange('description', e.target.value)}
          mb="md"
        />
        <Flex gap="sm" mb="md">
          <Select
            label="Designation"
            data={designationsOptions}
            value={formState.designation}
            onChange={(val) => handleChange('designation', val)}
            w='100%'
          />
          <Select
            label="Role"
            data={rolesOptions}
            value={formState.role}
            onChange={(val) => handleChange('role', val)}
            w='100%'
          />
        </Flex>
        <Flex justify="space-between" align="center" mb="md">
          <Text fw="500" size="lg">
            Interview Round
          </Text>
          {permission.hasInterviewRoundCreate && (
            <Button onClick={open}>
              Add +
            </Button>
          )}
        </Flex>
        <JobInterviewRoundList
          rounds={rounds}
          onDeleteRound={onDelete}
          onEditRound={handleEditRound}
          onReorderRounds={handleReorderRounds}
        />
      </Paper>

      <Modal
        opened={opened}
        onClose={() => {
          setSelectedRoundId(null);
          close();
        }}
        title={selectedRoundId ? 'Update Interview Round' : 'Add Interview Round'}
        size="lg"
        centered
      >
        <InterviewRound
          onAddRound={handleAddRound}
          roundId={selectedRoundId ?? ''}
          roundNumber={(rounds.length ?? 0) + 1}
        />
      </Modal>
    </Stack>
  );
};

export default JobForm;
