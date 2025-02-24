import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';

export default function ShowAdultDisabledPopup({ handleClose, modalVisible, title, image }) {
  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="text-gray-1 text-[10px] font-medium leading-[12px] dark:text-gray-300 tablet:text-[20px] tablet:leading-[24.2px]">
          This post has been marked as adult content. You do not currently have adult posts enabled in your filter
          settings. You will not be able to see this post in your feed.
        </h1>
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleClose}>
            Ok
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
