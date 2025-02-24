import { Button } from '../ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../ui/PopUp';
import { resetDirectMessageForm, setDirectMessageForm } from '../../features/direct-message/directMessageSlice';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SendMessageFromDomain = ({ profile, isPopup, setIsPopup, title, logo, fdx }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return (
    <PopUp
      open={isPopup}
      handleClose={() => setIsPopup(false)}
      title={title}
      logo={logo}
      customClasses={'overflow-y-auto'}
    >
      <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text">You have to pay {fdx} FDX to message this person.</h1>
        <div className="flex items-center justify-end gap-[15px] tablet:gap-[35px]">
          <Button
            variant="submit"
            onClick={() => {
              if (persistedUserInfo.balance >= fdx) {
                dispatch(resetDirectMessageForm());
                dispatch(
                  setDirectMessageForm({
                    to: profile?.domain?.name,
                    readReward: 0,
                    sendFdxAmount: fdx,
                    messageContext: 'ByDomain',
                  })
                );
                navigate('/direct-messaging/new-message');
              } else {
                toast.warning('You do not have enough balance to send this message.');
              }
            }}
          >
            Continue
          </Button>
          <Button variant="cancel" onClick={() => setIsPopup(false)}>
            Close
          </Button>
        </div>
      </div>
    </PopUp>
  );
};

export default SendMessageFromDomain;
