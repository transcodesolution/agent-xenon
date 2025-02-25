'use client'
import React, { useState, useEffect } from 'react'
import { Button, Flex, LoadingOverlay, Modal, Paper, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { InterviewRound } from './InterviewRound';
import { useUpdateJob, useJobRoleAndDesignation, useCreateInterviewRound, useDeleteInterviewRounds, useGetJobById, useUpdateInterviewRound } from '@agent-xenon/react-query-hooks';
import { IInterviewRounds } from '@agent-xenon/interfaces';
import { JobInterviewRoundList } from './JobInterviewRoundList';

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

  const designationsOptions = jobRoleAndDesignation?.data?.designationData.map((designation) => ({
    value: designation._id,
    label: designation.name,
  })) || [];

  const rolesOptions = jobRoleAndDesignation?.data?.jobRoleData.map((role) => ({
    value: role._id,
    label: role.name,
  })) || [];

  const handleChange = (field: keyof typeof formState, value: string | null) => {
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

  const handleAddRound = (params: Partial<IInterviewRounds>) => {
    if (selectedRoundId) {
      updateRound(params, {
        onSuccess: () => {
          close();
          refetch()
        },
      });
    } else {
      createRound(params, {
        onSuccess: () => {
          close();
          refetch()
        },
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
        <Button variant='outline' styles={{ root: { width: 'fit-content' } }} onClick={open} mb='md'>
          Add Interview Round +
        </Button>
        <JobInterviewRoundList
          rounds={jobData?.data?.rounds}
          onDeleteRound={onDelete}
          onEditRound={handleEditRound}
        />
      </Paper>

      <Modal opened={opened} onClose={close} title={selectedRoundId ? "Update Interview Round" : "Add Interview Round"} size='lg' centered>
        <InterviewRound onAddRound={handleAddRound} roundId={selectedRoundId ?? ''} />
      </Modal>
    </Stack>
  );
};
