import { Card, Text, Box, Badge, Group, Divider } from '@mantine/core';
import { CodeAnswer } from './CodeAnswer';
import { TextAnswer } from './TextAnswer';
import { McqAnswer } from './McqAnswer';
import { IconClock, IconTag } from '@tabler/icons-react';
import { IApplicantQuestionAnswer } from '@agent-xenon/interfaces';
import { AnswerQuestionFormat } from '@agent-xenon/constants';
import { getDifficultyColor } from '@/libs/utils/ui-helpers';

interface IQuestionCard {
  question: IApplicantQuestionAnswer;
}

export const QuestionCard = ({ question }: IQuestionCard) => {

  const renderAnswer = () => {
    switch (question.questionFormat) {
      case AnswerQuestionFormat.CODE:
        return <CodeAnswer code={question.answer} />;
      case AnswerQuestionFormat.TEXT:
        return <TextAnswer answer={question.answer || 'No answer provided'} />;
      case AnswerQuestionFormat.MCQ:
        return question.options ? (
          <McqAnswer options={question.options} selectedAnswer={question.answer} />
        ) : (
          <TextAnswer answer="Option data unavailable" />
        );
      default:
        return <TextAnswer answer={question.answer || 'No answer available'} />;
    }
  };

  return (
    <Card withBorder radius="md" p="md" shadow="sm" w='100%'>
      <Group mb="md">
        <Text fw={600} size="lg">{question.question}</Text>
        <Badge
          color={question.overallResult === 'Pass' ? 'green' : 'red'}
          variant="filled"
        >
          {question.overallResult}
        </Badge>
      </Group>

      <Group mb="md">
        <Group>
          <Badge variant="light" color="blue">
            {question.questionFormat.toUpperCase()}
          </Badge>
          <Badge
            variant="light"
            color={getDifficultyColor(question.difficulty)}
          >
            {question.difficulty}
          </Badge>
        </Group>

        <Group>
          <Group>
            <IconClock size={16} />
            <Text size="sm">{question.timeLimitInMinutes} min</Text>
          </Group>

          {question.tags && question.tags.length > 0 && (
            <Group>
              <IconTag size={16} />
              {question.tags.map((tag) => (
                <Badge key={tag} size="sm" variant="outline">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Group>
      </Group>

      {
        question.evaluationCriteria && (
          <Box mb="md">
            <Text size="sm" fw={500} mb="xs">Evaluation Criteria:</Text>
            <Text size="sm">{question.evaluationCriteria}</Text>
          </Box>
        )
      }

      <Divider my="sm" />

      {/* Applicants's Answer */}
      {renderAnswer()}
    </Card >
  );
}