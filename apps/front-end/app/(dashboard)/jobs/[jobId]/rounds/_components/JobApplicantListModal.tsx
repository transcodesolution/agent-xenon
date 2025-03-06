import { getStatusColor } from '@/libs/utils/ui-helpers';
import { InterviewRoundStatus } from '@agent-xenon/constants';
import { IApplicantRoundList } from '@agent-xenon/interfaces';
import { Modal, Badge, Text, Select } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

interface IJobApplicantModalData {
  isOpen: boolean;
  onClose: () => void;
  Applicants: IApplicantRoundList[];
  roundId: string;
  onUpdateStatus: (roundId: string, ApplicantId: string, value: string) => void;
}

export const JobApplicantListModal = ({ isOpen, onClose, Applicants, roundId, onUpdateStatus }: IJobApplicantModalData) => {

  const columns = [
    { accessor: 'name', title: 'Name', render: (Applicant: IApplicantRoundList) => Applicant.applicantId.firstName },
    { accessor: 'email', title: 'Email', render: (Applicant: IApplicantRoundList) => Applicant.applicantId.contactInfo.email },
    {
      accessor: 'status',
      title: 'Status',
      render: (Applicant: IApplicantRoundList) => {
        const isFinalStatus = [InterviewRoundStatus.SELECTED, InterviewRoundStatus.REJECTED].includes(Applicant.status);

        return isFinalStatus ? (
          <Badge color={getStatusColor(Applicant.status)}>
            {Applicant.status.charAt(0).toUpperCase() + Applicant.status.slice(1)}
          </Badge>
        ) : (
          <Select
            data={[
              { value: InterviewRoundStatus.SELECTED, label: 'Selected' },
              { value: InterviewRoundStatus.REJECTED, label: 'Rejected' },
            ]}
            value={Applicant.status}
            onChange={(value) => value && onUpdateStatus(roundId, Applicant.applicantId._id, value)}
          />
        );
      }
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

