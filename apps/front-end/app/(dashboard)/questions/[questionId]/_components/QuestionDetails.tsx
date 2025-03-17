import React, { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Grid,
  Radio,
  Flex,
  Paper,
  TagsInput,
  Tooltip,
} from "@mantine/core";
import { AnswerQuestionFormat, AnswerMcqOptionFormat, Difficulty, InterviewRoundTypes } from "@agent-xenon/constants";
import { useGetQuestionById, useUpdateQuestion } from "@agent-xenon/react-query-hooks";
import { useParams } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";

let timeOut: string | number | NodeJS.Timeout | undefined;

export const QuestionDetails = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [questionFormState, setQuestionFormState] = useState({
    _id: "",
    description: "",
    type: InterviewRoundTypes.ASSESSMENT,
    question: "",
    options: [
      { index: AnswerMcqOptionFormat.A, text: "", isRightAnswer: false },
      { index: AnswerMcqOptionFormat.B, text: "", isRightAnswer: false },
      { index: AnswerMcqOptionFormat.C, text: "", isRightAnswer: false },
      { index: AnswerMcqOptionFormat.D, text: "", isRightAnswer: false },
    ],
    tags: [] as string[],
    difficulty: Difficulty.MEDIUM,
    timeLimitInMinutes: 15,
    evaluationCriteria: "",
    questionFormat: AnswerQuestionFormat.MCQ,
  });
  const { data } = useGetQuestionById({ questionId });
  const questionData = data?.data;
  const { mutate: updateQuestion } = useUpdateQuestion();

  useEffect(() => {
    if (questionData) {
      setQuestionFormState((prev) => ({
        ...prev,
        ...questionData,
        options: questionData.options || prev.options,
        tags: questionData.tags || [],
      }));
    }
  }, [questionData]);

  const handleChange = (field: string, value: any) => {
    setQuestionFormState((prev) => ({ ...prev, [field]: value }));
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      updateQuestion({
        ...questionFormState,
        _id: questionId,
        [field]: value,
      });
    }, 600);
  };

  const handleOptionChange = (index: number) => {
    setQuestionFormState((prevState) => ({
      ...prevState,
      options: prevState.options.map((opt, i) => ({
        ...opt,
        isRightAnswer: i === index,
      })),
    }));
  }

  return (
    <Paper shadow="sm" radius="md" withBorder p="lg">
      <Grid>
        <Grid.Col span={12}>
          <TextInput
            required
            label="Question Title"
            placeholder="Enter question title"
            value={questionFormState.question}
            onChange={(e) => handleChange("question", e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Textarea
            required
            label="Question Description"
            placeholder="Enter detailed question"
            minRows={4}
            value={questionFormState.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Round Type"
            data={Object.values(InterviewRoundTypes).map((type) => ({ value: type, label: type }))}
            value={questionFormState.type}
            onChange={(value) => handleChange("type", value)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            required
            label="Input Type"
            placeholder="Select input format"
            data={Object.values(AnswerQuestionFormat).map((type) => ({ value: type, label: type }))}
            value={questionFormState.questionFormat}
            onChange={(value) => handleChange("questionFormat", value)}
          />
        </Grid.Col>

        {questionFormState.questionFormat === AnswerQuestionFormat.MCQ && (
          <Grid.Col span={12}>
            {questionFormState.options.map((option, index) => (
              <Flex key={option.index} gap="md" mb="md" align="center">
                <Radio
                  name="correctOption"
                  value={option.index}
                  checked={option.isRightAnswer}
                  onChange={() => handleOptionChange(index)}
                />
                <TextInput
                  required
                  placeholder={`Option ${option.index}`}
                  value={option.text}
                  onChange={(e) => {
                    const updatedOptions = [...questionFormState.options];
                    updatedOptions[index] = { ...updatedOptions[index], text: e.target.value };
                    handleChange("options", updatedOptions);
                  }}
                  w='100%'
                />
              </Flex>
            ))}
          </Grid.Col>
        )}

        {questionFormState.questionFormat !== AnswerQuestionFormat.MCQ &&
          <Grid.Col span={12}>
            <Textarea
              label="Evaluation Criteria"
              placeholder="Enter evaluation criteria or rubric"
              minRows={4}
              value={questionFormState.evaluationCriteria}
              onChange={(e) => handleChange("evaluationCriteria", e.target.value)}
            />
          </Grid.Col>
        }

        <Grid.Col span={6}>
          <NumberInput
            required
            label="Time Limit (minutes)"
            placeholder="Enter time limit"
            min={1}
            value={questionFormState.timeLimitInMinutes}
            onChange={(value) => handleChange("timeLimitInMinutes", value)}
            leftSection={
              <Tooltip label="Time in minutes" withArrow>
                <IconAlertCircle size={16} />
              </Tooltip>
            }
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TagsInput
            label="Tags"
            placeholder="Add tags"
            value={questionFormState.tags}
            onChange={(value: string[]) => handleChange("tags", value)}
          />
        </Grid.Col>


      </Grid>
    </Paper>
  );
}
