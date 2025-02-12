import { ActionIcon, Combobox, Grid, Select, Stack, Textarea, TextInput, useCombobox } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react'

const questions = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];
const questionTypes = [{ value: 'mcq', label: 'MCQ' }, { value: 'code', label: 'Code' },{ value: 'code', label: 'Code' }]

export const InterviewRound = () => {
  const [searchQuestion, setSearchQuestion] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])
  const combobox = useCombobox();

  const searchedQuestions = questions.map((item) => (
    <Combobox.Option value={item} key={item} onClick={() => setSelectedQuestions([...selectedQuestions, item])}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Stack>
      <TextInput label='Name' />
      <Select label='Designation' data={designations} />

      <Textarea label='Qualification Criteria' />

      <Combobox>
        <Combobox.Target>
          <TextInput
            label="Pick value or type anything"
            placeholder="Pick value or type anything"
            value={searchQuestion}
            onChange={(event) => {
              setSearchQuestion(event.currentTarget.value);
              combobox.openDropdown();
              combobox.updateSelectedOptionIndex();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
          />
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {questions.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : searchedQuestions}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      {selectedQuestions.map((question) =>
      (<Grid key={question}>
        <Grid.Col span={9}>{question}</Grid.Col>
        <Grid.Col span={3}>
          <ActionIcon variant="light" aria-label="Delete">
            <IconTrash />
          </ActionIcon>
        </Grid.Col>
      </Grid>))}
    </Stack>
  )
}