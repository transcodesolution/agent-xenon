import { getTopicById } from '@agent-xenon/web-apis';
import { useQuery } from '@tanstack/react-query';

export const useGetTopicById = ({
  topicId
}: { topicId: string }) => {
  return useQuery({
    queryKey: ['getTopicById', topicId],
    queryFn: async () => getTopicById(topicId),
    refetchOnWindowFocus: false,
  });
};
