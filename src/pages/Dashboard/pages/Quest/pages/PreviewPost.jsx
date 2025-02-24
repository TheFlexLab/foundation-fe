import Topbar from '../../../components/Topbar';
import DashboardLayout from '../../../components/DashboardLayout';
import QuestionCardWithToggle from '../../QuestStartSection/components/QuestionCardWithToggle';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getConstantsValues } from '../../../../../features/constants/constantsSlice';
import { hardcodedValues } from '../../../../../constants/dummyPost';
import { createInfoQuest } from '../../../../../services/api/questsApi';
import { addAdultFilterPopup, addPlayerId } from '../../../../../features/quest/utilsSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as filtersActions from '../../../../../features/sidebar/filtersSlice';
import * as createQuestAction from '../../../../../features/createQuest/createQuestSlice';
import * as pictureMediaAction from '../../../../../features/createQuest/pictureMediaSlice';
import { FaSpinner } from 'react-icons/fa';
import Breadcrumb from '../../../../../components/Breadcrumb';
import SystemNotificationCard from '../../../../../components/posts/SystemNotificationCard';
import { dyk } from '../../../../../constants/dyk';
import showToast from '../../../../../components/ui/Toast';

export default function PreviewPost() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedConstants = useSelector(getConstantsValues);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const filterStates = useSelector(filtersActions.getFilters);

  const post = {
    ...hardcodedValues,
    ...state.state,
    createdAt: new Date().getTime(),
  };

  const { mutateAsync: createQuest, isPending } = useMutation({
    mutationFn: createInfoQuest,
    onSuccess: (resp) => {
      if (resp.status === 201) {
        if (filterStates?.moderationRatingFilter?.initial === 0 && filterStates?.moderationRatingFilter?.final === 0) {
          dispatch(addAdultFilterPopup({ rating: resp.data.moderationRatingCount }));
          dispatch(addPlayerId(resp.data.questID));
        }
        navigate('/');
        queryClient.invalidateQueries(['userInfo']);

        dispatch(createQuestAction.resetCreateQuest());
        dispatch(pictureMediaAction.resetToInitialState());
      }

      queryClient.invalidateQueries('FeedData');
      queryClient.invalidateQueries('treasury');
    },
    onError: (err) => {
      if (err.response) {
        showToast('error', 'error', {}, err.response.data.message.split(':')[1]);
      }
    },
  });

  return (
    <>
      <Topbar />
      <div className="w-full bg-[#F2F3F5] dark:bg-black">
        <DashboardLayout>
          <Breadcrumb />
          <div className="mx-auto flex h-[calc(100dvh-134px)] w-full max-w-[1440px] tablet:h-[calc(100vh-96px)] laptop:mx-[331px] laptop:h-[calc(100vh-70px)] laptop:px-4 desktop:mx-auto desktop:px-0">
            <div className="w-full overflow-y-auto py-2 no-scrollbar tablet:px-6 tablet:py-5 laptop:px-0">
              {persistedUserInfo?.notificationSettings?.systemNotifications ? (
                <div className="mx-auto mb-4 max-w-[730px] px-4 tablet:px-0">
                  <SystemNotificationCard post={dyk[0]} />
                </div>
              ) : null}
              <div className="relative mx-auto max-w-[730px] px-4 tablet:px-0">
                <div
                  className="absolute left-0 top-0 z-20 size-full cursor-default"
                  onClick={() => showToast('warning', 'youAreViewingPreview')}
                />
                <QuestionCardWithToggle questStartData={post} />
                {state.state.moderationRatingCount !== 0 && (
                  <p className="pb-3 pt-5 text-[12px] italic text-gray-1 dark:text-accent-300 tablet:pb-5 tablet:pt-8 tablet:text-[24px] tablet:leading-[30px]">
                    Your post will show under the Adult content category. You can try rephrasing to make the post show
                    to everyone, or continue as-is.
                  </p>
                )}
              </div>
              <div className="mx-auto my-6 flex w-full max-w-[730px] justify-between gap-4 px-8 tablet:my-10 tablet:px-10">
                <Button
                  variant="cancel"
                  className="w-full max-w-full tablet:w-full laptop:w-full"
                  onClick={() => {
                    navigate(state.path);
                  }}
                >
                  Continue Editing
                </Button>
                <Button
                  variant={'submit'}
                  className={'!laptop:px-0 w-full whitespace-nowrap !px-0'}
                  onClick={() => createQuest(state.state)}
                  disabled={isPending}
                >
                  {isPending === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Create'}
                  <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                    (+{persistedConstants?.QUEST_CREATED_AMOUNT} FDX)
                  </span>
                </Button>
              </div>
              {persistedUserInfo?.notificationSettings?.systemNotifications ? (
                <div className="mx-auto mb-4 max-w-[730px] px-4 tablet:px-0">
                  <SystemNotificationCard post={dyk[1]} />
                </div>
              ) : null}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
