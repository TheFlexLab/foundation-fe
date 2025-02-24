import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getConstantsValues } from '../../../../features/constants/constantsSlice';
import { createDraftMessage, fetchOptionParticipants } from '../../../../services/api/directMessagingApi';
import SelectionOption from '../../../../components/SelectionOption';
import FilterAnalyzedOptions from '../../advance-analytics/components/FilterAnalyzedOptions';
import { resetDirectMessageForm, setDirectMessageForm } from '../../../../features/direct-message/directMessageSlice';
import { getQuestById } from '../../../../services/api/homepageApis';

export default function NewMessageForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const directMessageState = useSelector((state) => state.directMessage);
  const persistedConstants = useSelector(getConstantsValues);
  const sendAmount = persistedConstants?.MESSAGE_SENDING_AMOUNT ?? 0;
  const defaultReadReward = persistedConstants?.MINIMUM_READ_REWARD;

  const [participants, setParticipants] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const advanceAnalytics = searchParams.get('advance-analytics');
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));
  const urlParams = new URLSearchParams(window.location.search);
  const uniqueLink = urlParams.get('link');

  const handleHideModal = () => setShowModal(false);

  // =========== FETCH POST
  const { data: singlePost, isPending } = useQuery({
    queryFn: () => getQuestById(persistedUserInfo?.uuid, directMessageState.questForeignKey),
    queryKey: ['dmSinglePost', directMessageState.questForeignKey],
    enabled: !!directMessageState.questForeignKey,
  });

  const updatedQuestAnswers =
    !isPending &&
    singlePost?.data?.data[0]?.QuestAnswers.map((answer) => ({
      ...answer,
      selected: directMessageState.options.includes(answer.question),
    }));

  // =========== HANDLE PARTICIPANTS COUNT
  const { mutateAsync: fetchParticipants } = useMutation({
    mutationFn: fetchOptionParticipants,
    onSuccess: (resp) => {
      setParticipants(resp?.data.dynamicParticipantsCount);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message);
    },
  });

  useEffect(() => {
    if (directMessageState.to === 'Participants') {
      const params = {
        questForeignKey: directMessageState.questForeignKey,
        uuid: persistedUserInfo.uuid,
        options: directMessageState.options,
        sharedLinkOnly: uniqueLink ? uniqueLink : '',
      };

      fetchParticipants(params);
    }
  }, [directMessageState.options]);

  // =========== HANDLE DRAFTS
  const { mutateAsync: createDraft } = useMutation({
    mutationFn: createDraftMessage,
    onSuccess: () => {
      queryClient.invalidateQueries('messages');
      toast.success('Message saved to Draft');
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const handleDraft = () => {
    if (directMessageState.subject || directMessageState.message) {
      const params = {
        from: directMessageState?.messageContext && directMessageState?.messageContext === "ByDomain" ? persistedUserInfo?.uuid : persistedUserInfo.email,
        uuid: persistedUserInfo.uuid,
        platform: isPseudoBadge ? 'Foundation-IO.com' : 'Verified User',
        to: directMessageState.to,
        subject: directMessageState.subject,
        message: directMessageState.message,
        id: directMessageState.draftId,
      };

      if (directMessageState.to === 'Participants' || directMessageState.to === 'All') {
        params.readReward = directMessageState.readReward;
      }

      if (directMessageState.to !== 'Participants' && directMessageState.to !== 'All' && directMessageState.to !== 'List' && (!directMessageState.messageContext || directMessageState?.messageContext === "")) {
        params.readReward = directMessageState.readReward;
      }

      if (directMessageState.to === 'Participants') {
        params.questForeignKey = directMessageState.questForeignKey;
        params.options = directMessageState.options;
      }

      if (directMessageState?.messageContext) {
        params.messageContext = directMessageState?.messageContext;
        params.sendFdxAmount = directMessageState?.sendFdxAmount;
        params.domain = directMessageState?.domain;
      }

      createDraft(params);
      dispatch(resetDirectMessageForm());
      navigate('/direct-messaging/draft');
    } else {
      toast.warning('Subject and message cannot be empty');
    }
  };

  // =========== HANDLE PREVIEW
  const handlePreview = () => {
    if (directMessageState.messageContext !== 'ByDomain' && directMessageState.readReward < defaultReadReward) {
      toast.error(`Read Reward must be at least ${defaultReadReward}`);
      return;
    }

    if (directMessageState.subject === '' || directMessageState.message === '' || directMessageState.to === '') {
      toast.error(`Subject, message and to cannot be empty`);
      return;
    }

    if (uniqueLink && uniqueLink !== '') {
      navigate(`/direct-messaging/preview?link=${uniqueLink}`);
    } else {
      navigate('/direct-messaging/preview');
    }
  };

  function formatRecipient(to) {
    const trimmedTo = to?.trim().toLowerCase();

    if (trimmedTo === 'all') {
      return 'All';
    } else if (trimmedTo === 'list') {
      return 'Collection';
    } else if (trimmedTo) {
      return to;
    } else {
      return undefined;
    }
  }

  const handleNoOfUsers = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (directMessageState.to === 'Participants') {
      return participants;
    } else if (formatRecipient(directMessageState.to) === 'All') {
      return persistedUserInfo?.allCount;
    } else if (formatRecipient(directMessageState.to) === 'Collection') {
      return persistedUserInfo?.mailCount;
    } else if (emailRegex.test(directMessageState.to)) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <div className="space-y-[9px] tablet:space-y-[15px]">
      {showModal && (
        <FilterAnalyzedOptions
          handleClose={handleHideModal}
          modalVisible={showModal}
          title={'Message Participants'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={singlePost?.data?.data[0]}
          submitBtn="Update"
          optionsArr={updatedQuestAnswers}
          type={uniqueLink ? 'sharedResults' : 'all'}
        />
      )}
      {/* Selected Post */}
      {advanceAnalytics && (
        <div className="relative h-fit w-full max-w-[730px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:px-5 tablet:py-6">
          <div className="flex flex-col items-center justify-center gap-[15px]">
            <ul className="flex h-full max-h-[236px] w-full flex-col gap-[5.7px] overflow-y-scroll tablet:max-h-[472px] tablet:gap-[10px]">
              <h1 className="text-[10px] font-medium leading-[12px] text-gray-1 dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
                {singlePost?.data?.data[0]?.Question}
              </h1>
              {!isPending &&
                updatedQuestAnswers.length >= 1 &&
                updatedQuestAnswers?.map((post) => (
                  <SelectionOption
                    key={post.id}
                    data={post}
                    page="filterAnalyzedOptions"
                    questStartData={singlePost?.data?.data[0]}
                    type={uniqueLink ? 'sharedResults' : 'all'}
                  />
                ))}
            </ul>
          </div>
        </div>
      )}
      {/* You are sending 4 participants */}
      <div className="relative h-fit w-full max-w-[730px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:px-5 tablet:py-6">
        <div className="flex items-center justify-between">
          <p className="summary-text text-center">
            You are sending a message to{' '}
            {advanceAnalytics ? (
              <b>{participants}</b>
            ) : directMessageState.messageContext === 'ByDomain' ? (
              1
            ) : (
              <b>{handleNoOfUsers()}</b>
            )}{' '}
            total participants
          </p>
          {advanceAnalytics && (
            <p
              className="summary-text cursor-pointer text-blue-100 underline"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Edit
            </p>
          )}
        </div>
      </div>
      {/* Message Card */}
      <div className="relative h-fit w-full max-w-[730px] space-y-[9px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:mb-8 tablet:space-y-[15px] tablet:px-5 tablet:py-6">
        {directMessageState.to !== 'Participants' && directMessageState.messageContext !== 'ByDomain' && (
          <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
            <p className="text-[10px] font-semibold leading-[10px] text-gray dark:text-white tablet:text-[22px] tablet:leading-[22px]">
              To:
            </p>
            <input
              type="text"
              value={directMessageState.to}
              className="w-full bg-transparent pl-2 text-[10px] leading-[10px] text-gray-1 focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
              onChange={(e) => {
                const inputValue = e.target.value;
                dispatch(setDirectMessageForm({ to: inputValue }));
              }}
            />
          </div>
        )}
        {/* Subject */}
        <div className="flex items-center rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] text-[10px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3 tablet:text-[22px]">
          <p className="text-[10px] font-semibold leading-[10px] text-gray dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Subject:
          </p>
          <input
            type="text"
            value={directMessageState.subject}
            className="w-full bg-transparent px-2 text-[10px] leading-[10px] text-gray-1 focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 200) {
                dispatch(setDirectMessageForm({ subject: inputValue }));
              }
            }}
          />
          {directMessageState.subject?.length}/200
        </div>
        {/* Message */}
        <div className="flex rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] text-[10px] dark:border-[2.768px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:px-5 tablet:py-3 tablet:text-[22px]">
          <p className="text-[10px] font-semibold leading-[10px] text-gray dark:text-white tablet:text-[22px] tablet:leading-[22px]">
            Message:
          </p>
          <textarea
            type="text"
            rows="14"
            value={directMessageState.message}
            className="w-full bg-transparent px-2 text-[10px] leading-[10px] text-gray-1 focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (inputValue.length <= 500) {
                dispatch(setDirectMessageForm({ message: inputValue }));
              }
            }}
          />
          <div className="flex items-end">{directMessageState.message?.length}/500</div>
        </div>
        {directMessageState.messageContext !== 'ByDomain' && (
          <h1 className="px-2 py-[5.7px] text-[8.52px] font-normal italic leading-none text-gray dark:text-[#D3D3D3] tablet:px-[18px] tablet:py-3 tablet:text-[19px]">
            Enter the amount of FDX a participant will earn from reading your message. FDX will only be deducted from
            your balance if a message is read
          </h1>
        )}
        {/* Read Reward */}
        {directMessageState.messageContext !== 'ByDomain' && (
          <div
            className={`${directMessageState.to === 'All' || directMessageState.to === 'Participants' ? '' : 'opacity-50'} flex items-center rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] dark:border-gray-100 dark:bg-accent-100 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3`}
          >
            <p className="w-fit whitespace-nowrap text-[10px] font-semibold leading-[10px] text-gray dark:text-white tablet:text-[22px] tablet:leading-[22px]">
              Read Reward:
            </p>
            <input
              type="number"
              value={directMessageState.readReward}
              placeholder={defaultReadReward}
              className="w-fit bg-transparent pl-2 text-[10px] leading-[10px] text-gray-1 focus:outline-none dark:bg-accent-100 dark:text-white-400 tablet:text-[22px] tablet:leading-[22px]"
              onChange={(e) => {
                dispatch(setDirectMessageForm({ readReward: e.target.value }));
              }}
              disabled={directMessageState.to !== 'Participants' && directMessageState.to !== 'All'}
            />
          </div>
        )}
      </div>
      {/* Total FDX to send message*/}
      {directMessageState.messageContext !== 'ByDomain' && (<div className="relative flex h-fit w-full max-w-[730px] flex-col gap-1 rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:gap-2 tablet:px-5 tablet:py-6">
        <div className="flex justify-between rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] text-gray dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            Total FDX to send message
          </p>
          {directMessageState.messageContext === 'ByDomain' ? (
            <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
              {`1 participants =  ${`${directMessageState.sendFdxAmount} FDX`}`}
            </p>
          ) : (
            <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
              {`${handleNoOfUsers()} participants = ${directMessageState.to === 'Collection' ? `0 FDX` : `${(handleNoOfUsers() * sendAmount)?.toFixed(2)} FDX`}`}
            </p>
          )}
        </div>
        <div className="flex justify-between rounded-[3.817px] border border-[#DEE6F7] bg-[#FDFDFD] px-3 py-[6px] text-gray dark:border-gray-100 dark:bg-accent-100 dark:text-white-400 tablet:rounded-[9.228px] tablet:border-[2.768px] tablet:px-5 tablet:py-3">
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            Max FDX if all recipients read message
          </p>
          <p className="whitespace-nowrap text-[10px] font-semibold leading-[10px] tablet:text-[22px] tablet:leading-[22px]">
            {`${directMessageState.to === 'Collection' ? `0 FDX` : `${(handleNoOfUsers() * directMessageState.readReward)?.toFixed(2)} FDX`}`}
          </p>
        </div>
      </div>)}
      {/* Last Section Buttons */}
      <div className="flex h-fit w-full max-w-[730px] justify-between gap-4 tablet:mx-auto">
        <Button
          variant="cancel"
          onClick={() => {
            navigate('/direct-messaging');
          }}
        >
          Cancel
        </Button>
        <div className="flex gap-4">
          <Button
            variant={
              directMessageState.to !== '' && directMessageState.subject !== '' && directMessageState.message !== ''
                ? 'submit'
                : 'hollow-submit'
            }
            disabled={
              directMessageState.to !== '' && directMessageState.subject !== '' && directMessageState.message !== ''
                ? false
                : true
            }
            onClick={() => {
              handleDraft();
            }}
          >
            Save as draft
          </Button>
          <Button
            variant={
              directMessageState.to !== '' && directMessageState.subject !== '' && directMessageState.message !== ''
                ? 'submit'
                : 'hollow-submit'
            }
            disabled={
              directMessageState.to !== '' && directMessageState.subject !== '' && directMessageState.message !== ''
                ? false
                : true
            }
            onClick={handlePreview}
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
