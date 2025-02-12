import { Button, Flex, Select, Stack, Textarea, TextInput } from '@mantine/core'
import React from 'react'

const designations = [{ value: 'senior', label: 'Senior' }, { value: 'junior', label: 'Junior' }]
const roles = [{ value: 'softwareEngineer', label: 'Software Engineer' }, { value: 'webDesigner', label: 'Web Designer' }]

export default function page() {
  return (
    <Stack>
      <TextInput label='Title' />
      <Textarea label='Description' />
      <Flex gap='sm'>
        <Select label='Designation' data={designations} />
        <Select label='Role' data={roles} />
      </Flex>
      <Textarea label='Qualification Criteria' />
      <Button variant='outline' styles={{ root: { width: 'fit-content' } }}>Add Interview Round +</Button>
    </Stack>
  )
}
