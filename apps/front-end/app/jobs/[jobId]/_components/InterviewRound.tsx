
import { AnswerInputFormat, Difficulty, InterviewRoundTypes, TechnicalRoundTypes } from '@agent-xenon/constants';
import { IInterviewQuestionAnswer } from '@agent-xenon/interfaces';
import { ActionIcon, Button, Combobox, Flex, Grid, Select, Stack, Textarea, TextInput, useCombobox } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react';


export const InterviewRound = () => {
  const [searchQuestion, setSearchQuestion] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<IInterviewQuestionAnswer[]>([]);
  const [roundType, setRoundType] = useState<InterviewRoundTypes>();
  const [technicalSubType, setTechnicalSubType] = useState<TechnicalRoundTypes | null>(null);
  const combobox = useCombobox();
  const questions: IInterviewQuestionAnswer[] = [
    {
      _id: '1',
      description: 'What is a binary search tree?',
      type: TechnicalRoundTypes.MCQ,
      question: 'What is a binary search tree?',
      promptText: 'Explain the concept of a binary search tree.',
      answerDetails: {
        codeText: '',
        text: 'A binary search tree is a data structure in which each node has at most two children, referred to as the left child and the right child. For each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater than the node.',
      },
      options: [],
      tags: ['data structures', 'trees'],
      difficulty: Difficulty.EASY,
      timeLimitInMinutes: 10,
      evaluationCriteria: 'Correct explanation of binary search tree properties.',
      isAutomated: true,
      organizationId: '123',
      inputFormat: AnswerInputFormat.MCQ,
    }
  ];
  const searchedQuestions = questions.map((question) => (
    <Combobox.Option value={question._id} key={question._id} onClick={() => setSelectedQuestions([...selectedQuestions, question])}>
      {question.question}
    </Combobox.Option>
  ));

  return (
    <Stack>
      <TextInput label='Name' />
      {/* <Select label='Type' data={[]} /> */}
      <Textarea label='Qualification Criteria' />
      <Flex gap='md'>
        <Select
          w={286}
          label='Round Type'
          data={Object.values(InterviewRoundTypes).map((type) => ({ value: type, label: type }))}
          value={roundType}
          onChange={(value) => {
            setRoundType(value as InterviewRoundTypes);
            setTechnicalSubType(null);
          }}
        />
        {roundType === InterviewRoundTypes.TECHNICAL && (
          <Select
            w={286}
            label='Technical Sub Type'
            data={Object.values(TechnicalRoundTypes).map((type) => ({ value: type, label: type }))}
            value={technicalSubType}
            onChange={(value) => setTechnicalSubType(value as TechnicalRoundTypes)}
          />
        )}
      </Flex>
      {technicalSubType === TechnicalRoundTypes.MCQ && (
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
      )}
      {selectedQuestions.map((question) => (
        <Grid key={question._id}>
          <Grid.Col span={9}>{question.question}</Grid.Col>
          <Grid.Col span={3}>
            <ActionIcon variant="light" aria-label="Delete" onClick={() => setSelectedQuestions(selectedQuestions.filter(q => q !== question))}>
              <IconTrash />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      ))}

      <Button mx='auto' styles={{ root: { width: 'fit-content' } }} >Add</Button>
    </Stack >
  );
};