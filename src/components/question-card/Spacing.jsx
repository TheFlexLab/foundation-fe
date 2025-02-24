import { useSelector } from 'react-redux';
import EmbedParticipate from '../../pages/Embed/EmbedParticipate';

function findIdByUuid(data, givenUuid) {
  // Find the object where the uuids array includes the given UUID
  const result = data?.find((item) => item.uuids?.includes(givenUuid));

  // Return the id if found, otherwise return null or handle it as needed
  return result ? result.id : null;
}

const Spacing = ({ questStartData, show, postProperties }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const renderQuestInfoText = () => {
    if (show) {
      return (
        <div className="relative">
          {questStartData?.startQuestData?.isFeedback &&
          // questStartData.startStatus !== 'continue' &&
          questStartData?.page !== 'advance-analytics' &&
          questStartData.startStatus !== 'change answer' ? (
            <div
              className={`text-gray-1 flex max-h-10 min-h-10 items-center justify-center text-center text-[7.5px] font-normal tablet:max-h-[74px] tablet:min-h-[74px] tablet:text-[1rem]`}
            >
              <h4 className="text-center text-[10px] font-semibold leading-[10px] text-red-500 dark:text-accent-300 tablet:text-[1rem] tablet:leading-[1rem]">
                {questStartData?.startStatus === 'completed' ? 'Participation is closed' : 'Feedback Given'}{' '}
                {questStartData?.isClosed
                  ? '- Historical / Past Event'
                  : `- ${findIdByUuid(questStartData.feedback, persistedUserInfo?.uuid)}`}
              </h4>
            </div>
          ) : (
            <h4
              className={`${questStartData.type === 'embed' || questStartData?.page === 'advance-analytics' ? 'max-h-[35px] min-h-[35px] tablet:max-h-[65px] tablet:min-h-[65px]' : 'max-h-[24.16px] min-h-[24.16px] tablet:max-h-[50px] tablet:min-h-[50px]'} text-gray-1 text-center text-[7.5px] font-normal tablet:text-[1rem]`}
            >
              &#x200B;
            </h4>
          )}

          {!questStartData.isClosed && questStartData.type === 'embed' && (
            <EmbedParticipate postProperties={postProperties} />
          )}
        </div>
      );
    } else {
      return (
        <div className="relative">
          {questStartData?.startQuestData?.isFeedback ? (
            <h4 className="conditional-text font-semibold text-red-500">Participation is closed</h4>
          ) : (
            <h4 className="text-gray-1 py-[5px] text-center text-[7.5px] font-normal tablet:py-[9px] tablet:text-[1rem]">
              &#x200B;
            </h4>
          )}
          {!questStartData.isClosed && questStartData.type === 'embed' && (
            <EmbedParticipate postProperties={postProperties} />
          )}
        </div>
      );
    }
  };

  return renderQuestInfoText();
};

export default Spacing;
