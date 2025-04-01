import { useGetApplicantById, useGetApplicantInterviewRoundDetails, useGetApplicantInterviewRounds } from '@agent-xenon/react-query-hooks';
import { Grid, LoadingOverlay, Stack, Tabs, Text } from '@mantine/core';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { InterviewRoundsList } from './InterviewRoundsList';
import { RoundDetails } from './RoundDetails';
import { ApplicantProfile } from './ApplicantProfile';

export const ApplicantDetails = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { data: applicant } = useGetApplicantById({ applicantId: applicantId });
  const { data: applicantInterviewRounds } = useGetApplicantInterviewRounds({ applicantId: applicantId });
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const { data: interviewRoundDetails, isLoading } = useGetApplicantInterviewRoundDetails({
    roundId: selectedRoundId ?? "",
    applicantId: applicantId,
    enabled: !!selectedRoundId,
  });

  const handleSelectRound = (roundId: string) => {
    setSelectedRoundId(roundId);
  };

  return (
    <Stack>
      <Tabs defaultValue="applicant">
        <Tabs.List mb='md'>
          <Tabs.Tab value="applicant"> <Text size='md'>Applicant Profile</Text></Tabs.Tab>
          <Tabs.Tab value="interviews"><Text size='md'>Interview Rounds</Text></Tabs.Tab>
        </Tabs.List>

        {/* Applicant Profile Tab */}
        <Tabs.Panel value="applicant" h='calc(100vh - 196px)' >
          <ApplicantProfile applicant={applicant?.data} />
        </Tabs.Panel>

        {/* Interview Rounds Tab */}
        <Tabs.Panel value="interviews" h='calc(100vh - 196px)' >
          <Grid gutter="lg" h='100%'>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <InterviewRoundsList
                rounds={applicantInterviewRounds?.data?.applicantInterviewRounds ?? []}
                selectedRoundId={selectedRoundId}
                onSelectRound={handleSelectRound}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }} >
              {isLoading ? (
                <LoadingOverlay visible />
              ) : (
                <RoundDetails
                  selectedInterviewRound={interviewRoundDetails?.data?.interviewRound ?? []}
                  roundDetails={interviewRoundDetails?.data?.applicantRoundAndQuestionAnswers ?? []}
                />
              )}
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
