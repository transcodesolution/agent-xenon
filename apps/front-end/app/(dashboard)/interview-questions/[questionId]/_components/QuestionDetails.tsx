'use client'
import React, { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Grid,
  Flex,
  Paper,
  Checkbox,
  TagsInput,
  Tooltip,
  Text,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import {
  AnswerQuestionFormat,
  AnswerMcqOptionFormat,
  Difficulty,
  InterviewRoundTypes,
} from "@agent-xenon/constants";
import {
  useGetQuestionById,
  useUpdateQuestion,
} from "@agent-xenon/react-query-hooks";
import { useParams } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { usePermissions } from "@/libs/hooks/usePermissions";
import { showNotification } from "@mantine/notifications";

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
    isMultiSelectOption: false,
  });

  const { data: getQuestionByIdResponse, isLoading } = useGetQuestionById({ questionId });
  const questionData = getQuestionByIdResponse?.data;
  const { mutate: updateQuestion } = useUpdateQuestion();
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: questionFormState.description,
    onUpdate: ({ editor }) => {
      handleChange("description", editor.getHTML());
    },
  });
  const permission = usePermissions()

  useEffect(() => {
    if (questionData) {
      setQuestionFormState((prev) => ({
        ...prev,
        ...questionData,
        options: questionData.options && questionData.options.length > 0
          ? questionData.options
          : [
            { index: AnswerMcqOptionFormat.A, text: "", isRightAnswer: false },
            { index: AnswerMcqOptionFormat.B, text: "", isRightAnswer: false },
            { index: AnswerMcqOptionFormat.C, text: "", isRightAnswer: false },
            { index: AnswerMcqOptionFormat.D, text: "", isRightAnswer: false },
          ],
        tags: questionData.tags || [],
      }));

      if (editor && questionData.description) {
        editor.commands.setContent(questionData.description);
      }
    }
  }, [questionData, editor]);


  const handleChange = (field: string, value: any) => {
    if (!permission?.hasQuestionAnswerUpdate) {
      showNotification({
        message: "You do not have permission to update questions",
        color: 'red',
      });
      return;
    }
    const updatedState = { ...questionFormState, [field]: value };
    if (field === "isMultiSelectOption" && !value) {
      updatedState.options = updatedState.options.map((opt) => ({
        ...opt,
        isRightAnswer: false,
      }));
    }
    setQuestionFormState(updatedState);
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      const { options, isMultiSelectOption, ...remainingData } = updatedState;
      const updatedPayload = updatedState.questionFormat === AnswerQuestionFormat.MCQ
        ? { ...updatedState, _id: questionId }
        : { ...remainingData, _id: questionId };

      updateQuestion(updatedPayload, {});
    }, 600);
  };

  const handleOptionChange = (index: number) => {
    if (!permission?.hasQuestionAnswerUpdate) {
      showNotification({
        message: "You do not have permission to update options",
        color: "red",
      });
      return;
    }
    const updatedOptions = questionFormState.options.map((opt, i) => ({
      ...opt,
      isRightAnswer: questionFormState.isMultiSelectOption
        ? i === index
          ? !opt.isRightAnswer
          : opt.isRightAnswer
        : i === index,
    }));

    handleChange("options", updatedOptions);
  };

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
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

          <Grid.Col span={6}>
            <Select
              label="Round Type"
              data={Object.values(InterviewRoundTypes).map((type) => ({
                value: type,
                label: type,
              }))}
              value={questionFormState.type}
              onChange={(value) => handleChange("type", value)}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Select
              required
              label="Input Type"
              placeholder="Select input format"
              data={Object.values(AnswerQuestionFormat).map((type) => ({
                value: type,
                label: type,
              }))}
              value={questionFormState.questionFormat}
              onChange={(value) => handleChange("questionFormat", value)}
            />
          </Grid.Col>

          {questionFormState.questionFormat === AnswerQuestionFormat.MCQ && (
            <React.Fragment>
              <Grid.Col span={12}>
                <Checkbox
                  label="Allow multiple correct answers"
                  checked={questionFormState.isMultiSelectOption}
                  onChange={(e) => handleChange("isMultiSelectOption", e.target.checked)}
                  size="md"
                  radius="sm"
                  className="border-2"
                />
              </Grid.Col>

              <Grid.Col span={12}>
                {questionFormState.options.map((option, index) => (
                  <Flex key={option.index} gap="md" mb="md" align="center">
                    <Checkbox
                      checked={option.isRightAnswer}
                      onChange={() => handleOptionChange(index)}
                      size="md"
                      radius="sm"
                      className="border-2"
                    />
                    <TextInput
                      required
                      placeholder={`Option ${option.index}`}
                      value={option.text}
                      onChange={(e) => {
                        const updatedOptions = [...questionFormState.options];
                        updatedOptions[index] = {
                          ...updatedOptions[index],
                          text: e.target.value,
                        };
                        handleChange("options", updatedOptions);
                      }}
                      w='100%'
                    />
                  </Flex>
                ))}
              </Grid.Col>
            </React.Fragment>
          )}

          {questionFormState.questionFormat !== AnswerQuestionFormat.MCQ && (
            <Grid.Col span={12}>
              <Textarea
                label="Evaluation Criteria"
                placeholder="Enter evaluation criteria or rubric"
                minRows={4}
                value={questionFormState.evaluationCriteria}
                onChange={(e) =>
                  handleChange("evaluationCriteria", e.target.value)
                }
              />
            </Grid.Col>
          )}
          {questionFormState.questionFormat !== AnswerQuestionFormat.MCQ && (
            <Grid.Col span={12}>
              <Text size="sm" fw='500'>Question Description</Text>
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            </Grid.Col>
          )
          }
        </Grid>
      </Paper>
    </Stack>
  );
};
