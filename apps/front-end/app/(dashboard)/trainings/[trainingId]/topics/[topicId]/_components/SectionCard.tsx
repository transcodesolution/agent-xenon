import React, { useState } from 'react';
import {
  Paper,
  Group,
  Text,
  ActionIcon,
  Stack,
  Divider,
  Accordion,
} from '@mantine/core';
import {
  IconHeadphones,
  IconVideo,
  IconFileText,
  IconCode,
  IconRobot,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { deleteSectionFromTopic } from '@/libs/store/src/lib/topic';
import AudioSection from './AudioSection';
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';
import VideoSection from './VideoSection';
import TextSection from './TextSection';
import PracticalSection from './PracticalSection';
import { useParams } from 'next/navigation';
import AssistantSection from './AssistantSection';

interface SectionCardProps {
  section: ITopicSection;
}

const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { topicId } = useParams() as { topicId: string };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSectionFromTopic(section._id, topicId);
      } catch (error) {
        console.error('Failed to delete section:', error);
      }
    }
  };

  const getSectionTypeInfo = (type: TopicSectionType) => {
    switch (type) {
      case TopicSectionType.AUDIO:
        return { icon: <IconHeadphones size={16} />, name: 'Audio' };
      case TopicSectionType.VIDEO:
        return { icon: <IconVideo size={16} />, name: 'Video' };
      case TopicSectionType.TEXT:
        return { icon: <IconFileText size={16} />, name: 'Text' };
      case TopicSectionType.PRACTICAL:
        return { icon: <IconCode size={16} />, name: 'Practical Exercise' };
      case TopicSectionType.ASSISTANT:
        return { icon: <IconRobot size={16} />, name: 'AI Assistant' };
      default:
        return { icon: <IconFileText size={16} />, name: 'Unknown' };
    }
  };

  const { icon, name } = getSectionTypeInfo(section.type);

  const renderSectionContent = () => {
    switch (section.type) {
      case TopicSectionType.AUDIO:
        return <AudioSection section={section} isEditing={isEditing} setIsEditing={setIsEditing} />;
      case TopicSectionType.VIDEO:
        return <VideoSection section={section} isEditing={isEditing} setIsEditing={setIsEditing} />;
      case TopicSectionType.TEXT:
        return <TextSection section={section} isEditing={isEditing} setIsEditing={setIsEditing} />;
      case TopicSectionType.PRACTICAL:
        return <PracticalSection section={section} isEditing={isEditing} setIsEditing={setIsEditing} />;
      case TopicSectionType.ASSISTANT:
        return <AssistantSection section={section} isEditing={isEditing} setIsEditing={setIsEditing} />;
      default:
        return <Text c="dimmed" p="sm">Unsupported section type</Text>;
    }
  };

  return (
    <Accordion variant="separated" >
      <Accordion.Item value={`section-${section._id}`}>
        <Accordion.Control>
          <Group justify="space-between" mr='xs'>
            <Group>
              {icon}
              <Text fw={500}>{section.name || name}</Text>
            </Group>
            <Group gap="xs">
              <IconEdit size={18} onClick={(e) => {
                e.stopPropagation();
                handleToggleEdit();
              }} color="var(--mantine-color-blue-6)" />
              <IconTrash size={18} color="var(--mantine-color-red-6)" onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }} />
            </Group>
          </Group>
        </Accordion.Control>

        {/* Accordion Panel (Section Content) */}
        <Accordion.Panel>
          {renderSectionContent()}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default SectionCard;

