'use client';
import React from 'react';
import { Grid } from '@mantine/core';
import { InterviewRoundsList } from './_components/InterviewRoundsList';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <Grid gutter="lg" h="100%">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <InterviewRoundsList />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        {children}
      </Grid.Col>
    </Grid>
  );
}
