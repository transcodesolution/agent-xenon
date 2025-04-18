import React, { useState } from 'react';
import { Group, ActionIcon, Box, Anchor } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconPlus, IconTrash } from '@tabler/icons-react';
import { createTrainingTopic, deleteTrainingTopic, useTopicListStore, updateTrainingTopic } from '@/libs/store/src/lib/topicList';
import { EditableInput } from '@/libs/components/custom/input/EditableInput';
import Link from 'next/link';

interface ITopicItem {
  topicId: string;
  depth?: number;
  trainingId: string;
}

const TopicItem = ({ topicId, depth = 0, trainingId }: ITopicItem) => {
  const { topics } = useTopicListStore();
  const topic = topics[topicId];

  const [expanded, setExpanded] = useState(true);
  const toggleExpand = () => setExpanded((prev) => !prev);

  const handleSaveTopicName = (newName: string) => {
    updateTrainingTopic({ topicId, updatedName: newName });
  };

  if (!topic) return null;

  const hasChildren = topic.childTopics?.length > 0;

  const handleCreateSubtopic = () => {
    createTrainingTopic({ trainingId, parentTopicId: topicId });
  };

  const handleDelete = () => {
    deleteTrainingTopic(topicId);
  };

  return (
    <Box>
      <Group wrap="nowrap" align="center" p="xs" w='100%' gap='0'>
        {hasChildren ? (
          <ActionIcon onClick={toggleExpand} variant='subtle' color="gray" size="sm">
            {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
          </ActionIcon>
        ) : (
          <Box w={24} />
        )}
        <EditableInput
          currentValue={topic.name || ''}
          onSave={handleSaveTopicName}
          type="text"
          inputProps={{
            maxLength: 100,
          }}
          isEditInput={topic.isEditing}
          renderValue={(value) => (
            <Anchor component={Link} href={`/trainings/${trainingId}/topics/${topicId}`}>
              {value}
            </Anchor>
          )}
        />
        {!topic.isEditing && (
          <React.Fragment>
            <ActionIcon color="green" variant='transparent' onClick={handleCreateSubtopic}>
              <IconPlus size={16} />
            </ActionIcon>

            <ActionIcon color="red" variant="transparent" onClick={handleDelete}>
              <IconTrash size={16} />
            </ActionIcon>
          </React.Fragment>
        )}
      </Group>

      {
        hasChildren && expanded && (
          <Box>
            {topic.childTopics.map((child) => (
              <TopicItem key={child._id} topicId={child._id} depth={depth + 1} trainingId={trainingId} />
            ))}
          </Box>
        )
      }
    </Box >
  );
};

export default TopicItem;
