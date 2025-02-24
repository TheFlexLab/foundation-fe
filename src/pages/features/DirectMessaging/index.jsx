import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MessageCard from './components/MessageCard';
import ViewMessage from './components/ViewMessage';
import {
  getDeletedMessages,
  getDraftdMessages,
  getRecievedMessages,
  getSentMessages,
  viewMessage,
} from '../../../services/api/directMessagingApi';
import { Button } from '../../../components/ui/Button';
import { resetDirectMessageForm } from '../../../features/direct-message/directMessageSlice';

export default function DirectMessaging() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));

  const [selectedTab, setSelectedTab] = useState('received');
  const [addNewMsg, setAddNewMsg] = useState(false);
  const [viewMsg, setViewMsg] = useState(false);
  const [viewMessageData, setViewMessageData] = useState();
  const [search, setSearch] = useState('');

  const { data: messages } = useQuery({
    queryFn: async () => {
      if (selectedTab === 'sent') {
        return await getSentMessages(persistedUserInfo.uuid);
      } else if (selectedTab === 'received') {
        return await getRecievedMessages(persistedUserInfo.uuid);
      } else if (selectedTab === 'deleted') {
        return await getDeletedMessages(persistedUserInfo.uuid);
      } else if (selectedTab === 'draft') {
        return await getDraftdMessages(persistedUserInfo.uuid);
      }
    },
    queryKey: ['messages', selectedTab],
  });

  const { mutateAsync: ViewAMessage } = useMutation({
    mutationFn: viewMessage,
    onSuccess: (resp) => {
      queryClient.invalidateQueries(['messages', selectedTab]);
      queryClient.invalidateQueries(['userInfo']);
      setViewMessageData(resp.data.data);
      setViewMsg(true);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(':')[1]);
    },
  });

  const handleViewMessage = (id, sender, receiver, item) => {
    if (item) {
      setAddNewMsg(false);
      setViewMessageData(item);
    }

    if (item.type !== 'sent') {
      const params = {
        id: id,
        sender: sender,
        receiver: receiver,
      };
      ViewAMessage(params);
    }
  };

  useEffect(() => {
    if (location.pathname === '/direct-messaging') {
      setSelectedTab('received');
      setViewMsg(false);
      setAddNewMsg(false);
    }
    if (location.pathname === '/direct-messaging/sent') {
      setSelectedTab('sent');
      setViewMsg(false);
      setAddNewMsg(false);
    }
    if (location.pathname === '/direct-messaging/deleted') {
      setSelectedTab('deleted');
      setViewMsg(false);
      setAddNewMsg(false);
    }
    if (location.pathname === '/direct-messaging/draft') {
      setSelectedTab('draft');
      setViewMsg(false);
      setAddNewMsg(false);
    }
    if (location.pathname === '/direct-messaging/new-message') {
      setViewMsg(false);
      setAddNewMsg(true);
    }
  }, [location.pathname]);

  return (
    <div className="mx-auto mb-[10px] rounded-[10px] border-[1.85px] border-gray-250 bg-white px-3 py-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:mb-[15px] tablet:max-w-[730px] tablet:px-5 tablet:py-[18.73px]">
      <div className={`${addNewMsg || viewMsg ? 'hidden' : 'block'}`}>
        {isPseudoBadge && (
          <div className="hidden justify-end pb-5 laptop:flex">
            <Button
              variant="addOption"
              onClick={() => {
                dispatch(resetDirectMessageForm());
                navigate('/direct-messaging/new-message');
              }}
            >
              + New Message
            </Button>
          </div>
        )}
        {location.pathname === '/direct-messaging' ? (
          <p className="summary-text mb-[10px]">
            Receive targeted messages from interested parties that found you through advanced analytics. Your identity
            remains anonymous, and no personal information is shared with the sender. Earn rewards for every message
            received and an additional reward for reading them, keeping you engaged with relevant offers and
            communications.
          </p>
        ) : location.pathname === '/direct-messaging/sent' ? (
          <p className="summary-text mb-[10px]">
            Messages you sent to individuals you identified through advanced analytics. Your outreach remains anonymous,
            ensuring personal information is protected while you reach relevant targets for your audience. Here, you can
            see metrics on your reach, including who read or deleted your messages.
          </p>
        ) : location.pathname === '/direct-messaging/deleted' ? (
          <p className="summary-text mb-[10px]">
            View the messages you’ve deleted. If you change your mind, you can easily undelete them to restore your
            communication.
          </p>
        ) : (
          location.pathname === '/direct-messaging/draft' && (
            <p className="summary-text mb-[10px]">
              Targeted messages you’ve created but haven’t sent yet. You can edit or finalize them before sharing with
              your audience.
            </p>
          )
        )}
        <div className="relative h-6 tablet:h-[42px]">
          <input
            type="text"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-[8px] border-[0.59px] border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white tablet:rounded-[10px] tablet:border-2 tablet:text-[18.23px]"
            value={search}
            placeholder=""
            onChange={(e) => setSearch(e.target.value)}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-gray-200 dark:text-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Search
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-2 tablet:gap-5">
          {messages?.data?.data.length <= 0 ? (
            <div className="flex h-[calc(100%-68px)] w-full items-center justify-center">
              <p className="text-[12px] font-semibold text-gray-1 tablet:text-[24px]">No messages yet!</p>
            </div>
          ) : (
            messages?.data?.data
              .filter(
                (data) =>
                  data.subject?.toLowerCase().includes(search?.toLowerCase()) ||
                  data.shortMessage?.toLowerCase().includes(search?.toLowerCase())
              )
              .map((item, index) => (
                <MessageCard
                  key={index}
                  item={item}
                  setViewMsg={setViewMsg}
                  filter={selectedTab}
                  setViewMessageData={setViewMessageData}
                />
              ))
          )}
        </div>
      </div>
      {viewMsg && (
        <ViewMessage
          setViewMsg={setViewMsg}
          viewMessageData={viewMessageData}
          filter={selectedTab}
          handleViewMessage={handleViewMessage}
        />
      )}
    </div>
  );
}
