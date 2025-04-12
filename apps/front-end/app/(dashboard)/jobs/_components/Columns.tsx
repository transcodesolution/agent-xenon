import { DataTableColumn } from 'mantine-datatable';
import { IJob } from '@agent-xenon/interfaces';
import { Anchor, Badge } from '@mantine/core';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getJobStatusColor } from '@/libs/utils/ui-helpers';

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
          <Anchor component={Link} href={`/jobs/${_id}`} style={{ position: 'relative' }}>{title || '-'}</Anchor>
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
        return <Badge radius="sm" variant="light" color={getJobStatusColor(status)}>{status}</Badge>;
      },
    },
    {
      accessor: 'createdAt',
      title: 'Created At',
      ellipsis: true,
      sortable: true,
      width: 180,
      render: ({ createdAt }) =>
        createdAt ? dayjs(createdAt).format('DD-MM-YYYY | HH:mm') : '-'
    },
    {
      accessor: 'updatedAt',
      title: 'Updated At',
      ellipsis: true,
      sortable: true,
      width: 180,
      render: ({ updatedAt }) =>
        updatedAt ? dayjs(updatedAt).format('DD-MM-YYYY | HH:mm') : '-'
    },
  ];
};

export default getColumns;