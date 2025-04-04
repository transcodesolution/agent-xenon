import React from 'react';
import { ActionIcon, Badge, Card, Group, Text, Stack, Box } from '@mantine/core';
import { IconEdit, IconTrash, IconGripVertical } from '@tabler/icons-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dayjs from 'dayjs';
import { getRoundTypeColor } from '@/libs/utils/ui-helpers';
import { IInterviewRound } from '@agent-xenon/interfaces';
import { usePermissions } from '@/libs/hooks/usePermissions';

interface ISortableRoundItem {
  round: Pick<IInterviewRound<string>, "_id" | "name" | "type" | "endDate" | "startDate" | "qualificationCriteria" | "roundNumber">;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableRoundItem: React.FC<ISortableRoundItem> = ({ round, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: round._id });
  const permission = usePermissions();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} withBorder shadow="sm" mb="sm" p={0}>
      <Box p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm">
            <Box {...attributes} {...listeners} style={{ cursor: 'grab', color: 'var(--mantine-color-gray-6)' }}>
              <IconGripVertical size={20} />
            </Box>
            <Stack gap={5}>
              <Text fw={600} size="md">{round.name || 'Unnamed Round'}</Text>
              <Text size="xs" c="dimmed">
                {round.endDate ? dayjs(round.endDate).format('DD-MM-YYYY | HH:mm') : 'No expiration date'}
              </Text>
            </Stack>
          </Group>
          <Badge color={getRoundTypeColor(round.type)}>
            {round.type ? round.type.charAt(0).toUpperCase() + round.type.slice(1) : 'Unknown'}
          </Badge>
        </Group>
      </Box>

      <Box p="xs">
        <Text size="sm" fw={500} mb={5}>Qualification Criteria:</Text>
        <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
          {round.qualificationCriteria || 'No criteria specified'}
        </Text>

        <Group justify="flex-end" gap="xs">
          {permission.hasInterviewRoundUpdate && (
            <ActionIcon variant="light" color="blue" onClick={onEdit} aria-label="Edit">
              <IconEdit size={18} />
            </ActionIcon>
          )}
          {permission.hasInterviewRoundDelete && (
            <ActionIcon variant="light" color="red" onClick={onDelete} aria-label="Delete">
              <IconTrash size={18} />
            </ActionIcon>
          )}
        </Group>
      </Box>
    </Card>
  );
};

export default SortableRoundItem;
