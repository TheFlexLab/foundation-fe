import { useEffect, useState } from 'react';
import { calculateRemainingTime, remainingTime } from '../../../../../utils';
// import { calculateRemainingTime, remainingTime } from '../../../../../utils';

const QuestTimeRemaining = ({ show, questStartData }) => {
  const [resultString, setResultString] = useState('');
  const [remainTime, setRemainTime] = useState('');

  const handleClick = () => {
    const result = calculateRemainingTime(
      questStartData?.updatedAt,
      questStartData?.startQuestData && questStartData?.startQuestData.data.length,
      questStartData.usersChangeTheirAns
    );

    setResultString(result);
  };

  const getTimeRemaining = () => {
    const time = remainingTime(
      questStartData?.updatedAt,
      questStartData?.startQuestData && questStartData?.startQuestData.data.length,
      questStartData.usersChangeTheirAns
    );

    setRemainTime(time);
  };

  useEffect(() => {
    handleClick();
    getTimeRemaining();
    getTimeRemaining();
  }, [questStartData?.updatedAt, questStartData.usersChangeTheirAns]);

  return (
    <div>
      {show ? (
        <div>
          {questStartData?.usersChangeTheirAns === '' ? (
            <h4 className="text-gray-1 cursor-pointer text-[7.5px] font-normal tablet:text-[16.58px] laptop:text-[1rem]">
              Your selection is final and cannot be changed.
            </h4>
          ) : (
            <h4
              className="text-gray-1 cursor-pointer text-[7.5px] font-normal tablet:text-[16.58px] laptop:text-[1rem]"
              // onClick={handleClick}
            >
              You can change your selection {questStartData.usersChangeTheirAns},
              {remainTime === 'you are good to go' ? ` ${remainTime}` : ` ${remainTime} remaining`}
            </h4>
          )}
        </div>
      ) : (
        <h4 className="text-gray-1 cursor-pointer text-[7.5px] font-normal tablet:text-[16.58px] laptop:text-[1rem]">
          &#x200B;
        </h4>
      )}
    </div>
  );
};

export default QuestTimeRemaining;
