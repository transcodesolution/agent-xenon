import React, { useState } from 'react';
import {
  Textarea,
  Button,
  Box,
  Group,
  Text,
  Stack,
  Paper,
  Title,
  ScrollArea,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { IInterviewQuestion, ITopicSection } from '@agent-xenon/interfaces';
import { updateSectionToTopic } from '@/libs/store/src/lib/topic';
import { TopicSectionType } from '@agent-xenon/constants';
import { useParams } from 'next/navigation';

interface IPracticalSection {
  section: ITopicSection;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const PracticalSection = ({ section, isEditing, setIsEditing }: IPracticalSection) => {
  const practicalConfig = section.topicSectionConfig[TopicSectionType.PRACTICAL] || { questions: [] };
  const { topicId } = useParams() as { topicId: string };

  const [questions, setQuestions] = useState<{ question: IInterviewQuestion, questionId: string }[]>(practicalConfig.questions || []);
  const [newQuestion, setNewQuestion] = useState<IInterviewQuestion>({ question: '' } as IInterviewQuestion);

  const handleSave = async () => {
    try {
      await updateSectionToTopic({
        _id: section._id,
        topicId: topicId,
        topicSectionConfig: {
          ...section.topicSectionConfig,
          [TopicSectionType.PRACTICAL]: {
            questions: questions
          }
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update practical section:', error);
    }
  };

  const handleCancel = () => {
    setQuestions(practicalConfig.questions || []);
    setNewQuestion({ question: '' } as IInterviewQuestion);
    setIsEditing(false);
  };

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      const newQuestionItem = {
        question: newQuestion,
        questionId: `q_${Date.now()}`
      };
      setQuestions([...questions, newQuestionItem]);
      setNewQuestion({ question: '' } as IInterviewQuestion);
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.questionId !== questionId));
  };

  const handleUpdateQuestion = (questionId: string, value: string) => {
    setQuestions(questions.map(q => {
      if (q.questionId === questionId) {
        return {
          ...q,
          question: {
            ...q.question,
            question: value
          }
        };
      }
      return q;
    }));
  };

  if (isEditing) {
    return (
      <Box>
        <Text size="sm" c="dimmed" mb="md">{questions.length} questions</Text>
        <ScrollArea mah={500} offsetScrollbars>
          <Stack>
            {questions.map((q, index) => (
              <Paper key={q.questionId} p="xs" shadow="xs" withBorder>
                <Group mb="xs" justify="space-between">
                  <Text fw={500}>Question {index + 1}</Text>
                  <Button variant="subtle" color="red" onClick={() => handleRemoveQuestion(q.questionId)} size="xs">
                    <IconTrash size={16} />
                  </Button>
                </Group>
                <Textarea
                  autosize
                  minRows={2}
                  value={q.question.question}
                  onChange={(e) => handleUpdateQuestion(q.questionId, e.currentTarget.value)}
                />
              </Paper>
            ))}
            <Paper p="xs" shadow="xs" withBorder>
              <Textarea
                placeholder="Write your question here"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.currentTarget.value })}
              />
              <Group mt="sm">
                <Button
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.question.trim()}
                >
                  Add Question
                </Button>
              </Group>
            </Paper>
          </Stack>
        </ScrollArea>

        <Group mt="lg">
          <Button variant="default" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Box>
    );
  }

  return (
    <Box p="md">
      <Text size="sm" color="dimmed" mb="md">{questions.length} questions</Text>
      {questions.length > 0 ? (
        <Stack>
          {questions.map((q, index) => (
            <Paper key={q.questionId} p="md" shadow="xs" withBorder>
              <Title order={5} mb="sm">Question {index + 1}</Title>
              <Text>{q.question.question}</Text>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Text c="dimmed">No questions added yet</Text>
      )}
    </Box>
  );
};

export default PracticalSection;
