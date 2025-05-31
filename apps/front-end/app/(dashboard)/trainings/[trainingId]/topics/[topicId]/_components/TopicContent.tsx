import React from "react";
import { Text, Loader, Group, Stack } from "@mantine/core";
import { ITopic } from "@agent-xenon/interfaces";
import SectionCard from "./SectionCard";
import SectionTypeButtons from "./SectionTypeButtons";

interface ITopicContent {
  topic: ITopic | null;
  isLoading: boolean;
}

const TopicContent = ({ topic, isLoading }: ITopicContent) => {
  const sections = topic?.topicSections || [];
  const childTopicsCount = topic?.childTopics?.length || 0;
  const isLoaderVisible = isLoading;

  return (
    <Stack>
      <Group p="md" styles={{ root: { borderBottom: "1px solid #e0e0e0" } }}>
        {isLoaderVisible ? (
          <Loader size="sm" />
        ) : topic ? (
          <React.Fragment>
            <Text fw={500} size="lg">{topic.name}</Text>
            <Group gap="xs" mt={4}>
              <Text size="sm" c="dimmed">{childTopicsCount} subtopics</Text>
              <Text size="sm" c="dimmed">•</Text>
              <Text size="sm" c="dimmed">{sections.length} sections</Text>
            </Group>
          </React.Fragment>
        ) : (
          <Text fw={500} size="lg">Select a topic</Text>
        )}
      </Group>
      <SectionTypeButtons />
      {!isLoaderVisible && topic && (
        <Stack h='calc(100vh - 222px)' styles={{ root: { overflowY: 'auto' } }}>
          {sections.length > 0 ? (
            sections.map((section) => (
              <SectionCard key={section._id} section={section} />
            ))
          ) : (
            <Text c="dimmed" py="xl">
              No sections found. Use the buttons on the right to add one.
            </Text>
          )}
        </Stack>
      )}

      {!isLoaderVisible && !topic && (
        <Text c="dimmed" py="xl">
          Select a topic from the left panel to view its content
        </Text>
      )}
    </Stack>
  );
};

export default TopicContent;
