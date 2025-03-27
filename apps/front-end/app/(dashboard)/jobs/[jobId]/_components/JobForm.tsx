'use client'
import React, { useState, useEffect } from 'react'
import { Button, Flex, LoadingOverlay, Modal, Paper, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { InterviewRound } from './InterviewRound';
import { useUpdateJob, useJobRoleAndDesignation, useCreateInterviewRound, useDeleteInterviewRounds, useGetJobById, useUpdateInterviewRound } from '@agent-xenon/react-query-hooks';
import { JobInterviewRoundList } from './JobInterviewRoundList';
import { IInterviewRound } from '@agent-xenon/interfaces';
import { showNotification } from '@mantine/notifications';
import { usePermissions } from '@/libs/hooks/usePermissions';

let timeOut: string | number | NodeJS.Timeout | undefined;

export const JobForm = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { jobId } = useParams<{ jobId: string }>();
  const { data: jobData, isLoading, refetch } = useGetJobById({ jobId: jobId });
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    designation: '',
    role: '',
  });
  const { mutate: updateJob } = useUpdateJob();
  const { data: jobRoleAndDesignation } = useJobRoleAndDesignation();
  const { mutate: createRound, } = useCreateInterviewRound();
  const { mutate: updateRound, } = useUpdateInterviewRound();
  const { deleteInterviewRoundMutation } = useDeleteInterviewRounds();
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const permission = usePermissions()

  const designationsOptions = jobRoleAndDesignation?.data?.designations.map((designation) => ({
    value: designation._id,
    label: designation.name,
  })) || [];

  const rolesOptions = jobRoleAndDesignation?.data?.jobRoles.map((role) => ({
    value: role._id,
    label: role.name,
  })) || [];

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
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      updateJob({
        _id: jobId,
        [field]: value
      });
    }, 600);
  };

  const handleAddRound = (params: Partial<IInterviewRound>) => {
    if (selectedRoundId) {
      updateRound(params, {
        onSuccess: (response) => {
          showNotification({
            message: response.message,
            color: 'green'
          });
          close();
          refetch()
        },
        onError: (error) => {
          showNotification({
            message: error.message,
            color: 'red',
          });
        }
      });
    } else {
      createRound(params, {
        onSuccess: (response) => {
          showNotification({
            message: response.message,
            color: 'green'
          });
          close();
          refetch()
        },
        onError: (error) => {
          showNotification({
            message: error.message,
            color: 'red',
          });
        }
      });
    }
  };

  useEffect(() => {
    if (jobData) {
      setFormState({
        title: jobData?.data?.title || '',
        description: jobData?.data?.description || '',
        designation: jobData?.data?.designation || '',
        role: jobData?.data?.role || '',
      });
    }
  }, [jobData]);

  const onDelete = (roundIds: string[]) => {
    deleteInterviewRoundMutation.mutate(
      { roundIds },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const handleEditRound = (roundId: string) => {
    setSelectedRoundId(roundId);
    open();
  };

  return (
    <Stack pos='relative'>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      <Paper withBorder shadow="md" p="md">
        <TextInput label='Title' value={formState.title} onChange={(e) => handleChange('title', e.target.value)} mb='md' />
        <Textarea label='Description' value={formState.description} onChange={(e) => handleChange('description', e.target.value)} mb='md' />
        <Flex gap='sm' mb='md' flex={1}>
          <Select label='Designation' data={designationsOptions} value={formState.designation} onChange={(val) => handleChange('designation', val)} />
          <Select label='Role' data={rolesOptions} value={formState.role} onChange={(val) => handleChange('role', val)} />
        </Flex>
        {permission.hasInterviewRoundCreate &&
          <Button variant='outline' styles={{ root: { width: 'fit-content' } }} onClick={open} mb='md'>
            Add Interview Round +
          </Button>
        }
        <JobInterviewRoundList
          rounds={jobData?.data?.rounds}
          onDeleteRound={onDelete}
          onEditRound={handleEditRound}
        />
      </Paper>

      <Modal opened={opened} onClose={close} title={selectedRoundId ? "Update Interview Round" : "Add Interview Round"} size='lg' centered>
        <InterviewRound onAddRound={handleAddRound} roundId={selectedRoundId ?? ''} roundNumber={(jobData?.data?.rounds?.length ?? 0) + 1} />
      </Modal>
    </Stack>
  );
};
