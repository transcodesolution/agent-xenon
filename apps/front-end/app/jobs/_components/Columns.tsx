import { DataTableColumn } from 'mantine-datatable';
import { IJob } from '@agent-xenon/interfaces';

export const getColumns = (
  sortStatus: {
    columnAccessor: string;
    direction: string;
  }
): DataTableColumn<IJob>[] => {
  return [
    {
      accessor: 'title',
      title: 'Title',
      ellipsis: true,
      sortable: true,
      width: 200,
    },
    {
      accessor: 'status',
      title: 'Status',
      ellipsis: true,
      sortable: true,
      width: 100,
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
