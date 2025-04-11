import { Container, Title, Text, Button, Grid, Group, Image, Stack, GridCol } from '@mantine/core';

export const Hero = () => {
  return (
    <Container size="lg" py={{ base: 'xl', md: '4rem' }}>
      <Grid gutter={40}>
        <GridCol span={{ base: 12, md: 6 }}>
          <Stack gap="xl">
            <Title order={1} size="3rem" lh={1.1}>
              AI-Powered <Text span c="blue.9" inherit>Recruitment Platform</Text>
            </Title>

            <Text size="lg" c="gray.7">
              Streamline your hiring process with Agent Xenon. Automated screening, assessments, and seamless candidate management all in one platform.
            </Text>

            <Group mt="xl">
              <Button size="lg" color="blue.9">
                Get started
              </Button>
              <Button size="lg" variant="outline" color="blue.9">
                See demo
              </Button>
            </Group>
          </Stack>
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }} style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/assets/images/heroImage.png"
            alt="Team working on recruitment process"
            radius="md"
          />
        </GridCol>
      </Grid>
    </Container>
  );
}
