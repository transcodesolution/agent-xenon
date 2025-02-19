import { IInterviewRounds } from '@agent-xenon/interfaces';
import { ActionIcon, Button, Combobox, Flex, Select, Stack, Text, Textarea, TextInput, useCombobox } from '@mantine/core';
import { useState } from 'react';
import { TechnicalRoundTypes, InterviewRoundTypes } from '@agent-xenon/constants';
import { useGetMCQQuestions } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import React from 'react';
import { IconTrash } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';

interface InterviewRoundProps {
  onAddRound: (params: Partial<IInterviewRounds>) => void;
}

export const InterviewRound = ({ onAddRound }: InterviewRoundProps) => {
  const { jobId } = useParams<{ jobId: string }>();

  const [searchQuestion, setSearchQuestion] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuestion, 600);
  const { data: mcqQuestionsData } = useGetMCQQuestions({ searchString: debouncedSearch, enabled: debouncedSearch.length > 0 });
  const [formState, setFormState] = useState<{
    name: string;
    roundType?: InterviewRoundTypes;
    technicalSubType?: TechnicalRoundTypes;
    qualificationCriteria: string;
    mcqCriteria?: number;
    selectedQuestions: { _id: string; question: string }[];
  }>({
    name: '',
    roundType: undefined,
    technicalSubType: undefined,
    qualificationCriteria: '',
    mcqCriteria: undefined,
    selectedQuestions: [],
  });

  const handleChange = <K extends keyof typeof formState>(key: K, value: typeof formState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddRound = () => {
    const params: Partial<IInterviewRounds> = {
      type: formState.roundType,
      qualificationCriteria: formState.qualificationCriteria,
      jobId,
      ...(formState.roundType === InterviewRoundTypes.TECHNICAL && { subType: formState.technicalSubType }),
      ...(formState.technicalSubType === TechnicalRoundTypes.MCQ &&
        formState.selectedQuestions.length > 0 && {
        questions: formState.selectedQuestions.map((q) => q._id),
      }),
      ...(formState.technicalSubType === TechnicalRoundTypes.MCQ && {
        mcqCriteria: formState.mcqCriteria,
      }),
    };
    onAddRound?.(params);
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Stack>
      <TextInput label="Name" value={formState.name} onChange={(e) => handleChange('name', e.target.value)} />
      <Flex gap="md">
        <Select
          w={286}
          label="Round Type"
          data={Object.values(InterviewRoundTypes).map((type) => ({ value: type, label: type }))}
          value={formState.roundType}
          onChange={(value) => {
            handleChange('roundType', value as InterviewRoundTypes);
            handleChange('technicalSubType', value === InterviewRoundTypes.TECHNICAL ? TechnicalRoundTypes.MCQ : undefined);
          }}
        />
        {formState.roundType === InterviewRoundTypes.TECHNICAL && (
          <Select
            w={286}
            label="Technical Sub Type"
            data={Object.values(TechnicalRoundTypes).map((type) => ({ value: type, label: type }))}
            value={formState.technicalSubType}
            onChange={(value) => handleChange('technicalSubType', value as TechnicalRoundTypes)}
          />
        )}
      </Flex>

      {formState.technicalSubType === TechnicalRoundTypes.MCQ && (
        <React.Fragment>
          <Combobox store={combobox} onOptionSubmit={(val) => {
            const question = mcqQuestionsData?.data?.find((question) => question._id === val);
            if (question) {
              setFormState((prev) => ({
                ...prev,
                selectedQuestions: [...prev.selectedQuestions, question],
              }));
            }
            combobox.closeDropdown();
            setSearchQuestion('');
          }}>
            <Combobox.Target>
              <TextInput
                label="Pick a question"
                placeholder="Search or select a question"
                value={searchQuestion}
                onChange={(e) => {
                  setSearchQuestion(e.target.value);
                  combobox.resetSelectedOption();
                  if (e.currentTarget.value.trim() === '') {
                    combobox.closeDropdown();
                  } else {
                    combobox.openDropdown();
                  }
                }}
              />
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                {mcqQuestionsData?.data?.length === 0 ? (
                  <Combobox.Empty>Nothing found</Combobox.Empty>
                ) : (
                  mcqQuestionsData?.data?.map((question) => (
                    <Combobox.Option
                      key={question._id}
                      value={question._id}
                    >
                      {question.question}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          {formState.selectedQuestions.map((question) => (
            <Flex key={question._id} justify='space-between'>
              <Text >{question.question}</Text>
              <ActionIcon
                variant="light"
                aria-label="Delete"
                onClick={() => {
                  setFormState((prev) => ({
                    ...prev,
                    selectedQuestions: prev.selectedQuestions.filter((q) => q._id !== question._id),
                  }));
                }}
                color='red'
              >
                <IconTrash />
              </ActionIcon>
            </Flex>
          ))}
          <TextInput
            label="MCQ Criteria"
            placeholder="Enter MCQ Criteria"
            value={formState.mcqCriteria || ''}
            onChange={(event) => handleChange('mcqCriteria', Number(event.currentTarget.value))}
            type="number"

          />
        </React.Fragment>
      )
      }

      <Textarea
        label="Qualification Criteria"
        value={formState.qualificationCriteria}
        onChange={(e) => handleChange('qualificationCriteria', e.target.value)}
      />

      <Button mx="auto" styles={{ root: { width: 'fit-content' } }} onClick={handleAddRound}>
        Add Round
      </Button>
    </Stack >
  );
};
