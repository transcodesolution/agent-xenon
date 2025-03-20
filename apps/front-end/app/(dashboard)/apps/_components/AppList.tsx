'use client'
import { Grid } from '@mantine/core';
import React from 'react';
import { ConnectGoogle } from './ConnectGoogle';
import { ConnectSlack } from './ConnectSlack';

const apps = [
  { name: 'google' },
  { name: 'slack' },
];

export const AppList = () => {
  const handleRenderApp = (appName: string) => {
    switch (appName) {
      case 'google':
        return <ConnectGoogle />;
      case 'slack':
        return <ConnectSlack />;
      default:
        return null;
    }
  };

  return (
    <Grid>
      {apps.map((app, index) => (
        <Grid.Col key={index} span={4}>
          {handleRenderApp(app.name)}
        </Grid.Col>
      ))}
    </Grid>
  );
};
