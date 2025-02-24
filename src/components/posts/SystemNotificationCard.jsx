import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setGuestSignUpDialogue } from '../../features/extras/extrasSlice';

const SystemNotificationCard = ({ post, innerRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      className="flex flex-col gap-2 rounded-[13.842px] border-2 border-blue-500 bg-white-800 px-7 pb-[15px] pt-[14px] dark:border-gray-300 dark:bg-blue-400 tablet:gap-4 tablet:border-[3.5px] tablet:px-[44px] tablet:py-6"
      ref={innerRef}
    >
      <h1 className="text-[13px] font-bold leading-normal text-gray dark:text-gray-300 tablet:text-[22px]">
        {post.header}
      </h1>
      {post?.text?.map((item, index) => (
        <p
          key={index + 1}
          className="text-[13px] font-normal leading-normal text-gray-1 dark:text-gray-300 tablet:text-[18px] tablet:leading-[25px]"
        >
          {item}
        </p>
      ))}
      {post.buttonText && post.buttonUrl && (
        <div className="flex justify-end tablet:mt-2">
          <Button
            variant="hollow-submit"
            className="w-fit bg-white dark:bg-transparent"
            onClick={() => {
              if (post.buttonUrl === '/guest-signup' || post.buttonUrl === '/sign-up-modal') {
                dispatch(setGuestSignUpDialogue('Please create an account to unlock all features and claim your FDX.'));
              } else {
                navigate(post.buttonUrl);
              }
            }}
          >
            {post.buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemNotificationCard;
