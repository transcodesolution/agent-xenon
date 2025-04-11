'use client'
import { Grid, Loader, Text } from '@mantine/core';
import React from 'react';
import { ConnectGoogle } from './ConnectGoogle';
import { useGetApps } from '@/libs/react-query-hooks/src/lib/app';
import { IApp } from '@agent-xenon/interfaces';
import { ConnectSlack } from './ConnectSlack';

export const AppList = () => {

  const { data: getAppsResponse, isLoading } = useGetApps({ refetchOnWindowFocus: false });
  const appData = getAppsResponse?.data?.apps || [];

  const handleRenderApp = (app: IApp) => {
    switch (app.name) {
      case 'google':
        return <ConnectGoogle app={app} />;
      case 'slack':
        return <ConnectSlack app={app} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <Loader />
  }

  if (!isLoading && appData.length === 0) {
    return <Text>No Apps Found</Text>
  }

  return (
    <Grid>
      {appData.map((app, index) => (
        <Grid.Col key={index} span={4}>
          {handleRenderApp(app)}
        </Grid.Col>
      ))}
    </Grid>
  );
};
