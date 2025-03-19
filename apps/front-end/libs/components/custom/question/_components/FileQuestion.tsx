import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useEffect, useState } from 'react';
import { Stack, Text, Group, Flex, Avatar, Anchor, ActionIcon, Title } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { addResumeUrl, deleteResumeUrl, uploadFileToServiceViaHandler } from '@agent-xenon/web-apis';
import { useParams } from 'next/navigation';
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";

interface IFileQuestion {
  question: IInterviewQuestionAnswer;
  answer: string;
  onAnswer: (questionId: string, answer: string) => void;
}

export const FileQuestion = ({ question, answer, onAnswer }: IFileQuestion) => {
  const [resumeUrls, setResumeUrls] = useState<string[]>(answer ? [answer] : []);
  const { jobId } = useParams<{ jobId: string }>();

  useEffect(() => {
    if (answer) {
      setResumeUrls([answer]);
    }
  }, [answer]);

  const handleDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('document', file);

      try {
        const uploadResponse = await uploadFileToServiceViaHandler({ formData });
        const fileUrl = uploadResponse?.data?.resumeUrls?.[0];
        if (fileUrl) {
          setResumeUrls([fileUrl]);
          onAnswer(question._id, fileUrl);
          addResumeUrl({ resumeUrls: [fileUrl], jobId });
        }
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
  };

  const handleRemoveFile = () => {
    if (resumeUrls.length > 0) {
      deleteResumeUrl({ resumeUrls: resumeUrls[0], jobId });
      setResumeUrls([]);
      onAnswer(question._id, '');
    }
  };

  return (
    <Stack>
      <Group align="center" gap="md">
        <IconUpload />
        <Title order={3}>{question.question}</Title>
      </Group>
      <Dropzone
        onDrop={handleDrop}
        onReject={(rejectedFiles) => console.log('rejected files', rejectedFiles)}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.pdf, MIME_TYPES.zip]}
      >
        <Group justify="center" gap="xl" mih={150} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>
          <Text size="xl" inline>
            Drag files here or click to upload
          </Text>
        </Group>
      </Dropzone>

      {resumeUrls.length > 0 && (
        <Stack mt="sm" gap="sm">
          {resumeUrls.map((url, index) => (
            <Flex key={index} align="center" gap={6}>
              <Flex align="center" style={{ flex: 1, height: '100%' }}>
                <Avatar src={url} radius="xs" size="sm" />
                <Anchor href={url} target="_blank" ml="xs" c="primary" size="sm">
                  {url.split('/').pop()}
                </Anchor>
              </Flex>
              <ActionIcon color="red" variant="light" onClick={handleRemoveFile}>
                <IconTrash size={16} />
              </ActionIcon>
            </Flex>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default FileQuestion;