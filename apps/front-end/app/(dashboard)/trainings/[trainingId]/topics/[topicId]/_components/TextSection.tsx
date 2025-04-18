import React, { useEffect, useState } from 'react';
import {
  Button,
  Group,
  Box,
  ScrollArea,
  Text
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { updateSectionToTopic } from '@/libs/store/src/lib/topic';
import { ITopicSection } from '@agent-xenon/interfaces';
import { TopicSectionType } from '@agent-xenon/constants';
import { useParams } from 'next/navigation';

interface TextSectionProps {
  section: ITopicSection;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

const TextSection: React.FC<TextSectionProps> = ({ section, isEditing, setIsEditing }) => {
  const textConfig = section.topicSectionConfig[TopicSectionType.TEXT] || { text: '' };
  const [content, setContent] = useState(textConfig.text || '');
  const { topicId } = useParams() as { topicId: string };

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && textConfig.text !== editor.getHTML()) {
      editor.commands.setContent(textConfig.text || '');
    }
  }, [section, editor]);

  const handleSave = async () => {
    try {
      await updateSectionToTopic({
        _id: section._id,
        topicId: topicId,
        topicSectionConfig: {
          ...section.topicSectionConfig,
          [TopicSectionType.TEXT]: {
            text: content,
          },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update text section:', error);
    }
  };

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent(textConfig.text || '');
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Box>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Toolbar sticky stickyOffset={8}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Code />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content />
        </RichTextEditor>

        <Group mt="md">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </Group>
      </Box>
    );
  }

  return (
    <Box>
      {content ? (
        <ScrollArea>
          <Box dangerouslySetInnerHTML={{ __html: content }} />
        </ScrollArea>
      ) : (
        <Text c="dimmed" py="md">
          No content added yet
        </Text>
      )}
    </Box>
  );
};

export default TextSection;
