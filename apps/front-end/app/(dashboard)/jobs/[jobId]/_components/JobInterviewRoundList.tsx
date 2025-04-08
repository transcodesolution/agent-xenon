import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { IJob } from '@agent-xenon/interfaces';
import SortableRoundItem from './SortableRoundItem';
import { useConfirmDelete } from '@/libs/hooks/useConfirmDelete';

interface IJobInterviewRoundList {
  rounds?: IJob['rounds'];
  onDeleteRound: (roundIds: string[]) => void;
  onEditRound: (roundId: string) => void;
  onReorderRounds: (roundIds: string[]) => void;
}

export const JobInterviewRoundList = ({
  rounds = [],
  onDeleteRound,
  onEditRound,
  onReorderRounds,
}: IJobInterviewRoundList) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    })
  );
  const confirmDelete = useConfirmDelete();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rounds.findIndex((item) => item._id === active.id);
      const newIndex = rounds.findIndex((item) => item._id === over.id);
      const reorderedRounds = [...rounds];
      const [removed] = reorderedRounds.splice(oldIndex, 1);
      reorderedRounds.splice(newIndex, 0, removed);
      onReorderRounds(reorderedRounds.map((round) => round._id));
    }
  };

  const handleDelete = (roundId: string) => {
    confirmDelete({
      itemName: 'this interview round',
      onConfirm: () => onDeleteRound([roundId]),
    });
  };

  if (!rounds.length) {
    return (
      <Paper p="lg" withBorder ta="center" c="dimmed">
        <Text>No Interview Rounds Available</Text>
      </Paper>
    );
  }

  return (
    <Box>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={rounds.map((round) => round._id)}
          strategy={verticalListSortingStrategy}
        >
          {rounds.map((round) => (
            <SortableRoundItem
              key={round._id}
              round={round}
              onEdit={() => onEditRound(round._id)}
              onDelete={() => handleDelete(round._id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default JobInterviewRoundList;
