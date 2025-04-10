'use client';
import { Loader, Center, Box } from '@mantine/core';

const PageLoader = () => {
  return (
    <Box
      w="100%"
      h="calc(100vh - 96px)"
    >
      <Center h="100%">
        <Loader />
      </Center>
    </Box>
  );
};

export default PageLoader;
