import React, { useState } from 'react';
import { Group, ActionIcon, Box, Anchor, Text, Paper } from '@mantine/core';
import { IconChevronRight, IconChevronDown, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  createTrainingTopic,
  deleteTrainingTopic,
  useTopicListStore,
  updateTrainingTopic,
} from '@/libs/store/src/lib/topicList';
import { EditableInput } from '@/libs/components/custom/input/EditableInput';
import Link from 'next/link';

interface ITopicItem {
  topicId: string;
  depth?: number;
  trainingId: string;
  numbering?: string;
}

const TopicItem = ({
  topicId,
  depth = 0,
  trainingId,
  numbering = '',
}: ITopicItem) => {
  const { topics } = useTopicListStore();
  const topic = topics[topicId];

  const [expanded, setExpanded] = useState(true);
  const toggleExpand = () => setExpanded((prev) => !prev);

  const handleSaveTopicName = (newName: string) => {
    updateTrainingTopic({ topicId, updatedName: newName });
  };

  if (!topic) return null;

  const hasChildren = topic.childTopics?.length > 0;
  const isRoot = depth === 0;

  const handleCreateSubtopic = () => {
    createTrainingTopic({ trainingId, parentTopicId: topicId });
  };

  const handleDelete = () => {
    deleteTrainingTopic(topicId);
  };

  const content = (
    <Group
      wrap="nowrap"
      align="center"
      p="xs"
      w="100%"
      bg={isRoot ? 'var(--mantine-color-blue-light)' : 'transparent'}
      style={{ borderRadius: 6, cursor: 'default' }}
    >
      {hasChildren ? (
        <ActionIcon onClick={toggleExpand} variant="subtle" color="gray" size="sm">
          {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
        </ActionIcon>
      ) : (
        <Box w={24} />
      )}

      {numbering && (
        <Text size="sm" fw={500} w={40}>
          {numbering}.
        </Text>
      )}

      <EditableInput
        currentValue={topic.name || ''}
        onSave={handleSaveTopicName}
        type="text"
        inputProps={{ maxLength: 100 }}
        isEditInput={topic.isEditing}
        renderValue={(value) => {
          const href = `/trainings/${trainingId}/topics/${topicId}`;
          if (!hasChildren) {
            return (
              <Anchor
                component={Link}
                href={href}
                c={isRoot ? 'blue' : 'blue'}
                style={{ fontWeight: isRoot ? 600 : 500 }}
              >
                {value}
              </Anchor>
            );
          }
          return (
            <Text c="blue" fw={600} size="sm">
              {value}
            </Text>
          );
        }}
      />

      {
        !topic.isEditing && (
          <>
            <ActionIcon color="green" variant="transparent" onClick={handleCreateSubtopic}>
              <IconPlus size={16} />
            </ActionIcon>
            <ActionIcon color="red" variant="transparent" onClick={handleDelete}>
              <IconTrash size={16} />
            </ActionIcon>
          </>
        )
      }
    </Group >
  );

  return (
    <Box pl={depth * 4} mb={4}>
      {isRoot ? <Paper shadow="xs">{content}</Paper> : content}

      {hasChildren && expanded && (
        <Box>
          {topic.childTopics.map((childId, idx) => {
            const childNumbering = numbering ? `${numbering}.${idx + 1}` : `${idx + 1}`;
            return (
              <TopicItem
                key={childId._id}
                topicId={childId._id}
                depth={depth + 1}
                trainingId={trainingId}
                numbering={childNumbering}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default TopicItem;
