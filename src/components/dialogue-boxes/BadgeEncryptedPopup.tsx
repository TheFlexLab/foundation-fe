import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';
import showToast from '../ui/Toast';

type ClearAllAnalyticsProps = {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  singleBadgeData: any;
};

export default function BadgeEncryptedPopup(props: ClearAllAnalyticsProps) {
  const { handleClose, modalVisible, title, image, singleBadgeData } = props;

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
        <h1 className="summary-text">This badge is private.</h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'cancel'} onClick={handleClose}>
            Close
          </Button>
          <Button
            variant={'submit-hollow'}
            onClick={() => {
              showToast('warning', 'featureComingSoon');
            }}
          >
            Request{' '}
            <span className="pl-1 text-[7px] font-semibold leading-[1px] tablet:pl-[5px] tablet:text-[13px]">
              (+10 FDX)
            </span>
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
