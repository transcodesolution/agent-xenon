'use client';
import { Grid } from '@mantine/core';
import TopicList from './TopicList';

export function TopicLayout({ children }: { children: React.ReactNode }) {

  return (
    <Grid gutter="sm">
      <Grid.Col span={3}>
        <TopicList />
      </Grid.Col>
      <Grid.Col span={9}>
        {children}
      </Grid.Col>
    </Grid>
  );
}
