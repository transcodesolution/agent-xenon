import { Stack, Title } from '@mantine/core'
import React from 'react'
import { JobForm } from './_components/JobForm';

const designations = [{ value: 'senior', label: 'Senior' }, { value: 'junior', label: 'Junior' }]
const roles = [{ value: 'softwareEngineer', label: 'Software Engineer' }, { value: 'webDesigner', label: 'Web Designer' }]

export default function page() {

  return (
    <Stack>
      <Title order={4}>Jobs</Title>
      <JobForm designations={designations} roles={roles} />
    </Stack>
  )
}
