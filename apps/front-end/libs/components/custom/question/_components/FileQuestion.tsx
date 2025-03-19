import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useState } from 'react';
import { Stack, Text, Group, Flex, Avatar, Anchor, ActionIcon, Title } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { uploadFileToServiceViaHandler } from '@agent-xenon/web-apis';
import { IInterviewQuestionAnswer } from "@agent-xenon/interfaces";

interface IFileQuestion {
  question: IInterviewQuestionAnswer;
  answer: string[];
  onAnswer: (questionId: string, answer: string[]) => void;
}

export const FileQuestion = ({ question, answer, onAnswer }: IFileQuestion) => {
  const [files, setFiles] = useState<string[]>(answer || []);

  const handleDrop = async (acceptedFiles: File[]) => {
    const uploadedFiles: string[] = [];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('document', file);

      try {
        const uploadResponse = await uploadFileToServiceViaHandler({ formData });
        const fileUrl = uploadResponse?.data?.files?.[0];
        if (fileUrl) {
          uploadedFiles.push(fileUrl);
        }
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }

    if (uploadedFiles.length > 0) {
      const newFiles = [...files, ...uploadedFiles];
      setFiles(newFiles);
      onAnswer(question._id, newFiles);
    }
  };

  const handleRemoveFile = (fileUrl: string) => {
    const updatedFiles = files.filter((url) => url !== fileUrl);
    setFiles(updatedFiles);
    onAnswer(question._id, updatedFiles);
  };

  return (
    <Stack>
      <Dropzone
        onDrop={handleDrop}
        onReject={(rejectedFiles) => console.log('rejected files', rejectedFiles)}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.zip]} // Only allow ZIP files
        multiple // Allow multiple file uploads
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
            Drag ZIP files here or click to upload
          </Text>
        </Group>
      </Dropzone>

      {files.length > 0 && (
        <Stack mt="sm" gap="sm">
          {files.map((url, index) => (
            <Flex key={index} align="center" gap={6}>
              <Flex align="center" style={{ flex: 1, height: '100%' }}>
                <Avatar src="/zip-icon.png" radius="xs" size="sm" /> {/* Generic ZIP file icon */}
                <Anchor href={url} target="_blank" ml="xs" c="primary" size="sm">
                  {url.split('/').pop()}
                </Anchor>
              </Flex>
              <ActionIcon color="red" variant="light" onClick={() => handleRemoveFile(url)}>
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
