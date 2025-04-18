import React from 'react';
import { Button, Flex } from '@mantine/core';
import { TopicSectionType } from '@agent-xenon/constants';
import {
  IconVideo,
  IconHeadphones,
  IconFileText,
  IconDeviceImac,
  IconRobot,
} from '@tabler/icons-react';
import { addSectionToTopic, useTopicStore } from '@/libs/store/src/lib/topic';
import { ICreateTopicSection } from '@/libs/types-api/src';

const sectionTypes = [
  { label: 'Video Section', type: TopicSectionType.VIDEO, icon: <IconVideo size={16} /> },
  { label: 'Audio Section', type: TopicSectionType.AUDIO, icon: <IconHeadphones size={16} /> },
  { label: 'Text Content', type: TopicSectionType.TEXT, icon: <IconFileText size={16} /> },
  { label: 'Practical Exercise', type: TopicSectionType.PRACTICAL, icon: <IconDeviceImac size={16} /> },
  { label: 'AI Assistant', type: TopicSectionType.ASSISTANT, icon: <IconRobot size={16} /> },
];

const SectionTypeButtons = () => {
  const topic = useTopicStore((s) => s.topic);
  const existingCount = topic?.topicSections?.length || 0;

  const handleAdd = (type: TopicSectionType) => {
    const newSection: Partial<ICreateTopicSection> = {
      type,
      order: existingCount + 1,
      name: `${type} Section ${existingCount + 1}`,
      content: '',
      topicId: topic?._id,
    };

    addSectionToTopic(newSection);
  };

  return (
    <Flex gap='md'>
      {sectionTypes.map(({ label, type, icon }) => (
        <Button
          key={type}
          fullWidth
          variant="light"
          leftSection={icon}
          onClick={() => handleAdd(type)}
        >
          {label}
        </Button>
      ))}
    </Flex>
  );
};

export default SectionTypeButtons;
