import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getSeeMoreOptions } from '../../../../../features/quest/seeMoreOptionsSlice';
import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import SeeMoreOptions from '../../../../../components/see-more-options';
import RankedResult from '../../../components/RankedResult';
import ResultSortIcons from './ResultSortIcons';

const Result = (props) => {
  const showOptions = useSelector(getSeeMoreOptions);
  const { isFullScreen } = useParams();

  function findSelectionContentionCheck(array, labelToFind) {
    const foundObject = array?.find((obj) => obj.question === labelToFind);
    return !!foundObject;
  }

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${props.cardSize}px` }}>
      {props.questStartData?.whichTypeQuestion === 'yes/no' ||
      props.questStartData?.whichTypeQuestion === 'like/dislike' ||
      props.questStartData?.whichTypeQuestion === 'agree/disagree' ? (
        <div
          className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]"
          style={{ minHeight: `${props.cardSize}px` }}
        >
          <ResultSortIcons
            questStartData={props.questStartData}
            handleSortIconClick={props.handleSortIconClick}
            selectedOption={props.selectedOption}
            isEmbedResults={props.isEmbedResults}
            postProperties={props.postProperties}
          />
          {props.sortedAnswers?.map((item) => (
            <SingleAnswer
              key={item._id}
              answer={item.question}
              percentage={
                props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                  ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1][
                      item.question
                    ]
                  : null
              }
              check={findSelectionContentionCheck(
                props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                  ? [
                      {
                        question:
                          props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                            .selected,
                      },
                    ]
                  : [],
                item.question
              )}
              ownerCheck={findSelectionContentionCheck(
                props.questStartData?.startQuestDataOwner && props.questStartData.startQuestDataOwner.data.length > 0
                  ? [
                      {
                        question:
                          props.questStartData?.startQuestDataOwner.data[
                            props.questStartData.startQuestDataOwner.data.length - 1
                          ].selected,
                      },
                    ]
                  : [],
                item.question
              )}
              handleToggleCheck={props.handleToggleCheck}
              btnText={'Results'}
              questStartData={props.questStartData}
              postProperties={props.postProperties}
              isEmbedResults={props.isEmbedResults}
              profilePicture={props.profilePicture}
            />
          ))}
        </div>
      ) : props.questStartData?.whichTypeQuestion === 'multiple choise' ||
        props.questStartData?.whichTypeQuestion === 'open choice' ? (
        <div className="relative">
          <ResultSortIcons
            questStartData={props.questStartData}
            handleSortIconClick={props.handleSortIconClick}
            selectedOption={props.selectedOption}
            contendedOption={props.contendedOption}
            isEmbedResults={props.isEmbedResults}
            postProperties={props.postProperties}
          />
          <div
            className={`relative flex flex-col gap-[5.7px] tablet:gap-[10px] ${props.questStartData.type === 'embed' && props.sortedAnswers?.length >= 10 ? 'h-[284px] overflow-scroll no-scrollbar tablet:h-[580px]' : ''}`}
          >
            {props.sortedAnswers
              ?.slice(
                0,
                showOptions.isShow && showOptions.id === props.questStartData._id
                  ? props.sortedAnswers.length
                  : isFullScreen || location.pathname.startsWith('/p')
                    ? props.sortedAnswers.length
                    : 10
              )
              .map((item, index) => (
                <SingleAnswerMultipleChoice
                  key={index + 1}
                  questStartData={props.questStartData}
                  number={'#' + (index + 1)}
                  answer={item.question}
                  addedAnswerUuid={item.uuid}
                  title={props.questStartData?.whichTypeQuestion}
                  checkInfo={true}
                  selectedPercentages={
                    props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                      ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1]
                      : null
                  }
                  contendPercentages={
                    props.questStartData?.contendedPercentage && props.questStartData.contendedPercentage.length > 0
                      ? props.questStartData.contendedPercentage[props.questStartData.contendedPercentage.length - 1]
                      : null
                  }
                  check={findSelectionContentionCheck(
                    props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                      ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                          .selected
                      : [],
                    item.question
                  )}
                  contend={findSelectionContentionCheck(
                    props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                      ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                          .contended
                      : [],
                    item.question
                  )}
                  ownerCheck={findSelectionContentionCheck(
                    props.questStartData?.startQuestDataOwner &&
                      props.questStartData.startQuestDataOwner.data.length > 0
                      ? props.questStartData?.startQuestDataOwner.data[
                          props.questStartData.startQuestDataOwner.data.length - 1
                        ].selected
                      : [],
                    item.question
                  )}
                  ownerContend={findSelectionContentionCheck(
                    props.questStartData?.startQuestDataOwner &&
                      props.questStartData.startQuestDataOwner.data.length > 0
                      ? props.questStartData?.startQuestDataOwner.data[
                          props.questStartData.startQuestDataOwner.data.length - 1
                        ].contended
                      : [],
                    item.question
                  )}
                  btnText={'Results'}
                  answersSelection={props.answersSelection}
                  setAnswerSelection={props.setAnswerSelection}
                  postProperties={props.postProperties}
                  isEmbedResults={props.isEmbedResults}
                  profilePicture={props.profilePicture}
                />
              ))}
            {showOptions.id !== props.questStartData._id &&
              props.sortedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={props.questStartData._id} />}
          </div>
        </div>
      ) : props.questStartData?.whichTypeQuestion === 'ranked choise' ? (
        <div className="relative">
          <ResultSortIcons
            questStartData={props.questStartData}
            handleSortIconClick={props.handleSortIconClick}
            selectedOption={props.selectedOption}
            contendedOption={props.contendedOption}
            isEmbedResults={props.isEmbedResults}
            postProperties={props.postProperties}
          />
          <div
            className={`relative flex flex-col gap-[5.7px] tablet:gap-[10px] ${props.questStartData.type === 'embed' && props.sortedAnswers?.length >= 10 && 'h-[284px] overflow-scroll no-scrollbar tablet:h-[580px]'}`}
          >
            {props.sortedAnswers
              ?.slice(
                0,
                showOptions.isShow && showOptions.id === props.questStartData._id
                  ? props.sortedAnswers.length
                  : isFullScreen || location.pathname.startsWith('/p')
                    ? props.sortedAnswers.length
                    : 10
              )
              .map((item, index) => (
                <div key={index + 1}>
                  <RankedResult
                    number={'#' + (index + 1)}
                    originalOrder={props.questStartData.selectedPercentage}
                    answer={item.question}
                    addedAnswerUuid={item.uuid}
                    answersSelection={props.answersSelection}
                    setAnswerSelection={props.setAnswerSelection}
                    title={props.questStartData?.whichTypeQuestion}
                    selectedPercentages={
                      props.questStartData?.selectedPercentage && props.questStartData.selectedPercentage.length > 0
                        ? props.questStartData.selectedPercentage[props.questStartData.selectedPercentage.length - 1]
                        : null
                    }
                    contendPercentages={
                      props.questStartData?.contendedPercentage && props.questStartData.contendedPercentage.length > 0
                        ? props.questStartData.contendedPercentage[props.questStartData.contendedPercentage.length - 1]
                        : null
                    }
                    contend={findSelectionContentionCheck(
                      props.questStartData?.startQuestData && props.questStartData.startQuestData.data.length > 0
                        ? props.questStartData?.startQuestData.data[props.questStartData.startQuestData.data.length - 1]
                            .contended
                        : [],
                      item.question
                    )}
                    setAddOptionLimit={props.setAddOptionLimit}
                    btnText={'Results'}
                    postProperties={props.postProperties}
                    isEmbedResults={props.isEmbedResults}
                  />
                </div>
              ))}
            {showOptions.id !== props.questStartData._id &&
              props.sortedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={props.questStartData._id} />}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Result;
