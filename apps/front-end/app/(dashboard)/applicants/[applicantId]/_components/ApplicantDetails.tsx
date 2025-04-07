'use client'

import { useGetApplicantById } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { ApplicantProfile } from './ApplicantProfile';

export const ApplicantDetails = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { data: getApplicantResponse } = useGetApplicantById({ applicantId });
  const applicant = getApplicantResponse?.data;

  return (
    <ApplicantProfile applicant={applicant} />
  );
};
