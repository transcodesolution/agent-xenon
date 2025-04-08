import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { ReactNode } from 'react';

type ConfirmModalOptions = Parameters<typeof modals.openConfirmModal>[0];

interface IUseConfirmDeleteOptions extends Omit<ConfirmModalOptions, 'children'> {
  itemName?: string;
  children?: ReactNode;
}

export function useConfirmDelete() {
  const confirmDelete = ({
    title = 'Confirm Delete',
    itemName,
    onConfirm,
    children,
    ...rest
  }: IUseConfirmDeleteOptions) => {
    modals.openConfirmModal({
      title,
      centered: true,
      children: children ?? (
        <Text size="sm">
          {`Are you sure you want to delete ${itemName ?? 'this item'}? This action cannot be undone.`}
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm,
      ...rest,
    });
  };

  return confirmDelete;
}
