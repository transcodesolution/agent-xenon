import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ITopic } from "@agent-xenon/interfaces";
import { ICreateTopicSection } from "@/libs/types-api/src";
import { createSection, deleteSection, updateSection } from "@/libs/web-apis/src";

interface ITopicStore {
  topic: ITopic | null;
}

export const useTopicStore = create<ITopicStore>()(
  immer((set) => ({
    topic: null,
  }))
);

export const setTopic = (topic: ITopic) => {
  useTopicStore.setState({ topic });
};

export const addSectionToTopic = async (section: Partial<ICreateTopicSection>): Promise<void> => {
  try {
    const res = await createSection(section);
    if (res?.data) {
      const newSection: ITopic['topicSections'][number] = res.data;

      useTopicStore.setState((state) => {
        const topicId = section.topicId;
        if (state.topic && state.topic._id === topicId) {
          if (!state.topic.topicSections) {
            state.topic.topicSections = [newSection];
          } else {
            state.topic.topicSections.push(newSection);
          }
        }
      });
    }
  } catch (error) {
    console.error('Error creating section and updating store:', error);
    throw error;
  }
};

export const deleteSectionFromTopic = async (sectionId: string, topicId: string): Promise<void> => {
  try {
    await deleteSection({ sectionId, topicId });
    useTopicStore.setState((state) => {
      if (state.topic) {
        state.topic.topicSections = state.topic.topicSections.filter(
          (section) => section._id !== sectionId
        );
      }
    });
  } catch (error) {
    console.error('Error while deleting section:', error);
    throw error;
  }
};


export const updateSectionToTopic = async (params: Partial<ICreateTopicSection>): Promise<void> => {
  try {
    const res = await updateSection(params);
    if (res?.data) {
      const updatedSection = res.data;

      useTopicStore.setState((state) => {
        if (state.topic) {
          const index = state.topic.topicSections.findIndex(
            (section) => section._id === updatedSection._id
          );

          if (index !== -1) {
            state.topic.topicSections[index] = {
              ...state.topic.topicSections[index],
              ...updatedSection,
            };
          }
        }
      });
    }
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
};