'use client';

import {
  createTheme,
  Loader,
  MantineThemeProvider,
  Center,
  Box,
} from '@mantine/core';
import { RingLoader } from './RingLoader';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: 'ring',
      },
    }),
  },
});

const PageLoader = () => {
  return (
    <MantineThemeProvider theme={theme}>
      <Box
        w="100%"
        h="calc(100vh - 96px)"
      >
        <Center h="100%">
          <Loader size={70} />
        </Center>
      </Box>
    </MantineThemeProvider >
  );
};

export default PageLoader;
