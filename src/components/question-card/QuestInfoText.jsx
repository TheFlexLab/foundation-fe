import { useSelector } from 'react-redux';

const QuestInfoText = ({ questStartData, show, postProperties }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);

  const renderQuestInfoText = () => {
    if (show) {
      return (
        <>
          {questStartData.whichTypeQuestion === 'ranked choise' ? (
            <h4 className="conditional-text">Press and hold options to drag them into your preferred order</h4>
          ) : questStartData.whichTypeQuestion === 'multiple choise' ||
            questStartData.whichTypeQuestion === 'open choice' ? (
            questStartData.userCanSelectMultiple ? (
              <h4 className="conditional-text">
                You can select <strong>multiple</strong> options
              </h4>
            ) : (
              <h4 className="conditional-text">&#x200B;</h4>
              // <h4 className="conditional-text">
              //   You can select only <strong>one</strong> option
              // </h4>
            )
          ) : (
            <h4 className="conditional-text">&#x200B;</h4>
          )}
        </>
      );
    } else {
      return (
        <>
          {questStartData.whichTypeQuestion === 'ranked choise' ? (
            postProperties === 'SharedLinks' ? (
              <div className="my-2 ml-10 flex gap-1 tablet:my-5 tablet:ml-[86px] tablet:gap-20">
                <div className="flex items-center gap-[1px] tablet:gap-2">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                    alt="clicks"
                    className="h-2 w-2 tablet:h-6 tablet:w-6"
                  />
                  <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px]">
                    {questStartData.userQuestSetting.questImpression} Views{' '}
                  </h2>
                </div>
                <div className="flex items-center gap-[1px] tablet:gap-2">
                  <img
                    src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/group.svg' : 'assets/svgs/participants.svg'}`}
                    alt="participants"
                    className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
                  />
                  <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px]">
                    {questStartData.userQuestSetting.questsCompleted} Completed{' '}
                  </h2>
                </div>
              </div>
            ) : (
              <h4 className="conditional-text">
                &#x200B;
                {/* You can select only one option */}
              </h4>
            )
          ) : (
            <>
              {/* {postProperties === 'SharedLinks' ? (
                <div className="my-2 ml-10 flex gap-1 tablet:mb-[25px] tablet:ml-16 tablet:mt-[15px] tablet:gap-20">
                  <div className="flex items-center gap-[1px] tablet:gap-2">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                      alt="clicks"
                      className="h-2 w-2 tablet:h-6 tablet:w-6"
                    />
                    <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px] dark:text-white-400">
                      {questStartData.userQuestSetting.questImpression} Views{' '}
                    </h2>
                  </div>
                  <div className="flex items-center gap-[1px] tablet:gap-2">
                    <img
                      src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/group.svg' : 'assets/svgs/participants.svg'}`}
                      alt="participants"
                      className="h-2 w-3 tablet:h-[26px] tablet:w-[34px]"
                    />
                    <h2 className="text-[8px] font-semibold leading-[9.68px] text-[#707175] tablet:text-[18px] tablet:leading-[21.78px] dark:text-white-400">
                      {questStartData.userQuestSetting.questsCompleted} Completed{' '}
                    </h2>
                  </div>
                </div>
              ) : ( */}
              {/* )} */}
              <h4 className="conditional-text">
                &#x200B;
                {/* You can select only one option */}
              </h4>
            </>
          )}
        </>
      );
    }
  };

  return renderQuestInfoText();
};

export default QuestInfoText;
