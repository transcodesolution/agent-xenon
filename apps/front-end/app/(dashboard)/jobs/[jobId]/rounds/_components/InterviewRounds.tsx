'use client';
import {
  useGetInterviewRoundsById,
  useGetInterviewRoundsByJobId,
  useInterviewRoundStart,
  useInterviewRoundUpdateStatus
} from '@agent-xenon/react-query-hooks';
import { LoadingOverlay, Stack } from '@mantine/core';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { IInterviewRound } from '@agent-xenon/interfaces';
import { InterviewRoundStatus } from '@agent-xenon/constants';
import { RoundCard } from './RoundCard';
import { JobApplicantListModal } from './JobApplicantListModal';
import { IUpdateInterviewRoundStatusRequest } from '@/libs/types-api/src';
import { showNotification } from '@mantine/notifications';

export const InterviewRounds = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: getInterviewRoundsResponse, isLoading, refetch } = useGetInterviewRoundsByJobId({ jobId });
  const [selectedRoundId, setSelectedRoundId] = useState<string>('');
  const { data: getSelectedRoundResponse } = useGetInterviewRoundsById({ roundId: selectedRoundId });
  const interviewRounds = getInterviewRoundsResponse?.data || [];
  const selectedRoundApplicants = getSelectedRoundResponse?.data?.applicants || [];

  const { mutate: startInterviewRound } = useInterviewRoundStart();
  const { mutate: updateRoundStatus } = useInterviewRoundUpdateStatus();

  const handleStartRound = (roundId: string) => {
    startInterviewRound({ roundId, jobId }, {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        showNotification({
          title: 'Google Login Required',
          message: error.message,
          color: 'red',
        });
      }
    });
  };

  const handleUpdateRoundStatus = (roundId: string, newStatus: string, applicantId?: string) => {
    const roundUpdateData: IUpdateInterviewRoundStatusRequest = { roundId, jobId, roundStatus: newStatus };
    if (applicantId) {
      roundUpdateData.applicantId = applicantId;
    }
    updateRoundStatus(roundUpdateData, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  const handleShowApplicants = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  return (
    <Stack>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      {interviewRounds?.map((round: IInterviewRound, index: number) => {
        const isPreviousRoundsCompleted = interviewRounds?.slice(0, index)
          .every((prevRound) => prevRound.status === InterviewRoundStatus.COMPLETED);

        return (
          <RoundCard
            round={round}
            isDisabled={!isPreviousRoundsCompleted || round.status === InterviewRoundStatus.COMPLETED}
            onStartRound={handleStartRound}
            onUpdateRoundStatus={handleUpdateRoundStatus}
            onShowApplicants={handleShowApplicants}
            key={round._id}
          />
        );
      })}

      <JobApplicantListModal
        isOpen={!!selectedRoundId}
        onClose={() => setSelectedRoundId("")}
        Applicants={selectedRoundApplicants}
        roundId={selectedRoundId || ''}
        onUpdateStatus={handleUpdateRoundStatus}
      />
    </Stack>
  );
};
