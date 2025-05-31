import React, { useState } from 'react';
import {
  Box,
  Button,
  Group,
  Text,
  TextInput,
  Textarea,
  Paper,
  Stack,
} from '@mantine/core';
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';
import { updateSectionToTopic } from '@/libs/store/src/lib/topic';
import { useParams } from 'next/navigation';

interface VideoSectionProps {
  section: ITopicSection;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ section, isEditing, setIsEditing }) => {
  const videoConfig = section.topicSectionConfig[TopicSectionType.VIDEO] || {
    videoTitle: '',
    videoDescription: '',
    videoURL: ''
  };

  const [title, setTitle] = useState(videoConfig.videoTitle || '');
  const [description, setDescription] = useState(videoConfig.videoDescription || '');
  const [videoURL, setVideoURL] = useState(videoConfig.videoURL || '');
  const [urlInput, setUrlInput] = useState('');
  const { topicId } = useParams() as { topicId: string };

  const handleSave = async () => {
    try {
      await updateSectionToTopic({
        _id: section._id,
        topicId: topicId,
        topicSectionConfig: {
          ...section.topicSectionConfig,
          [TopicSectionType.VIDEO]: {
            videoTitle: title,
            videoDescription: description,
            videoURL: videoURL
          }
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update video section:', error);
    }
  };

  const handleCancel = () => {
    setTitle(videoConfig.videoTitle || '');
    setDescription(videoConfig.videoDescription || '');
    setVideoURL(videoConfig.videoURL || '');
    setUrlInput(videoConfig.videoURL || '');
    setIsEditing(false);
  };

  const handleUploadVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeURL = URL.createObjectURL(file);
      setVideoURL(fakeURL);
    }
  };

  const handleSetVideoUrl = () => {
    if (urlInput.trim()) {
      setVideoURL(urlInput.trim());
    }
  };

  const getEmbedUrl = (url: string): string | undefined => {
    return url?.trim() || undefined;
  };

  return (
    <Box>
      {isEditing ? (
        <>
          <Paper withBorder radius="md" mb="md">
            {videoURL ? (
              <Box mb="md">
                <Box pos="relative" pb="56.25%" h={0}>
                  <iframe
                    src={getEmbedUrl(videoURL) ?? undefined}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
                <Button variant="subtle" color="red" mt="sm" onClick={() => setVideoURL('')}>
                  Remove Video
                </Button>
              </Box>
            ) : (
              <Stack align="center" p='xs'>
                <Text c="dimmed">No video uploaded yet</Text>
                <Button component="label">
                  Upload Video
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleUploadVideo}
                  />
                </Button>
                <Text size="sm" c="dimmed">or</Text>
                <Group w="100%" mt="xs">
                  <TextInput
                    placeholder="YouTube or Vimeo URL"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={handleSetVideoUrl}>Set</Button>
                </Group>
              </Stack>
            )}
          </Paper>

          <Stack>
            <TextInput
              label="Video Title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <Textarea
              label="Video Description"
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              autosize
              minRows={3}
            />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </Group>
        </>
      ) : (
        <>
          {videoURL ? (
            <Box mb="md">
              <Box pos="relative" pb="56.25%" h={0}>
                <iframe
                  src={getEmbedUrl(videoURL) ?? undefined}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
            </Box>
          ) : (
            <Paper withBorder p="md" radius="md" mb="md" ta="center">
              <Text c="dimmed">No video provided</Text>
            </Paper>
          )}

          {title && <Text fw={500} fz="lg" mb={4}>{title}</Text>}
          {description && <Text>{description}</Text>}
        </>
      )}
    </Box>
  );
};

export default VideoSection;
