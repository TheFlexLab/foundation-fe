import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { resetaddOptionLimit } from '../../features/quest/utilsSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStartQuest, undoFeedback, updateChangeAnsStartQuest } from '../api/questsApi';
import { changeListResponse, submitListResponse, updateCategoryParticipentsCount } from '../api/listsApi';
import showToast from '../../components/ui/Toast';

export const useStartGuestListPost = (setLoading) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: startGuestListPost } = useMutation({
    mutationFn: submitListResponse,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        queryClient.invalidateQueries({ queryKey: ['postsByCategory'] }, { exact: true });
        // queryClient.invalidateQueries(['userInfo']);
        // queryClient.setQueriesData(['postsByCategory'], (oldData) => {
        //   if (!oldData || !oldData.post) {
        //     return oldData;
        //   }

        //   return {
        //     ...oldData,
        //     post: oldData.post.map((item) =>
        //       item._id === resp.data.category.post._id ? resp.data.category.post : item
        //     ),
        //   };
        // });

        setLoading(false);

        if (location.pathname.startsWith('/l/')) {
          updateCategoryParticipentsCount({ categoryLink: location.pathname.split('/')[2] });
        }
      }
    },
    onError: (err) => {
      console.log({ err });
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  return { startGuestListPost };
};

export const useChangeGuestListPost = (setLoading) => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const { mutateAsync: changeGuestListPost } = useMutation({
    mutationFn: changeListResponse,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        queryClient.invalidateQueries({ queryKey: ['postsByCategory'] }, { exact: true });
        // queryClient.invalidateQueries(['userInfo']);
        // queryClient.setQueriesData(['postsByCategory'], (oldData) => {
        //   if (!oldData || !oldData.post) {
        //     return oldData;
        //   }

        //   return {
        //     ...oldData,
        //     post: oldData.post.map((item) =>
        //       item._id === resp.data.category.post._id ? resp.data.category.post : item
        //     ),
        //   };
        // });

        setLoading(false);
      }
    },
    onError: (err) => {
      console.log({ err });
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);
    },
  });

  return { changeGuestListPost };
};

export const useStartPost = (setLoading, setSubmitResponse, handleViewResults, questStartData) => {
  let { id } = useParams();
  const postId = id?.split('=')[1];
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutateAsync: startPost } = useMutation({
    mutationFn: createStartQuest,
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
      queryClient.invalidateQueries({ queryKey: ['postsByCategory'] }, { exact: true });

      if (location.pathname.startsWith('/seldon-ai')) {
        queryClient.setQueryData(['sourcePosts'], (oldData) => {
          return oldData.map((item) => (item._id === resp.data.data._id ? resp.data.data : item));
        });
      }

      if (location.pathname.startsWith('/r')) {
        queryClient.invalidateQueries(['sourcePosts']);
      }

      if (location.pathname === '/') {
        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) =>
            page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item))
          ),
        }));
      }

      if (resp.data.message === 'Start Quest Created Successfully') {
        setLoading(false);

        if (location.pathname.startsWith('/p/')) {
          if (postId === undefined) {
            queryClient.setQueryData(['questByShareLink'], (oldData) => {
              const newData = resp.data.data;

              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  data: [newData],
                },
              };
            });
          } else {
            queryClient.setQueryData(['singlePostById'], (oldData) => {
              const newData = resp.data.data;

              if (Array.isArray(oldData) && oldData.length > 0) {
                return [newData, ...oldData.slice(1)];
              }

              return [newData];
            });
          }
        }
      }

      if (location.pathname.startsWith('/post/')) {
        setSubmitResponse(resp.data.data);
      }

      if (!location.pathname.startsWith('/p/' || !location.pathname.startsWith('/l'))) {
        handleViewResults(questStartData._id);
      }

      if (location.pathname.startsWith('/l/')) {
        updateCategoryParticipentsCount({ categoryLink: location.pathname.split('/')[2] });
      }

      if (
        location.pathname === '/profile' ||
        location.pathname.startsWith('/h/') ||
        location.pathname === '/profile/shared-links'
      ) {
        // queryClient.setQueryData(['my-profile', domain], (oldData) => {
        //   const updatedSpotLight =
        //     oldData.spotLight?.spotLightType === 'posts' && oldData.spotLight._id === resp.data.data._id
        //       ? { ...oldData.spotLight, ...resp.data.data }
        //       : oldData.spotLight;

        //   const updatedPosts = {
        //     ...oldData.posts,
        //     data: oldData?.posts?.data?.map((post) =>
        //       post._id === resp.data.data._id ? { ...post, ...resp.data.data } : post
        //     ),
        //   };

        //   return {
        //     ...oldData,
        //     spotLight: updatedSpotLight,
        //     posts: updatedPosts,
        //   };
        // });
        queryClient.setQueryData(['sharedLink', ''], (oldData) => {
          return {
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item))
            ),
          };
        });
      }

      dispatch(resetaddOptionLimit());
    },
    onError: (err) => {
      console.log(err);
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      if (err.response.data.message === 'Sorry, this post has been deleted by the user who created it.') {
        queryClient.setQueriesData(['posts'], (oldData) => ({
          ...oldData,
          pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== err.response.data._id)),
        }));
        queryClient.setQueriesData({ queryKey: ['questByShareLink'] }, (oldData) => {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.filter((item) => item._id !== err.response.data._id),
            },
          };
        });
      }
      setLoading(false);
      dispatch(resetaddOptionLimit());
    },
  });

  return { startPost };
};

