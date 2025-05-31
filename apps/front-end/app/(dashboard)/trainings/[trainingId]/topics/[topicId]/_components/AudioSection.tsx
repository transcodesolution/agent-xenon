import React, { useState } from 'react';
import {
  Box,
  Button,
  FileInput,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Paper,
  Center
} from '@mantine/core';
import { IconHeadphones } from '@tabler/icons-react';
import { updateSectionToTopic } from '@/libs/store/src/lib/topic';
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';
import { useParams } from 'next/navigation';

interface IAudioSection {
  section: ITopicSection;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const AudioSection = ({ section, isEditing, setIsEditing }: IAudioSection) => {
  const { topicId } = useParams() as { topicId: string };
  const audioConfig = section.topicSectionConfig[TopicSectionType.AUDIO] || {
    audioTitle: '',
    audioDescription: '',
    audioURL: '',
  };
  const [title, setTitle] = useState(audioConfig.audioTitle || '');
  const [description, setDescription] = useState(audioConfig.audioDescription || '');
  const [audioURL, setAudioURL] = useState(audioConfig.audioURL || '');

  const handleSave = async () => {
    try {
      await updateSectionToTopic({
        _id: section._id,
        topicId: topicId,
        topicSectionConfig: {
          ...section.topicSectionConfig,
          [TopicSectionType.AUDIO]: {
            audioTitle: title,
            audioDescription: description,
            audioURL: audioURL,
          },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update audio section:', error);
    }
  };

  const handleCancel = () => {
    setTitle(audioConfig.audioTitle || '');
    setDescription(audioConfig.audioDescription || '');
    setAudioURL(audioConfig.audioURL || '');
    setIsEditing(false);
  };

  const handleUploadAudio = (file: File | null) => {
    if (file) {
      const fakeURL = URL.createObjectURL(file);
      setAudioURL(fakeURL);
    }
  };

  if (isEditing) {
    return (
      <Stack>
        <Paper withBorder radius="md" bg="gray.0">
          {audioURL ? (
            <Stack>
              <audio controls style={{ width: '100%' }}>
                <source src={audioURL} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <Button
                variant="subtle"
                color="red"
                onClick={() => setAudioURL('')}
              >
                Remove Audio
              </Button>
            </Stack>
          ) : (
            <Center>
              <Stack align="center" >
                <IconHeadphones size={40} color="gray" />
                <Text c="dimmed">No audio uploaded yet</Text>
                <FileInput
                  placeholder="Upload Audio"
                  accept="audio/*"
                  onChange={handleUploadAudio}
                />
              </Stack>
            </Center>
          )}
        </Paper>

        <TextInput
          label="Audio Title"
          placeholder="Enter audio title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <Textarea
          label="Audio Description"
          placeholder="Enter audio description"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          autosize
          minRows={3}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Box>
      {audioURL ? (
        <Box>
          <audio controls style={{ width: '100%' }}>
            <source src={audioURL} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </Box>
      ) : (
        <Paper withBorder p="xl" radius="md" bg="gray.0" ta="center" mb="md">
          <IconHeadphones size={40} color="gray" />
          <Text c="dimmed">No audio uploaded</Text>
        </Paper>
      )}

      {title && (
        <Text fz="lg" fw={500} mb={4}>
          {title}
        </Text>
      )}

      {description && <Text>{description}</Text>}
    </Box>
  );
};

export default AudioSection;
