'use client'
import { useGetInterviewRoundsById, useGetInterviewRoundsByJobId, useInterviewRoundStart } from '@agent-xenon/react-query-hooks';
import { Stack } from '@mantine/core';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import RoundCard from './RoundCard';
import { IInterviewRounds } from '@agent-xenon/interfaces';
import CandidateModal from './CandidateModal';
import { InterviewRoundStatus } from '@agent-xenon/constants';

const InterviewRounds = () => {
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


  const handleShowCandidates = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  const handleUpdateCandidateStatus = (roundId: string, candidateId: string) => {
    // updateCandidateStatus({ roundId, jobId })

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
            onShowCandidates={handleShowCandidates}
            key={round._id}
          />
        );
      })}

      <CandidateModal
        isOpen={!!selectedRoundId}
        onClose={() => setSelectedRoundId("")}
        candidates={roundData?.data?.applicants || []}
        roundId={selectedRoundId || ''}
        onUpdateStatus={handleUpdateCandidateStatus}
      />
    </Stack>
  )
}

export default InterviewRounds