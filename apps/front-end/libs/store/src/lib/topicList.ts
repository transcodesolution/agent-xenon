import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ITopic } from "@agent-xenon/interfaces";
import { createTopic, deleteTopic, getTopics, updateTopic } from "@/libs/web-apis/src";

interface ITopicListStore {
  topics: Record<string, ITopic & { isExpanded?: boolean; isEditing?: boolean }>;
  rootTopicIds: string[];
  isLoading: boolean;
}

interface CreateTopicArgs {
  trainingId: string;
  parentTopicId?: string | null;
}

const initialState: ITopicListStore = {
  topics: {},
  rootTopicIds: [],
  isLoading: false,
};

export const useTopicListStore = create<ITopicListStore>()(
  immer(() => ({
    ...initialState,
  }))
);

const { setState } = useTopicListStore;

export const loadTrainingTopics = async (trainingId: string) => {
  setState((state) => {
    state.isLoading = true;
  });

  try {
    const res = await getTopics(trainingId);
    const topics: ITopic[] = res?.data?.topics || [];

    const topicMap: Record<string, ITopic & { isExpanded?: boolean; isEditing?: boolean }> = {};
    const rootTopicIds: string[] = [];

    const flattenTree = (items: ITopic[], parentTopicId: string | null = null) => {
      items.forEach((item) => {
        topicMap[item._id] = { ...item, isExpanded: true, isEditing: false };

        if (!parentTopicId) {
          rootTopicIds.push(item._id);
        }

        if (item.childTopics?.length) {
          flattenTree(item.childTopics, item._id);
        }
      });
    };

    flattenTree(topics);

    setState((state) => {
      state.topics = topicMap;
      state.rootTopicIds = rootTopicIds;
      state.isLoading = false;
    });
  } catch (err) {
    console.error("Failed to load topics:", err);
    setState((state) => {
      state.isLoading = false;
    });
  }
};

export const createTrainingTopic = async ({ trainingId, parentTopicId = null, }: CreateTopicArgs) => {
  try {
    const topic: { trainingId: string; parentTopicId?: string } = { trainingId };
    if (parentTopicId !== null) topic.parentTopicId = parentTopicId;

    const response = await createTopic(topic);
    if (response?.data) {
      const newTopic = response?.data
      const topicWithExtras: ITopic & { isExpanded: boolean; isEditing: boolean } = {
        ...newTopic,
        childTopics: newTopic.childTopics || [],
        parentTopicId: parentTopicId || '',
        trainingId,
        isExpanded: true,
        isEditing: true,
      };
      setState((state) => {
        state.topics[topicWithExtras._id] = topicWithExtras;

        if (parentTopicId && state.topics[parentTopicId]) {
          state.topics[parentTopicId].childTopics = state.topics[parentTopicId].childTopics || [];
          state.topics[parentTopicId].childTopics.push(topicWithExtras);
        } else {
          state.rootTopicIds.push(topicWithExtras._id);
        }
      });
    }
  } catch (err) {
    console.error('Error creating topic:', err);
    throw err;
  }
};

export const updateTrainingTopic = async ({ topicId, updatedName }: { topicId: string; updatedName: string; }) => {
  try {
    setState((state) => {
      const topic = state.topics[topicId];
      if (topic) {
        topic.name = updatedName;
        topic.isEditing = false;
      }
    });

    const updatedTopic = await updateTopic({
      _id: topicId,
      name: updatedName,
    });
    return updatedTopic;

  } catch (error) {
    console.error('Failed to update topic:', error);
    throw error;
  }
};

export const deleteTrainingTopic = async (topicId: string) => {
  try {
    await deleteTopic(topicId);
    setState((state) => {
      const topicToDelete = state.topics[topicId];
      if (!topicToDelete) return;

      const parentId = topicToDelete.parentTopicId || null;

      const deleteRecursively = (id: string) => {
        const topic = state.topics[id];
        if (!topic) return;

        topic.childTopics?.forEach(child => deleteRecursively(child._id));

        delete state.topics[id];
      };

      deleteRecursively(topicId);

      if (parentId && state.topics[parentId]) {
        state.topics[parentId].childTopics = state.topics[parentId].childTopics?.filter(child => child._id !== topicId) || [];
      } else {
        state.rootTopicIds = state.rootTopicIds.filter(id => id !== topicId);
      }
    });

  } catch (error) {
    console.error("Failed to delete training topic:", error);
    throw error;
  }
};
