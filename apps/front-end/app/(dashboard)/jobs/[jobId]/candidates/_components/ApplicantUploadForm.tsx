import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { useEffect, useState } from 'react';
import { Button, Stack, Text, Group, Flex, Avatar, Anchor, ActionIcon } from '@mantine/core';
import { IconUpload, IconPhoto, IconX, IconTrash } from '@tabler/icons-react';
import { addResumeUrl, deleteResumeUrl, uploadFileToServiceViaHandler } from '@agent-xenon/web-apis';
import { useParams } from 'next/navigation';
import { useCreateJobApplicantByAgent, useGetResumeUrls } from '@agent-xenon/react-query-hooks';

export function ApplicantUploadForm({ refetch, onClose }: { refetch: () => void, onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [resumeUrls, setResumeUrls] = useState<string[]>([]);
  const { jobId } = useParams<{ jobId: string }>();
  const { mutate: createJobApplicantByAgent } = useCreateJobApplicantByAgent();
  const { data } = useGetResumeUrls({
    jobId,
  });

  useEffect(() => {
    const resumeUrls = data?.data?.resumeUrls || [];
    setResumeUrls(resumeUrls);
  }, [data]);

  const handleDrop = async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('document', file);

      try {
        const uploadResponse = await uploadFileToServiceViaHandler({
          formData,
        });
        const fileUrl = uploadResponse?.data?.resumeUrls;
        if (fileUrl) {
          setResumeUrls((prevUrls) => [...prevUrls, ...fileUrl]);
          addResumeUrl({ resumeUrls: fileUrl, jobId: jobId });
        }
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
  };

  const handleSubmit = () => {
    if (jobId) {
      createJobApplicantByAgent({ jobId }, {
        onSuccess: () => {
          refetch();
          onClose();
        }
      });
    } else {
      console.error('Job ID is missing');
    };
  }

  const handleRemoveFile = (index: number) => {
    const updatedUrls = resumeUrls.filter((_, i) => i !== index);
    setResumeUrls(updatedUrls);

    const resumeUrlToDelete = resumeUrls[index];
    if (resumeUrlToDelete) {
      deleteResumeUrl({ resumeUrls: resumeUrlToDelete, jobId: jobId });
    } else {
      console.error('Resume URL is missing for the selected file');
    }
  };

  return (
    <Stack>
      <Dropzone
        onDrop={handleDrop}
        onReject={(rejectedFiles) => console.log('rejected files', rejectedFiles)}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.csv, MIME_TYPES.xlsx, MIME_TYPES.pdf, MIME_TYPES.doc]}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      {resumeUrls.length > 0 && (
        <Stack mt="sm" gap="sm">
          {resumeUrls.map((url, index) => (
            <Flex key={index} align="center" gap={6}>
              <Flex align="center" style={{ flex: 1, height: '100%' }}>
                <Avatar
                  src={url}
                  radius="xs"
                  size="sm"
                />
                <Anchor
                  href={url}
                  target="_blank"
                  ml="xs"
                  c="primary"
                  size="sm"
                >
                  {url.split('/').pop()}
                </Anchor>
              </Flex>

              <ActionIcon color="red" variant="light" onClick={() => handleRemoveFile(index)}>
                <IconTrash size={18} />
              </ActionIcon>
            </Flex>
          ))}
        </Stack>
      )}
      <Button onClick={handleSubmit} disabled={resumeUrls?.length === 0}>
        Submit
      </Button>
    </Stack>
  );
}

export default ApplicantUploadForm;