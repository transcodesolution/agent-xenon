import { ActionIcon, Button, Combobox, Group, Paper, Select, Stack, Text, Textarea, TextInput, useCombobox } from '@mantine/core';
import { useState, useEffect } from 'react';
import { InterviewRoundTypes } from '@agent-xenon/constants';
import { useGetInterviewRoundsById, useGetAllMCQQuestions } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { IconTrash } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { DateTimePicker } from '@mantine/dates';
import { IInterviewRound } from '@agent-xenon/interfaces';

interface IInterviewRoundForm {
  onAddRound: (interviewRound: Partial<IInterviewRound>) => void;
  roundId: string;
  roundNumber: number;
}

export const InterviewRound = ({ onAddRound, roundId, roundNumber = 1 }: IInterviewRoundForm) => {
  const { jobId } = useParams<{ jobId: string }>();
  const [searchQuestion, setSearchQuestion] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuestion, 600);
  const { data: getAllMCQQuestionsResponse } = useGetAllMCQQuestions({
    searchString: debouncedSearch,
    enabled: debouncedSearch.length > 0,
  });
  const mcqQuestions = getAllMCQQuestionsResponse?.data;

  const { data: getInterviewRoundByIdResponse } = useGetInterviewRoundsById({ roundId });
  const round = getInterviewRoundByIdResponse?.data;

  const [formState, setFormState] = useState<{
    name: string;
    type?: InterviewRoundTypes;
    qualificationCriteria: string;
    selectionMarginInPercentage?: number;
    questions: { _id: string; question: string }[];
    endDate: Date | null;
  }>({
    name: '',
    type: InterviewRoundTypes.ASSESSMENT,
    qualificationCriteria: '',
    selectionMarginInPercentage: undefined,
    questions: [],
    endDate: null,
  });

  useEffect(() => {
    if (round) {
      setFormState({
        name: round.name || '',
        type: round.type || InterviewRoundTypes.ASSESSMENT,
        qualificationCriteria: round.qualificationCriteria || '',
        selectionMarginInPercentage: round.selectionMarginInPercentage ?? undefined,
        questions: round.questions ? round.questions.map((q) => (typeof q === 'string' ? { _id: q, question: '' } : q)) : [],
        endDate: round.endDate ? new Date(round.endDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      });
    }
  }, [round]);

  const handleChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveRound = () => {
    const interviewRound: Partial<IInterviewRound> = {
      name: formState.name,
      type: formState.type,
      qualificationCriteria: formState.qualificationCriteria || '',
      questions: formState.questions.map((q) => q._id),
      selectionMarginInPercentage: formState.selectionMarginInPercentage ?? undefined,
      endDate: formState.endDate ? new Date(formState.endDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };
    if (!roundId) {
      interviewRound.jobId = jobId;
      interviewRound.roundNumber = roundNumber;
    } else {
      interviewRound._id = roundId;
    }

    onAddRound?.(interviewRound);
    setFormState({
      name: '',
      type: InterviewRoundTypes.ASSESSMENT,
      qualificationCriteria: '',
      selectionMarginInPercentage: undefined,
      questions: [],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const validatePercentageInput = (value: string) => /^\d{0,3}$/.test(value) && Number(value) <= 100;

  const selectedQuestionIds = formState.questions?.map((q) => q._id) || [];

  return (
    <Stack>
      <TextInput label="Name" value={formState.name} onChange={(e) => handleChange('name', e.target.value)} />

      <Select
        label="Round Type"
        data={Object.values(InterviewRoundTypes).map((type) => ({ value: type, label: type }))}
        value={formState.type}
        onChange={(value) => handleChange('type', value as InterviewRoundTypes)}
      />

      {formState.type === InterviewRoundTypes.ASSESSMENT && (
        <Stack >
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              const question = mcqQuestions?.find((q) => q._id === val);
              if (question) {
                setFormState((prev) => ({
                  ...prev,
                  questions: [...prev.questions, question],
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
                {mcqQuestions?.length === 0 ? (
                  <Combobox.Empty>Nothing found</Combobox.Empty>
                ) : (
                  mcqQuestions?.filter((question) => !selectedQuestionIds.includes(question._id))
                    .map((question) => (
                      <Combobox.Option key={question._id} value={question._id}>
                        {question.question}
                      </Combobox.Option>
                    ))
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          <Paper withBorder styles={{ root: { maxHeight: '200px', overflowY: 'auto' } }}>
            {formState.questions?.map((question) => (
              <Group key={question._id} p='xs'>
                <Text size="sm" style={{ flex: 1 }}>{question.question}</Text>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      questions: prev.questions?.filter((q) => q._id !== question._id),
                    }))
                  }
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Paper>

          <TextInput
            label="Passing Criteria"
            placeholder="Enter passing percentage"
            value={formState.selectionMarginInPercentage?.toString() || ''}
            onChange={(e) => {
              const value = e.currentTarget.value;
              if (validatePercentageInput(value)) {
                handleChange('selectionMarginInPercentage', value ? parseInt(value, 10) : undefined);
              }
            }}
            type="number"
            rightSection="%"
          />
        </Stack>
      )}

      <DateTimePicker
        label="Round Expiration"
        value={formState.endDate}
        onChange={(date) => handleChange('endDate', date)}
        minDate={new Date()}
        clearable={false}
      />

      <Textarea
        label="Qualification Criteria"
        placeholder="Describe the criteria..."
        value={formState.qualificationCriteria}
        onChange={(e) => handleChange('qualificationCriteria', e.target.value)}
      />

      <Button mx="auto" styles={{ root: { width: 'fit-content' } }} onClick={handleSaveRound}>
        {roundId ? 'Update Round' : 'Add Round'}
      </Button>
    </Stack>
  );
};