export const useChangePost = (setLoading, setSubmitResponse, handleViewResults, questStartData) => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  let { id } = useParams();
  const postId = id?.split('=')[1];

  const { mutateAsync: changePost } = useMutation({
    mutationFn: updateChangeAnsStartQuest,
    onSuccess: (resp) => {
      queryClient.invalidateQueries({ queryKey: ['postsByCategory'] }, { exact: true });
      if (resp.data.message === 'Answer has not changed') {
        setLoading(false);
        showToast('warning', 'selectedSameOptions');
      }
      if (resp.data.message === 'You can change your answer once every 1 hour') {
        showToast('warning', 'changeOptionTimePeriod');
        setLoading(false);
      }
      if (resp.data.message === 'Start Quest Updated Successfully') {
        queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
        setLoading(false);
        handleViewResults(questStartData._id);

        if (location.pathname.startsWith('/post/')) {
          setSubmitResponse(resp.data.data);
        }

        if (location.pathname.startsWith('/seldon-ai')) {
          queryClient.setQueryData(['sourcePosts'], (oldData) => {
            return oldData.map((item) => (item._id === resp.data.data._id ? resp.data.data : item));
          });
        }

        if (location.pathname === '/') {
          queryClient.setQueriesData(['posts'], (oldData) => ({
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item))
            ),
          }));
        }

        if (
          location.pathname === '/profile' ||
          location.pathname.startsWith('/h/') ||
          location.pathname === '/profile/shared-links'
        ) {
          // queryClient.setQueryData(['my-profile', domain], (oldData) => {
          //   const updatedSpotLight =
          //     oldData.spotLight?.spotLightType === 'posts' && oldData.spotLight._id === resp.data.data._id
          //       ? { ...oldData.spotLight, ...resp.data.data }
          //       : oldData.spotLight;

          //   const updatedPosts = {
          //     ...oldData.posts,
          //     data: oldData?.posts?.data?.map((post) =>
          //       post._id === resp.data.data._id ? { ...post, ...resp.data.data } : post
          //     ),
          //   };

          //   return {
          //     ...oldData,
          //     spotLight: updatedSpotLight,
          //     posts: updatedPosts,
          //   };
          // });
          queryClient.setQueryData(['sharedLink', ''], (oldData) => {
            return {
              ...oldData,
              pages: oldData?.pages?.map((page) =>
                page.map((item) => (item._id === resp.data.data._id ? resp.data.data : item))
              ),
            };
          });
        }

        if (location.pathname.startsWith('/p/')) {
          if (postId === undefined) {
            queryClient.setQueryData(['questByShareLink'], (oldData) => {
              const newData = resp.data.data;

              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  data: [newData],
                },
              };
            });
          } else {
            queryClient.setQueryData(['singlePostById'], (oldData) => {
              const newData = resp.data.data;

              if (Array.isArray(oldData) && oldData.length > 0) {
                return [newData, ...oldData.slice(1)];
              }

              return [newData];
            });
          }
        }
      }
      dispatch(resetaddOptionLimit());
    },
    onError: (err) => {
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      setLoading(false);
      dispatch(resetaddOptionLimit());
    },
  });

  return { changePost };
};

export const useUndoFeedBackMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: useUndoFeedback, isPending: isUndoFeedbackPending } = useMutation({
    mutationFn: undoFeedback,
    onSuccess: (resp) => {
      if (resp.status === 200) {
        if (
          resp.data.message === 'Feedback Reverted Successfully!' &&
          location.pathname.includes('/profile/feedback-given')
        ) {
          queryClient.setQueriesData(['posts'], (oldData) => ({
            ...oldData,
            pages: oldData?.pages?.map((page) => page.filter((item) => item._id !== resp.data.data[0]._id)),
          }));
        } else if (location.pathname === '/') {
          queryClient.setQueriesData(['posts'], (oldData) => ({
            ...oldData,
            pages: oldData?.pages?.map((page) =>
              page.map((item) => (item._id === resp.data.data[0]._id ? resp.data.data[0] : item))
            ),
          }));
        } else if (location.pathname.startsWith('/l')) {
          queryClient.setQueriesData(['postsByCategory'], (oldData) => {
            if (!oldData || !oldData.post) return oldData;

            const updatedData = oldData.post.map((item) => {
              if (item?.questForeginKey && item.questForeginKey?._id === resp.data.data[0]._id) {
                return { ...item, questForeginKey: resp.data.data[0] };
              }
              return item;
            });

            return {
              ...oldData,
              post: updatedData,
            };
          });
        } else if (location.pathname.startsWith('/r')) {
          queryClient.setQueriesData(['sourcePosts'], (oldData) => {
            if (!oldData || !oldData.length > 0) return oldData;

            const updatedData = oldData?.map((item) => {
              if (item?._id === resp.data.data[0]._id) {
                return resp.data.data[0];
              }
              return item;
            });

            return updatedData;
          });
        } else {
          queryClient.setQueryData(['questByShareLink'], (oldData) => {
            if (!oldData || !oldData.data || !oldData.data.data) return oldData;

            const updatedData = oldData.data.data.map((item) => {
              if (item._id === resp.data.data[0]._id) {
                return { ...item, ...resp.data.data[0] };
              }
              return item;
            });

            return {
              ...oldData,
              data: {
                ...oldData.data,
                data: updatedData,
              },
            };
          });
        }
      }
    },
    onError: (err) => {
      console.log({ err });
      showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
    },
  });

  return { useUndoFeedback, isUndoFeedbackPending };
};
