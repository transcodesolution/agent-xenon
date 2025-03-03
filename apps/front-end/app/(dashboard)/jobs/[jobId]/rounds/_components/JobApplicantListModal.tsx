import { getStatusColor } from '@/libs/utils/ui-helpers';
import {  IApplicantRound } from '@agent-xenon/interfaces';
import { Modal, Badge, Text, Select } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

interface IJobApplicantModalData {
  isOpen: boolean;
  onClose: () => void;
  Applicants: IApplicantRound[];
  roundId: string;
  onUpdateStatus: (roundId: string, ApplicantId: string,) => void;
}

export const JobApplicantListModal = ({ isOpen, onClose, Applicants, roundId, onUpdateStatus }: IJobApplicantModalData) => {

  const columns = [
    { accessor: 'name', title: 'Name', render: (Applicant: IApplicantRound) => Applicant.applicantId.firstName },
    { accessor: 'email', title: 'Email', render: (Applicant: IApplicantRound) => Applicant.applicantId.contactInfo.email },
    {
      accessor: 'status',
      title: 'Status',
      render: (Applicant: IApplicantRound) => (
        <Badge color={getStatusColor(Applicant.status)}>
          {Applicant.status.charAt(0).toUpperCase() + Applicant.status.slice(1)}
        </Badge>
      )
    },
    {
      accessor: 'isSelected',
      title: 'Selection',
      render: (Applicant: IApplicantRound) => (
        <Select
          data={[
            { value: 'selected', label: 'Selected' },
            { value: 'rejected', label: 'Rejected' }
          ]}
          value={Applicant.isSelected ? 'selected' : 'rejected'}
          onChange={(value) => onUpdateStatus(roundId, Applicant._id)}
          allowDeselect={false}
        />
      ),
    },
  ];

  return (
    <Modal opened={isOpen} onClose={onClose} title={<Text fw={600} size="lg">Applicants</Text>} size="lg">
      <DataTable
        columns={columns}
        records={Applicants}
        idAccessor="_id"
      />
    </Modal>
  );
}

