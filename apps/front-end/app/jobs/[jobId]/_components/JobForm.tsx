'use client'
import React, { useState, useEffect } from 'react'
import { Button, Flex, LoadingOverlay, Modal, Paper, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { useParams } from 'next/navigation';
import { useGetJobById } from '@/libs/react-query-hooks/src';
import { InterviewRound } from './InterviewRound';
import { useUpdateJob, useJobRoleAndDesignation } from '@agent-xenon/react-query-hooks';

interface Option {
  value: string;
  label: string;
}

interface JobFormsProps {
  designations: Option[];
  roles: Option[];
}

let timeOut: string | number | NodeJS.Timeout | undefined;

export const JobForm = ({ designations, roles }: JobFormsProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { jobId } = useParams<{ jobId: string }>();
  const { data: jobData, isLoading } = useGetJobById({ jobId: jobId });
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    designation: '',
    role: '',
  });
  const { mutate: updateJob } = useUpdateJob();
  const { data: jobRoleAndDesignation, isLoading: isJobRolesLoading } = useJobRoleAndDesignation();
  const designationsOptions = jobRoleAndDesignation?.data?.designationData.map((designation) => ({
    value: designation._id,
    label: designation.name,
  })) || [];

  const rolesOptions = jobRoleAndDesignation?.data?.jobRoleData.map((role) => ({
    value: role._id,
    label: role.name,
  })) || [];


  // Set form data when jobData is available
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

  // Handle input changes dynamically
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
        <Button mb='lg' variant='outline' styles={{ root: { width: 'fit-content' } }} onClick={open}>
          Add Interview Round +
        </Button>
      </Paper>

      <Modal opened={opened} onClose={close} title="Add Interview Round" size='lg' centered>
        <InterviewRound />
      </Modal>
    </Stack>
  );
};
