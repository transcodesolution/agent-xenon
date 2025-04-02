import { useGetApplicantById } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { ApplicantProfile } from './ApplicantProfile';

export const ApplicantDetails = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { data: applicant } = useGetApplicantById({ applicantId: applicantId });

  return (
    <ApplicantProfile applicant={applicant?.data} />
  );
};
