import { Button, Stack } from '@mantine/core'
import React from 'react'
import { JobFilter } from './_components/JobFilter'
import { JobLists } from './_components/JobLists'

export default function page() {
  return (
    <Stack gap='sm'>
      <Button component='a' href='/jobs/create' styles={{ root: { width: 'fit-content' } }}>Create +</Button>
      <JobFilter />
      <JobLists />
    </Stack>
  )
}
