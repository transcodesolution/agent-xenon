import { ActionIcon, Button, Combobox, Flex, Select, Stack, Text, Textarea, TextInput, useCombobox } from '@mantine/core';
import { useState, useEffect } from 'react';
import { TechnicalRoundType, InterviewRoundTypes } from '@agent-xenon/constants';
import { useGetInterviewRoundsById, useGetMCQQuestions } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { IconTrash } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { IInterviewRound } from '@agent-xenon/interfaces';

interface IInterviewRoundForm {
  onAddRound: (interviewRound: Partial<IInterviewRound>) => void;
  roundId: string;
  roundNumber: number
}

export const InterviewRound = ({ onAddRound, roundId, roundNumber = 1 }: IInterviewRoundForm) => {
  const { jobId } = useParams<{ jobId: string }>();

  const [searchQuestion, setSearchQuestion] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuestion, 600);

  const { data: mcqQuestionsData } = useGetMCQQuestions({
    searchString: debouncedSearch,
    enabled: debouncedSearch.length > 0,
  });

  const { data: roundData } = useGetInterviewRoundsById({ roundId });

  const [formState, setFormState] = useState<{
    name: string;
    roundType?: InterviewRoundTypes;
    technicalSubType?: TechnicalRoundType;
    qualificationCriteria: string;
    mcqCriteria?: number;
    selectedQuestions: { _id: string; question: string }[];
    endDate: Date | null;
  }>({
    name: '',
    roundType: undefined,
    technicalSubType: undefined,
    qualificationCriteria: '',
    mcqCriteria: undefined,
    selectedQuestions: [],
    endDate: null
  });

  useEffect(() => {
    if (roundData && roundData.data) {
      const round = roundData.data;
      setFormState({
        name: round.name || '',
        roundType: round.type || undefined,
        technicalSubType: round.subType || undefined,
        qualificationCriteria: round.qualificationCriteria || '',
        mcqCriteria: round.mcqCriteria ?? undefined,
        selectedQuestions: Array.isArray(round.questions)
          ? round.questions.map((q) =>
            typeof q === 'string' ? { _id: q, question: '' } : q
          )
          : [],
        endDate: round.endDate ? new Date(round.endDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Set endDate from roundData
      });
    }
  }, [roundData]);

  const handleChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveRound = () => {
    const interviewRound: Partial<IInterviewRound> = {
      name: formState.name,
      type: formState.roundType,
      qualificationCriteria: formState.qualificationCriteria || '',
      ...(formState.roundType === InterviewRoundTypes.TECHNICAL && {
        subType: formState.technicalSubType || undefined,
      }),
      questions: formState.selectedQuestions.map((q) => q._id),
      mcqCriteria: formState.mcqCriteria ?? undefined,
      endDate: formState.endDate ? new Date(formState.endDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };

    if (!roundId) {
      interviewRound.jobId = jobId;
      interviewRound.roundNumber = roundNumber
    } else {
      interviewRound._id = roundId;
    }

    onAddRound?.(interviewRound);
    setFormState({
      name: '',
      roundType: undefined,
      technicalSubType: undefined,
      qualificationCriteria: '',
      mcqCriteria: undefined,
      selectedQuestions: [],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });
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
          onChange={(value) =>
            handleChange('roundType', value as InterviewRoundTypes)
          }
        />
        {formState.roundType === InterviewRoundTypes.TECHNICAL && (
          <Select
            w={286}
            label="Technical Sub Type"
            data={Object.values(TechnicalRoundType).map((type) => ({ value: type, label: type }))}
            value={formState.technicalSubType}
            onChange={(value) => handleChange('technicalSubType', value as TechnicalRoundType)}
          />
        )}
      </Flex>

      {formState.technicalSubType === TechnicalRoundType.MCQ && (
        <>
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              const question = mcqQuestionsData?.data?.find((q) => q._id === val);
              if (question) {
                setFormState((prev) => ({
                  ...prev,
                  selectedQuestions: [...prev.selectedQuestions, question],
                }));
              }
              combobox.closeDropdown();
              setSearchQuestion('');
            }}
          >
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
                    <Combobox.Option key={question._id} value={question._id}>
                      {question.question}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          {formState.selectedQuestions.map((question) => (
            <Flex key={question._id} justify="space-between">
              <Text>{question.question}</Text>
              <ActionIcon
                variant="light"
                aria-label="Delete"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    selectedQuestions: prev.selectedQuestions.filter((q) => q._id !== question._id),
                  }))
                }
                color="red"
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
        </>
      )}

      <DateTimePicker
        label="Round Expiration Date and Time"
        placeholder="Pick date and time"
        value={formState.endDate}
        onChange={(date) => setFormState((prev) => ({ ...prev, endDate: date }))}
        minDate={new Date()}
      />

      <Textarea
        label="Qualification Criteria"
        value={formState.qualificationCriteria}
        onChange={(e) => handleChange('qualificationCriteria', e.target.value)}
      />

      <Button mx="auto" styles={{ root: { width: 'fit-content' } }} onClick={handleSaveRound}>
        {roundId ? 'Update Round' : 'Add Round'}
      </Button>
    </Stack>
  );
};
