import { useMutation, useQueryClient } from '@tanstack/react-query';
import showToast from '../../components/ui/Toast';
import api from '../api/Axios';

export const deleteAllAnalyze = async ({ userUuid, questForeignKey }) => {
  return await api.delete(`/infoquestions/deleteAllAdvanceAnalytics/${userUuid}/${questForeignKey}`);
};

export const deleteAnalyze = async ({ userUuid, questForeignKey, type, id }) => {
  return await api.delete(`/infoquestions/deleteAdvanceAnalytics/${userUuid}/${questForeignKey}/${type}/${id}`);
};

export const analyze = async ({ userUuid, questForeignKey, hiddenOptionsArray, id, order }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'hide',
    order,
    createdAt: new Date(),
    hiddenOptionsArray,
    id,
  });
};

export const analyzeBadge = async ({ userUuid, questForeignKey, operand, range, id, order }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'badgeCount',
    order,
    createdAt: new Date(),
    oprend: operand,
    range,
    id,
  });
};

export const analyzeTarget = async ({
  userUuid,
  questForeignKey,
  targetedOptionsArray,
  targetedQuestForeignKey,
  id,
  order,
}) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'target',
    order,
    createdAt: new Date(),
    targetedOptionsArray,
    targetedQuestForeignKey,
    id,
  });
};

export const analyzeActivity = async ({ userUuid, questForeignKey, allParams, id, order }) => {
  return await api.post(`/infoquestions/advanceAnalytics/${userUuid}/${questForeignKey}`, {
    type: 'activity',
    order,
    createdAt: new Date(),
    allParams: allParams,
    id,
  });
};

export const analyzeOrder = async ({ userUuid, questForeignKey, payload }) => {
  const transformedPayload = payload.map((item, index) => ({
    order: index + 1,
    type: item.type,
    _id: item._id,
  }));

  return await api.post(`/infoquestions/updateAnalyticsOrder/${userUuid}/${questForeignKey}`, {
    order: transformedPayload,
  });
};

export const useDeleteAllAnalyzeMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey }) => {
      return deleteAllAnalyze({ userUuid, questForeignKey });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });

        // Optionally close the modal or perform other UI updates
        handleClose();
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const useDeleteAnalyzeMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, type, id }) => {
      return deleteAnalyze({ userUuid, questForeignKey, type, id });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });

        // Optionally close the modal or perform other UI updates
        handleClose();
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const useAnalyzePostMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, hiddenOptionsArray, id, order }) => {
      return analyze({ userUuid, questForeignKey, hiddenOptionsArray, id, order });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });

        // Optionally close the modal or perform other UI updates
        handleClose();
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const useAnalyzeBadgeMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, operand, range, id, order }) => {
      return analyzeBadge({ userUuid, questForeignKey, operand, range, id, order });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });

        // Optionally close the modal or perform other UI updates
        handleClose();
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const useAnalyzeTargetMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey, id, order }) => {
      return analyzeTarget({ userUuid, questForeignKey, targetedOptionsArray, targetedQuestForeignKey, id, order });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });

        // Optionally close the modal or perform other UI updates
        handleClose();
      }
    },
    onError: (error) => {
      console.log(error);
      if (error.response.status === 409) {
        showToast('warning', 'optionAlreadyExists');
      }
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const useAnalyzeActivityMutation = ({ handleClose }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, allParams, id, order }) => {
      return analyzeActivity({ userUuid, questForeignKey, allParams, id, order });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });

        // Optionally close the modal or perform other UI updates
        handleClose();
      }
    },
    onError: (error) => {
      if (error?.response?.status === 409) {
        showToast('warning', 'activityAlreadyExists');
      }
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};

export const useAnalyzeOrderMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userUuid, questForeignKey, payload }) => {
      return analyzeOrder({ userUuid, questForeignKey, payload });
    },
    onSuccess: (resp) => {
      if (resp.status === 200) {
        showToast('success', 'resultsUpdatedSuccess');

        // Pessimistic Update
        queryClient.setQueryData(['SingleQuest'], (oldData) => {
          return resp.data?.data[0] || oldData;
        });

        queryClient.invalidateQueries({ queryKey: ['sharedLinkResultShared'], exact: true });
      }
    },
    onError: (error) => {
      console.log(error);
      // Show error message in a toast
      // toast.warning(error.response.data.message);
    },
  });

  return mutation;
};
