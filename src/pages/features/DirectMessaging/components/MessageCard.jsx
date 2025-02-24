import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../../../../components/ui/Button';
import { calculateTimeAgo } from '../../../../utils/utils';
import api from '../../../../services/api/Axios';
import { setDirectMessageForm } from '../../../../features/direct-message/directMessageSlice';

export default function MessageCard({ setViewMsg, item, filter, setViewMessageData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [resloading, setResLoading] = useState(false);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const timeAgo = useMemo(() => calculateTimeAgo(item.createdAt), [item.createdAt]);

  const handleDelete = (id, type) => {
    api
      .delete(`/directMessage/delete`, {
        data: {
          _id: id,
          messageType: type,
        },
      })
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('Message deleted permanently');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setLoading(false);
      });
  };

  const handleTrash = (id, type) => {
    api
      .post(`/directMessage/trash`, {
        _id: id,
        messageType: type,
      })
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('Message deleted successfully');
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setLoading(false);
      });
  };

  const handleRestore = (id, type) => {
    api
      .post(`/directMessage/restore`, {
        _id: id,
        messageType: type,
      })
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('Message restored successfully');
        setResLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setResLoading(false);
      });
  };

  const handleCancelAllSendMessages = (uuid, id) => {
    api
      .get(`/directMessage/cancleMessage/${uuid}/${id}`)
      .then(() => {
        queryClient.invalidateQueries('messages');
        toast.success('All messages cancelled successfully');
        setResLoading(false);
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
        setResLoading(false);
      });
  };

  return (
    <div className="h-fit w-full rounded-[8px] border-[1.232px] border-[#D9D9D9] bg-white dark:border-gray-100 dark:bg-gray-200 tablet:mx-0 tablet:rounded-[15px] tablet:border-2">
      {/* header */}
      <div className="flex items-center justify-between rounded-t-[8px] bg-[#FFFCB8] px-3 py-[6px] dark:bg-accent-100 tablet:rounded-t-[15px] tablet:px-5 tablet:py-3">
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${item.platform === 'Foundation-IO.com' ? 'assets/svgs/F.svg' : 'assets/addOptions/blueBadge.svg'}`}
            alt="badge-logo"
            className="size-[12.325px] tablet:size-5"
          />
          {item.messageContext === 'DM' ? (
            <h1 className="max-w-44 truncate text-[12.325px] font-semibold leading-[12.325px] text-gray-1 dark:text-white tablet:max-w-72 tablet:text-[20px] tablet:leading-[20px]">
              {filter === 'sent' ? item.to : item.platform === 'Foundation-IO.com' ? 'Foundation' : 'Anonymous user'}
            </h1>
          ) : (
            <h1 className="max-w-44 truncate text-[12.325px] font-semibold leading-[12.325px] text-gray-1 dark:text-white tablet:max-w-72 tablet:text-[20px] tablet:leading-[20px]">
              {filter === 'sent'
                ? `${item.domain}.on.foundation`
                : item.platform === 'Foundation-IO.com'
                  ? 'Foundation'
                  : 'Anonymous user'}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-1">
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clock.svg' : 'assets/svgs/dashboard/clock-outline.svg'}`}
            alt="clock"
            className="h-[8.64px] w-[8.64px] tablet:h-[20.5px] tablet:w-[20.4px]"
          />
          <h2 className="whitespace-nowrap text-[13.071px] font-normal leading-[21.211px] text-gray-1 dark:text-white tablet:text-[21.211px] tablet:leading-[13.071px]">
            {timeAgo}
          </h2>
        </div>
      </div>
      {/* Body */}
      <div className="m-3 flex flex-col gap-3 tablet:m-5 tablet:gap-5">
        <h1 className="text-[12.145px] font-semibold leading-[12.145px] text-gray-1 dark:text-gray-300 tablet:text-[22px] tablet:leading-[22px]">
          Subject: {item.subject}
        </h1>
        <div className="flex justify-end gap-2">
          {item?.type === 'sent' && item?.to === 'Participants' && (
            <Button
              variant={'danger'}
              onClick={() => {
                handleCancelAllSendMessages(persistedUserInfo.uuid, item._id);
              }}
              disabled={loading}
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Cancel All'}
            </Button>
          )}
          {filter !== 'sent' && (
            <Button
              variant={'danger'}
              disabled={location.pathname === '/direct-messaging/preview'}
              onClick={() => {
                if (location.pathname === '/direct-messaging/preview') return;
                setLoading(true);
                filter === 'deleted' ? handleDelete(item._id, filter) : handleTrash(item._id, filter);
              }}
            >
              {loading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Delete'}
            </Button>
          )}
          {filter === 'deleted' ? (
            <Button
              variant={'submit'}
              onClick={() => {
                setResLoading(true);
                handleRestore(item._id, filter);
              }}
            >
              {resloading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Restore'}
            </Button>
          ) : filter === 'draft' ? (
            <Button
              variant={'submit'}
              onClick={() => {
                dispatch(
                  item.messageContext && item.messageContext === 'ByDomain'
                    ? setDirectMessageForm({
                        draftId: item._id,
                        to: item.domain ? item.domain : item.to,
                        subject: item.subject,
                        message: item.message,
                        options: item.options,
                        questForeignKey: item.questForeignKey,
                        readReward: item.readReward,
                        messageContext: item.messageContext,
                        sendFdxAmount: item.sendFdxAmount,
                        domain: item.domain,
                      })
                    : setDirectMessageForm({
                        draftId: item._id,
                        to: item.to,
                        subject: item.subject,
                        message: item.message,
                        options: item.options,
                        questForeignKey: item.questForeignKey,
                        readReward: item.readReward,
                      })
                );
                if (item.to === 'Participants') {
                  navigate('/direct-messaging/new-message?advance-analytics=true');
                } else {
                  navigate('/direct-messaging/new-message');
                }
              }}
            >
              {resloading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Open'}
            </Button>
          ) : (
            <Button
              variant={item?.viewed ? 'change' : 'submit'}
              disabled={location.pathname === '/direct-messaging/preview'}
              onClick={() => {
                if (location.pathname === '/direct-messaging/preview') {
                  return;
                } else {
                  setViewMessageData(item);
                  setViewMsg(true);
                }
              }}
            >
              {item?.viewed ? 'Read Again' : filter === 'sent' ? 'View' : 'Read'}{' '}
              {item.readReward != null && item.readReward >= 0 && !item?.viewed && filter !== 'sent' && (
                <span className="pl-[5px] text-[7px] font-semibold leading-[1px] tablet:pl-[10px] tablet:text-[13px]">
                  {`(+${item?.readReward} FDX)`}
                </span>
              )}
            </Button>
          )}
        </div>
        {filter === 'sent' && (
          <div className="flex items-center justify-between gap-[15px]">
            <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgSends.svg`}
                alt="msgSends"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-gray-1 dark:text-white tablet:text-[14.2px] tablet:leading-[14.2px]">
                {item.send
                  ? item.to === 'Participants' || item.to === 'All' || item.to === 'Collection'
                    ? `${item.receiversIds.length} Sent`
                    : '1 Sent'
                  : '0 Sent'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgViewd.svg`}
                alt="msgViewd"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-gray-1 dark:text-white tablet:text-[14.2px] tablet:leading-[14.2px]">
                {`${item.view} Read`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/directMessaging/msgNotViewed.svg`}
                alt="msgFails"
                className="h-[15.5px] w-[12.44px] tablet:size-[26.8px]"
              />
              <p className="text-[8.097px] font-normal leading-[8.097px] text-gray-1 dark:text-white tablet:text-[14.2px] tablet:leading-[14.2px]">
                {item?.deleteCount ? `${item?.deleteCount} Deleted` : '0 Deleted'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
