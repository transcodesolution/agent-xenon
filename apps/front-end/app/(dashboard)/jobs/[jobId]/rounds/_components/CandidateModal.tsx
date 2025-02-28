import { InterviewRoundStatus } from '@agent-xenon/constants';
import { IApplicantRound } from '@agent-xenon/interfaces';
import { Modal, Badge, Text, Select } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: IApplicantRound[];
  roundId: string;
  onUpdateStatus: (roundId: string, candidateId: string,) => void;
}

function CandidateModal({ isOpen, onClose, candidates, roundId, onUpdateStatus }: CandidateModalProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case InterviewRoundStatus.ONGOING:
        return 'yellow';
      case InterviewRoundStatus.COMPLETED:
        return 'teal';
      default:
        return 'gray';
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title={<Text fw={600} size="lg">Candidates</Text>} size="lg">
      <DataTable
        columns={[
          { accessor: 'name', title: 'Name', render: (candidate) => candidate.applicantId.firstName },
          { accessor: 'email', title: 'Email', render: (candidate) => candidate.applicantId.contactInfo.email },
          {
            accessor: 'status',
            title: 'Status',
            render: (candidate) => (
              <Badge color={getStatusColor(candidate.status)}>
                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
              </Badge>
            )
          },
          {
            accessor: 'isSelected',
            title: 'Selection',
            render: (candidate) => (
              <Select
                data={[
                  { value: 'selected', label: 'Selected' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
                value={candidate.isSelected ? 'selected' : 'rejected'}
                onChange={(value) => onUpdateStatus(roundId, candidate._id)}
                allowDeselect={false}
              />
            ),
          },
        ]}
        records={candidates}
        idAccessor="_id"
      />
    </Modal>
  );
}

export default CandidateModal;
