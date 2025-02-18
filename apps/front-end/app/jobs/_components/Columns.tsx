import { DataTableColumn } from 'mantine-datatable';
import { IJob } from '@agent-xenon/interfaces';
import { Anchor, Badge } from '@mantine/core';

export const getColumns = (
  sortStatus: {
    columnAccessor: string;
    direction: string;
  }
): DataTableColumn<IJob>[] => {

  const statusColors = {
    open: 'var(--mantine-primary-color-5)',
    close: 'var(--mantine-red-6)',
    paused: 'var(--mantine-yellow-6)',
    interview_started: 'var(--mantine-green-6)'
  };
  return [
    {
      accessor: 'title',
      title: 'Title',
      ellipsis: true,
      sortable: true,
      width: 200,
      render: ({ _id, title }) => {
        return (
          <Anchor href={`/jobs/${_id}`} style={{ position: 'relative' }}>
            {title || '-'}
          </Anchor>
        );
      },
    },
    {
      accessor: 'status',
      title: 'Status',
      ellipsis: true,
      sortable: true,
      width: 125,
      render: ({ status }) => {
        return <Badge radius="sm" color={statusColors[status] || 'var(--mantine-gray-6)'}>{status}</Badge>;
      },
    },
    {
      accessor: 'createdAt',
      title: 'Created At',
      ellipsis: true,
      sortable: true,
      width: 180,
    },
    {
      accessor: 'updatedAt',
      title: 'Updated At',
      ellipsis: true,
      sortable: true,
      width: 180,
    },
  ];
};

export default getColumns;
