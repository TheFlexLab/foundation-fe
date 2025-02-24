import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { toast } from 'sonner';
import { setSeldonData } from '../../features/seldon-ai/seldonDataSlice';
import { useDispatch } from 'react-redux';

export const chatGptData = async ({ params }) => {
  const queryString = new URLSearchParams(params).toString();
  return await api.post(`/chatbot/chatGptData?${queryString}`);
};

export const useChatGptDataMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ params }) => {
      return chatGptData({ params });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        // Pessimistic Update
        // queryClient.setQueryData(['SingleQuest'], (oldData) => {
        //   return resp.data?.data[0] || oldData;
        // });
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return { mutateAsync, isPending };
};

export const publishArticle = async ({
  userUuid,
  prompt,
  title,
  abstract,
  groundBreakingFindings,
  suggestion,
  source,
  seoSummary,
  discussion,
  conclusion,
  settings,
  articleId,
  image, // Add image file here
}) => {
  const formData = new FormData();
  console.log(source);

  formData.append('userUuid', userUuid);
  formData.append('prompt', prompt);
  formData.append('title', title);
  formData.append('abstract', abstract);
  formData.append('groundBreakingFindings', JSON.stringify(groundBreakingFindings));
  formData.append('suggestions', JSON.stringify(suggestion));
  formData.append('source', JSON.stringify(source));
  formData.append('seoSummary', seoSummary);
  formData.append('discussion', discussion);
  formData.append('conclusion', conclusion);
  formData.append('settings', JSON.stringify(settings));

  if (articleId) {
    formData.append('articleId', articleId);
  }

  if (image) {
    formData.append('file', image);
  }

  return await api.post(`/article/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Required for file uploads
    },
  });
};

export const usePublishArticleMutation = () => {
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async ({
      userUuid,
      prompt,
      title,
      abstract,
      groundBreakingFindings,
      suggestion,
      source,
      seoSummary,
      discussion,
      conclusion,
      settings,
      articleId,
      image,
    }) => {
      return publishArticle({
        userUuid,
        prompt,
        title,
        abstract,
        groundBreakingFindings,
        suggestion,
        source,
        seoSummary,
        discussion,
        conclusion,
        settings,
        articleId,
        image,
      });
    },
    onSuccess: (resp) => {
      if (resp.status === 201) {
        showToast('success', 'articlePublished');

        dispatch(setSeldonData({ articleId: resp.data._id }));
      }
    },
    onError: (error) => {
      console.log(error);
      if (error?.response?.data?.error === 'File too large') {
        toast.error('File too large. Please select a file less than 1 MB.');
      } else {
        // Show error message in a toast
        toast.warning(error.response.data.message);
      }
    },
  });

  return mutation;
};
