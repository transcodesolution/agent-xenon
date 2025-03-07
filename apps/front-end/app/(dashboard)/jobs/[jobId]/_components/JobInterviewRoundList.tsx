import { Button } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import React from 'react';
import { IJob } from '@agent-xenon/interfaces';
import { IconEdit } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface IJobInterviewRoundList {
  rounds?: IJob['rounds'];
  onDeleteRound: (roundId: string[]) => void;
  onEditRound: (roundId: string) => void;
}

export const JobInterviewRoundList = ({ rounds, onDeleteRound, onEditRound }: IJobInterviewRoundList) => {

  const columns = [
    {
      accessor: 'name', title: 'Name', ellipsis: true,
      width: 350,
      render: (round: { name?: string }) => round.name || '-'
    },
    {
      accessor: 'type', title: 'Type', ellipsis: true,
      width: 250,
    },
    {
      accessor: 'endDate',
      title: 'Expire Date & Time',
      ellipsis: true,
      width: 250,
      render: (round: { endDate?: Date }) =>
        round.endDate ? dayjs(round.endDate).format('DD-MM-YYYY | HH:mm') : '-'
    },
    {
      accessor: 'qualificationCriteria',
      title: 'Qualification Criteria',
      ellipsis: true,
      width: 500,
      render: (round: { qualificationCriteria?: string }) => round.qualificationCriteria || '-'
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (round: { _id: string }) => (
        <>
          <Button color="var(--mantine-color-teal-filled-hover)" size="xs" onClick={() => onEditRound(round._id)} style={{ marginRight: '5px' }}>
            <IconEdit />
          </Button>
          <Button color="red" size="xs" onClick={() => onDeleteRound([round._id])}>
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <DataTable
      idAccessor='_id'
      columns={columns}
      records={rounds || []}
      highlightOnHover
      noRecordsText='No Interview Rounds Available'
    />
  );
};