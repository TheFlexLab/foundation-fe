import ProgressBar from '../ProgressBar';
import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';

const InfoPopup = ({
  isPopup,
  setIsPopup,
  title,
  logo,
  message,
  message2,
  message3,
  buttonText,
  handleSkip,
  onboarding,
  progress,
}) => {
  const handleClose = () => setIsPopup(false);
  return (
    <>
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
          <h1 className="summary-text mb-[10px] tablet:mb-5">{message}</h1>
          {message2 && <h1 className="summary-text">{message2}</h1>}
          {message3 && <h1 className="summary-text">{message3}</h1>}
        </div>
        {onboarding && <ProgressBar handleSkip={handleSkip} buttonText={buttonText} />}
      </PopUp>
    </>
  );
};

export default InfoPopup;
