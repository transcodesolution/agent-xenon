import React, { useState } from 'react';
import { Textarea, TextInput, Button, Text, Stack, Group, Paper, ScrollArea, Divider, Box, Loader, Flex } from '@mantine/core';
import { IconSend, IconRobot } from '@tabler/icons-react';
import { updateSectionToTopic } from '@/libs/store/src/lib/topic';
import { useParams } from 'next/navigation';
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';

interface IAssistantSection {
  section: ITopicSection;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const AssistantSection = ({ section, isEditing, setIsEditing }: IAssistantSection) => {
  const assistantConfig = section.topicSectionConfig[TopicSectionType.ASSISTANT] || { prompt: 'How can I help you with this topic?' };
  const { topicId } = useParams() as { topicId: string };
  const [prompt, setPrompt] = useState(assistantConfig.prompt || '');
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = async () => {
    try {
      await updateSectionToTopic({
        _id: section._id,
        topicId: topicId,
        topicSectionConfig: {
          ...section.topicSectionConfig,
          [TopicSectionType.ASSISTANT]: {
            prompt: prompt,
          },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update assistant section:', error);
    }
  };

  const handleCancel = () => {
    setPrompt(assistantConfig.prompt || '');
    setIsEditing(false);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user' as const, content: userInput };
    setConversation((prev) => [...prev, newMessage]);
    setUserInput('');
    setIsProcessing(true);

    setTimeout(() => {
      const assistantResponse = {
        role: 'assistant' as const,
        content: `I'm your AI assistant for this topic. ${prompt} This is a demonstration of how the assistant would respond to your query: "${newMessage.content}"`,
      };
      setConversation((prev) => [...prev, assistantResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  if (isEditing) {
    return (
      <Stack p="md" >
        <Textarea
          label="Assistant Prompt"
          description="This prompt will guide how the AI assistant responds to user queries about this topic."
          placeholder="Enter a prompt for the AI assistant..."
          value={prompt}
          onChange={(e) => setPrompt(e.currentTarget.value)}
          autosize
          minRows={3}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Stack>
    );
  }

  return (
    <Stack >
      <Paper shadow="xs" p="md" withBorder>
        <Text size="sm" c="dimmed" mb={4}>
          <strong>AI Assistant:</strong> {prompt}
        </Text>
      </Paper>

      <Paper shadow="xs" withBorder radius="md">
        <ScrollArea h={300} p="md">
          {conversation.length === 0 ? (
            <Stack align="center" justify="center" h="100%">
              <IconRobot size={32} stroke={1.5} />
              <Text size="sm" c="dimmed">
                Start a conversation with the AI assistant
              </Text>
            </Stack>
          ) : (
            conversation.map((msg, i) => (
              <Box
                key={i}
                mb="sm"
                style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}
              >
                <Box
                  px="md"
                  py="sm"
                  display='inline-block'
                  style={(theme) => ({
                    borderRadius: 12,
                    backgroundColor:
                      msg.role === 'user'
                        ? theme.colors.blue[6]
                        : theme.colors.gray[2],
                    color:
                      msg.role === 'user' ? theme.white : theme.colors.dark[7],
                    maxWidth: '80%',
                    borderBottomLeftRadius:
                      msg.role === 'assistant' ? 0 : 12,
                    borderBottomRightRadius: msg.role === 'user' ? 0 : 12,
                  })}
                >
                  {msg.content}
                </Box>
              </Box>
            ))
          )}
          {isProcessing && (
            <Group mt="sm">
              <Loader size="xs" />
              <Text size="xs" c="dimmed">
                AI is thinking...
              </Text>
            </Group>
          )}
        </ScrollArea>

        <Divider my="xs" />

        <Flex p="xs" gap="xs">
          <TextInput
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            w='100%'
          />
          <Button
            onClick={handleSendMessage}
            px='sm'
          >
            <IconSend size={16} />
          </Button>
        </Flex>
      </Paper>

      <Text size="xs" c="dimmed">
        Note: This is a demonstration of the AI Assistant interface. In a
        production environment, this would connect to an actual AI service.
      </Text>
    </Stack>
  );
};

export default AssistantSection;
