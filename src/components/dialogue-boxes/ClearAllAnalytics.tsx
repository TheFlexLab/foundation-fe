import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useDeleteAllAnalyzeMutation } from '../../services/mutations/advance-analytics';

type ClearAllAnalyticsProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  id: string;
};

export default function ClearAllAnalytics({ handleClose, modalVisible, title, image, id }: ClearAllAnalyticsProps) {
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handleClearAllAnalytics, isPending } = useDeleteAllAnalyzeMutation({ handleClose });

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      autoSize={false}
      closeIcon={null}
      customClasses={''}
      customStyle={''}
      remove={false}
      isBackground={false}
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          Are you sure you want to delete all analytics for this post?
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button
            variant={'submit'}
            disabled={isPending}
            onClick={() => {
              handleClearAllAnalytics({
                userUuid: persistedUserInfo.uuid,
                questForeignKey: id,
              } as any);
            }}
          >
            {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Yes'}
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
