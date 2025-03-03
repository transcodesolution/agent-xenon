'use client'
import { useGetInterviewRoundsById, useGetInterviewRoundsByJobId, useInterviewRoundStart } from '@agent-xenon/react-query-hooks';
import { Stack } from '@mantine/core';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { IInterviewRounds } from '@agent-xenon/interfaces';
import { InterviewRoundStatus } from '@agent-xenon/constants';
import { RoundCard } from './RoundCard';
import { JobApplicantListModal } from './JobApplicantListModal';

export const InterviewRounds = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: rounds, refetch } = useGetInterviewRoundsByJobId({ jobId });
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');
  const { data: roundData } = useGetInterviewRoundsById({ roundId: selectedRoundId });
  const { mutate: interviewRoundStart } = useInterviewRoundStart();

  const handleStartRound = (roundId: string) => {
    interviewRoundStart({ roundId, jobId }, {
      onSuccess: () => {
        refetch();
      }
    })
  }

  const handleShowApplicants = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  const handleUpdateApplicantStatus = (roundId: string, ApplicantId: string) => {
    // updateApplicantStatus({ roundId, jobId })
  };

  return (
    <Stack gap="lg">
      {rounds?.data?.map((round: IInterviewRounds, index: number) => {
        const isPreviousRoundsCompleted = rounds?.data?.slice(0, index)
          .every((prevRound) => prevRound.status === InterviewRoundStatus.COMPLETED);

        return (
          <RoundCard
            round={round}
            isDisabled={!isPreviousRoundsCompleted || round?.status === InterviewRoundStatus.COMPLETED}
            onStartRound={handleStartRound}
            onShowApplicants={handleShowApplicants}
            key={round._id}
          />
        );
      })}

      <JobApplicantListModal
        isOpen={!!selectedRoundId}
        onClose={() => setSelectedRoundId("")}
        Applicants={roundData?.data?.applicants || []}
        roundId={selectedRoundId || ''}
        onUpdateStatus={handleUpdateApplicantStatus}
      />
    </Stack>
  )
}
