import { Button } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import React from 'react';
import { IJob } from '@agent-xenon/interfaces';

interface IJobInterviewRoundList {
  rounds?: IJob['rounds'];
  onDeleteRound: (roundId: string[]) => void;
}

export const JobInterviewRoundList = ({ rounds, onDeleteRound }: IJobInterviewRoundList) => {
  const columns = [
    { accessor: 'name', title: 'Name', render: (round: { name?: string }) => round.name || '-' },
    { accessor: 'type', title: 'Type' },
    { accessor: 'durationInSeconds', title: 'Duration (s)' },
    {
      accessor: 'qualificationCriteria',
      title: 'Qualification Criteria',
      render: (round: { qualificationCriteria?: string }) => round.qualificationCriteria || '-'
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (round: { _id: string }) => (
        <Button color='red' size='xs' onClick={() => onDeleteRound([round._id])}>
          Delete
        </Button>
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