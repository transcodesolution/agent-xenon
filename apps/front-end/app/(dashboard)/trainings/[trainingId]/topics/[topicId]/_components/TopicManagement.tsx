'use client'
import { LoadingOverlay } from '@mantine/core';
import { useParams } from 'next/navigation';
import TopicContent from './TopicContent';
import { useGetTopicById } from '@agent-xenon/react-query-hooks';
import { setTopic, useTopicStore } from '@/libs/store/src/lib/topic';
import { useEffect } from 'react';

const TopicManagement = () => {
  const { topicId } = useParams() as { topicId: string };
  const { data: getTopicById, isLoading: isTopicLoading } = useGetTopicById({ topicId });
  const { topic } = useTopicStore()

  useEffect(() => {
    const topic = getTopicById?.data
    if (topic) setTopic(topic);
  }, [getTopicById?.data]);

  if (isTopicLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    topic && (
      <TopicContent
        topic={topic}
        isLoading={isTopicLoading}
      />
    )
  );
};

export default TopicManagement;
