import { useState, useMemo } from 'react';
import { Box, Tabs, Text, Badge, Group, Stack } from '@mantine/core';
import { IconCode, IconFileText, IconListCheck } from '@tabler/icons-react';
import { QuestionCard } from './QuestionCard';
import { IApplicantQuestionAnswer } from '@agent-xenon/interfaces';

interface IQuestionTabs {
  questions: IApplicantQuestionAnswer[] | [];
}

export const QuestionTabs = ({ questions }: IQuestionTabs) => {
  const [activeTab, setActiveTab] = useState<string | null>('all');

  const codeQuestions = useMemo(() =>
    questions.filter(q => q.questionFormat === 'code'),
    [questions]
  );

  const textQuestions = useMemo(() =>
    questions.filter(q => q.questionFormat === 'text'),
    [questions]
  );

  const mcqQuestions = useMemo(() =>
    questions.filter(q => q.questionFormat === 'mcq'),
    [questions]
  );

  const getFilteredQuestions = () => {
    switch (activeTab) {
      case 'code':
        return codeQuestions;
      case 'text':
        return textQuestions;
      case 'mcq':
        return mcqQuestions;
      default:
        return questions;
    }
  };

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        mb="md"
      >
        <Tabs.List>
          <Tabs.Tab
            value="all"
          >
            <Group>
              <Text>All Questions</Text>
              <Badge size="sm" variant="filled" color="blue">
                {questions.length}
              </Badge>
            </Group>
          </Tabs.Tab>

          <Tabs.Tab
            value="code"
          >
            <Group>
              <IconCode size={16} />
              <Text>Code</Text>
              <Badge size="sm" variant="filled" color="blue">
                {codeQuestions.length}
              </Badge>
            </Group>
          </Tabs.Tab>

          <Tabs.Tab
            value="text"
          >
            <Group>
              <IconFileText size={16} />
              <Text>Text</Text>
              <Badge size="sm" variant="filled" color="blue">
                {textQuestions.length}
              </Badge>
            </Group>
          </Tabs.Tab>

          <Tabs.Tab
            value="mcq"
          >
            <Group>
              <IconListCheck size={16} />
              <Text>MCQ</Text>
              <Badge size="sm" variant="filled" color="blue">
                {mcqQuestions.length}
              </Badge>
            </Group>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Group h='calc(100vh - 445px)' styles={{ root: { overflowY: "auto" } }} justify='center'>
        {getFilteredQuestions().map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
        {
          getFilteredQuestions().length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No questions found in this category
            </Text>
          )
        }
      </Group>

    </Box >
  );
}