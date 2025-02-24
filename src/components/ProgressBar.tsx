import { useEffect } from 'react';
import { Button } from './ui/Button';
import { useSelector } from 'react-redux';

interface ProgressBarProps {
  handleSkip: () => void;
  buttonText: any;
}

export default function ProgressBar({ handleSkip, buttonText }: ProgressBarProps) {
  const progressValue = useSelector((state: any) => state.progress.progressValue);

  return (
    <div className="px-5 tablet:px-[60px] laptop:px-[80px]">
      <div className="w-full rounded-md bg-white-400">
        <div
          className="h-[6px] rounded-md bg-[#4caf50] tablet:h-[10px]"
          style={{
            width: `${progressValue}%`,
          }}
        ></div>
      </div>
      <p className="summary-text">{`Progress: ${Math.floor(progressValue)}%`}</p>
      {handleSkip && (
        <div className="flex flex-col items-center pb-[15px] tablet:pb-[25px]">
          <Button variant="submit" onClick={() => handleSkip()}>
            {buttonText ? buttonText : 'Skip'}
          </Button>
        </div>
      )}
    </div>
  );
}
