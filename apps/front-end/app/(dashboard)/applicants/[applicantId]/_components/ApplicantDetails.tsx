'use client'

import { useGetApplicantById } from '@agent-xenon/react-query-hooks';
import { useParams } from 'next/navigation';
import { ApplicantProfile } from './ApplicantProfile';

export const ApplicantDetails = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { data: getApplicantByIdResponse } = useGetApplicantById({ applicantId });
  const applicant = getApplicantByIdResponse?.data;

  return (
    <ApplicantProfile applicant={applicant} />
  );
};
