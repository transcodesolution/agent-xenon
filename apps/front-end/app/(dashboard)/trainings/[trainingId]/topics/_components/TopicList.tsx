import React, { useEffect } from 'react';
import { Paper, Text, Stack, Button, Flex } from '@mantine/core';
import { createTrainingTopic, useTopicListStore, loadTrainingTopics } from '@/libs/store/src/lib/topicList';
import TopicItem from './TopicItem';
import { useParams } from 'next/navigation';

const TopicList = () => {
  const { trainingId } = useParams<{ trainingId: string }>();
  const { rootTopicIds } = useTopicListStore();

  useEffect(() => {
    if (trainingId) {
      loadTrainingTopics(trainingId);
    }
  }, [trainingId]);

  const handleCreateTopic = async () => {
    if (!trainingId) return;
    try {
      await createTrainingTopic({ trainingId });
    } catch (err) {
      console.error('Failed to create topic', err);
    }
  };

  return (
    <Paper shadow="xs" w='100%'>
      <Flex p='sm' justify='end'>
        <Button onClick={handleCreateTopic} w='fit-content'>
          +  Create Topic
        </Button>
      </Flex>
      <Stack gap="0" h='calc(100vh - 152px)' styles={{ root: { overflowY: 'auto' } }}>
        {rootTopicIds.length > 0 ? (
          rootTopicIds.map((id) => (
            <TopicItem key={id} topicId={id} trainingId={trainingId} />
          ))
        ) : (
          <Text size="sm" c="dimmed" p='sm' >
            No topics loaded.
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

export default TopicList;
