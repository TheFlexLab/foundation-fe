import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessage, fetchOptionParticipants } from '../../../services/api/directMessagingApi';
import MessageCard from './components/MessageCard';
import ViewMessage from './components/ViewMessage';
import { getConstantsValues } from '../../../features/constants/constantsSlice';
import { useEffect, useState } from 'react';

export default function DMPreview() {
  const currentDate = new Date();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const directMessageState = useSelector((state: any) => state.directMessage);
  const persistedConstants = useSelector(getConstantsValues);
  const sendAmount = persistedConstants?.MESSAGE_SENDING_AMOUNT ?? 0;
  const [participants, setParticipants] = useState(0);
  const urlParams = new URLSearchParams(window.location.search);
  const uniqueLink = urlParams.get('link');

  const selectedOptions = directMessageState.options
    .filter((option: any) => option.selected)
    .map((option: any) => option.question);

  const filterOutOptions = () => {
    return directMessageState.questStartData?.QuestAnswers.filter((answer: any) =>
      directMessageState.options.includes(answer.question)
    );
  };

  const { mutateAsync: createNewMessage, isPending } = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] });
      toast.success('Message sent');
      navigate('/direct-messaging');
    },
    onError: (err: any) => {
      console.log(err);
      toast.error(err?.response.data.message);
    },
  });

  const handleNoOfUsers = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (directMessageState.to === 'Participants') {
      return participants;
    } else if (directMessageState.to === 'All') {
      return persistedUserInfo?.allCount;
    } else if (directMessageState.to === 'Collection') {
      return persistedUserInfo?.mailCount;
    } else if (emailRegex.test(directMessageState.to)) {
      return 1;
    } else {
      return 0;
    }
  };

  const updateOptionSelected = () => {
    return directMessageState.options.map((option: any) => ({
      ...option,
      selected: directMessageState.options.includes(option.question) ? true : false,
    }));
  };

  // =========== HANDLE PARTICIPANTS COUNT
  const { mutateAsync: fetchParticipants } = useMutation({
    mutationFn: fetchOptionParticipants,
    onSuccess: (resp) => {
      setParticipants(resp?.data.dynamicParticipantsCount);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message);
    },
  });

  useEffect(() => {
    if (directMessageState.to === 'Participants') {
      const params = {
        questForeignKey: directMessageState.questForeignKey,
        uuid: persistedUserInfo.uuid,
        options: selectedOptions?.filter((option: any) => option.selected).map((option: any) => option.question),
      };

      fetchParticipants(params);
    }
  }, [directMessageState.options]);

  return (
    <div className="space-y-[9px] tablet:space-y-4">
      <div className="relative h-fit w-full max-w-[730px] space-y-[9px] rounded-[15px] border-2 border-[#D9D9D9] bg-white px-[11px] py-[15px] dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:mx-auto tablet:space-y-[15px] tablet:px-5 tablet:py-6">
        <h1 className="pb-2 text-center text-[0.75rem] font-semibold leading-[15px] text-gray-1 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          Preview
        </h1>
        <h1 className="text-[0.75rem] font-semibold leading-[15px] text-gray-1 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          How your message will appear in user Inboxes
        </h1>
        <MessageCard
          filter="receive"
          item={{
            createdAt: currentDate.toISOString(),
            platform: directMessageState.to === 'All' ? 'Foundation-IO.com' : 'Anonymous user',
            subject: directMessageState.subject,
            viewed: false,
            readReward: directMessageState?.readReward,
          }}
          key={1}
          setViewMsg={null}
          setViewMessageData={null}
        />
        <h1 className="text-[0.75rem] font-semibold leading-[15px] text-gray-1 dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[23px]">
          How your message will appear when a user opens it.
        </h1>

        <ViewMessage
          viewMessageData={{
            message: directMessageState?.message,
            subject: directMessageState?.subject,
            postQuestion: directMessageState.questStartData?.Question,
            readReward: directMessageState?.readReward,
            createdAt: currentDate.toISOString(),
            platform: directMessageState.to === 'All' ? 'Foundation-IO.com' : 'Anonymous user',
            sharedLinkOnly: uniqueLink ? uniqueLink : '',
          }}
          filter="receive"
          questStartData={{ ...directMessageState.questStartData, questAnswers: filterOutOptions() }}
          page="preview"
          handleViewMessage={() => {}}
        />
      </div>
      <div className="flex h-fit w-full max-w-[730px] justify-end gap-4 tablet:mx-auto">
        <Button
          variant="cancel"
          className="w-fit whitespace-nowrap px-2"
          onClick={() => {
            if (updateOptionSelected().length >= 1) {
              navigate('/direct-messaging/new-message?advance-analytics=true');
            } else {
              navigate('/direct-messaging/new-message');
            }
          }}
        >
          Continue editing
        </Button>
        <Button
          variant={'submit'}
          onClick={() => {
            if (directMessageState.messageContext && directMessageState.messageContext === 'ByDomain') {
              createNewMessage({
                ...directMessageState,
                from: persistedUserInfo.uuid,
                uuid: persistedUserInfo.uuid,
                options: directMessageState.options,
                questForeignKey: directMessageState.questForeignKey,
                platform: directMessageState.to === 'All' ? 'Foundation-IO.com' : 'Verified User',
                type: 'new',
                sharedLinkOnly: uniqueLink ? uniqueLink : '',
                messageContext: directMessageState.messageContext,
                sendFdxAmount: directMessageState.sendFdxAmount,
              });
            } else {
              createNewMessage({
                ...directMessageState,
                from: persistedUserInfo.email,
                uuid: persistedUserInfo.uuid,
                options: directMessageState.options,
                questForeignKey: directMessageState.questForeignKey,
                platform: directMessageState.to === 'All' ? 'Foundation-IO.com' : 'Verified User',
                type: 'new',
                sharedLinkOnly: uniqueLink ? uniqueLink : '',
              });
            }
          }}
        >
          {isPending === true ? (
            <FaSpinner className="animate-spin text-[#EAEAEA]" />
          ) : (
            <>
              Send
              <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                {directMessageState.to === 'Collection'
                  ? `+0 FDX`
                  : directMessageState.messageContext === 'ByDomain'
                    ? `+${directMessageState.sendFdxAmount} FDX`
                    : `+${(handleNoOfUsers() * sendAmount)?.toFixed(2)} FDX`}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
