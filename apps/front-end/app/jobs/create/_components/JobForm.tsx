'use client'
import React, { useState } from 'react'
import { Badge, Box, Button, Chip, Flex, Group, Modal, Paper, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { InterviewRound } from './InterviewRound';
import { IconX } from '@tabler/icons-react';
import classes from './jobForm.module.css'

interface Option {
  value: string;
  label: string;
}


interface JobFormsProps {
  designations: Option[];
  roles: Option[]
}

export const JobForm = ({ designations, roles }: JobFormsProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<string | null>('first');
  const rounds = [{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }]

  return (
    <Stack>
      <Paper withBorder shadow="md" p="md">
        <TextInput label='Title' mb='md' />
        <Textarea label='Description' mb='md' />
        <Flex gap='sm' mb='md' flex={1}>
          <Select label='Designation' data={designations} />
          <Select label='Role' data={roles} />
        </Flex>
        {/* <Textarea label='Qualification Criteria' mb='md' /> */}
        <Button mb='lg' variant='outline' styles={{ root: { width: 'fit-content' } }} onClick={open}>Add Interview Round +</Button>

        <Chip.Group multiple={false} value={value} onChange={setValue} >
          <Group>
            {rounds.map((item, i) => (
              <Box key={i} pos="relative">
                <Chip value={item.value} >
                  {item.label}
                </Chip>
                <Badge size="sm" color="red" circle className={classes.remove_Button} >
                  <IconX size='14' />
                </Badge>

              </Box>
            ))}

          </Group>
        </Chip.Group>
      </Paper>

      <Modal opened={opened} onClose={close} title="Authentication" size='lg' centered>
        <InterviewRound />
      </Modal>
    </Stack >
  )
}
