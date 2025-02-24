import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestionTitle } from '../../../../../utils/questionCard/SingleQuestCard';
import SingleAnswer from '../../../../../components/question-card/options/SingleAnswer';
import SingleAnswerRankedChoice from '../../../../../components/question-card/options/SingleAnswerRankedChoice';
import SingleAnswerMultipleChoice from '../../../../../components/question-card/options/SingleAnswerMultipleChoice';
import { closestCorners, DndContext, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SeeMoreOptions from '../../../../../components/see-more-options';
import { useSelector } from 'react-redux';
import { getSeeMoreOptions } from '../../../../../features/quest/seeMoreOptionsSlice';

const StartTest = ({
  questStartData,
  handleToggleCheck,
  answersSelection,
  setAnswerSelection,
  rankedAnswers,
  setRankedAnswers,
  setAddOptionField,
  questSelection,
  cardSize,
  checkOptionStatus,
  setCheckOptionStatus,
  postProperties,
}) => {
  const { isFullScreen } = useParams();
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 0,
    },
  });
  const showOptions = useSelector(getSeeMoreOptions);

  const handleCheckChange = (index, check) => {
    setAnswerSelection((prevAnswers) => prevAnswers.map((answer, i) => (i === index ? { ...answer, check } : answer)));
  };

  const handleContendChangeRanked = (index, contend) => {
    setRankedAnswers((prevAnswers) => prevAnswers.map((answer, i) => (i === index ? { ...answer, contend } : answer)));
  };

  const handleContendChange = (index, contend) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) => (i === index ? { ...answer, contend } : answer)),
    );
  };

  const handleCheckChangeSingle = (index) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, check: !answer.check, contend: false } : { ...answer, check: false },
      ),
    );
  };

  const handleContendChangeSingle = (index, contend) => {
    setAnswerSelection((prevAnswers) =>
      prevAnswers.map((answer, i) =>
        i === index ? { ...answer, contend: contend, check: false } : { ...answer, contend: false },
      ),
    );
  };

  function findLabelChecked(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    return labelFound[0]?.check === true;
  }

  function findLabelContend(array, labelToFind) {
    const labelFound = array.filter((item) => item.label === labelToFind);
    return labelFound[0]?.contend === true;
  }

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRankedAnswers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const renderOptionsByTitle = () => {
    const listContainerRef = useRef(null);

    useEffect(() => {
      let listlength = answersSelection.length;

      if (answersSelection[listlength - 1]?.addedOptionByUser && listContainerRef.current) {
        listContainerRef.current.scrollTop = listContainerRef.current.scrollHeight;
      }
    }, [answersSelection]);

    if (
      getQuestionTitle(questStartData.whichTypeQuestion) === 'Yes/No' ||
      getQuestionTitle(questStartData.whichTypeQuestion) === 'Agree/Disagree' ||
      getQuestionTitle(questStartData.whichTypeQuestion) === 'Like/Dislike'
    ) {
      return (
        <>
          {getQuestionTitle(questStartData.whichTypeQuestion) === 'Yes/No' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Yes'}
                check={questSelection['yes/no'].yes.check}
                contend={questSelection['yes/no'].yes.check}
                handleToggleCheck={handleToggleCheck}
                questStartData={questStartData}
                postProperties={postProperties}
              />
              <SingleAnswer
                number={'#2'}
                answer={'No'}
                check={questSelection['yes/no'].no.check}
                contend={questSelection['yes/no'].no.check}
                handleToggleCheck={handleToggleCheck}
                questStartData={questStartData}
                postProperties={postProperties}
              />
            </>
          ) : getQuestionTitle(questStartData.whichTypeQuestion) === 'Agree/Disagree' ? (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Agree'}
                check={questSelection['agree/disagree'].agree.check}
                contend={questSelection['agree/disagree'].agree.check}
                handleToggleCheck={handleToggleCheck}
                questStartData={questStartData}
                postProperties={postProperties}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Disagree'}
                check={questSelection['agree/disagree'].disagree.check}
                contend={questSelection['agree/disagree'].disagree.check}
                handleToggleCheck={handleToggleCheck}
                questStartData={questStartData}
                postProperties={postProperties}
              />
            </>
          ) : (
            <>
              <SingleAnswer
                number={'#1'}
                answer={'Like'}
                check={questSelection['like/dislike'].like.check}
                contend={questSelection['like/dislike'].like.check}
                handleToggleCheck={handleToggleCheck}
                questStartData={questStartData}
                postProperties={postProperties}
              />
              <SingleAnswer
                number={'#2'}
                answer={'Dislike'}
                check={questSelection['like/dislike'].dislike.check}
                contend={questSelection['like/dislike'].dislike.check}
                handleToggleCheck={handleToggleCheck}
                questStartData={questStartData}
                postProperties={postProperties}
              />
            </>
          )}
        </>
      );
    }

    if (
      getQuestionTitle(questStartData.whichTypeQuestion) === 'Multiple Choice' ||
      getQuestionTitle(questStartData.whichTypeQuestion) === 'Open Choice'
    ) {
      return (
        <div className="flex flex-col overflow-auto">
          <div ref={listContainerRef} className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]">
            {answersSelection
              ?.slice(
                0,
                showOptions.isShow && showOptions.id === questStartData._id
                  ? answersSelection.length
                  : isFullScreen || location.pathname.startsWith('/p')
                    ? answersSelection.length
                    : 10,
              )
              .map((item, index) => (
                <SingleAnswerMultipleChoice
                  questStartData={questStartData}
                  id={index}
                  key={index}
                  number={'#' + (index + 1)}
                  answer={item.label}
                  addedAnswerUuid={item.uuid}
                  editable={item.edit}
                  deleteable={item.delete}
                  title={getQuestionTitle(questStartData.whichTypeQuestion)}
                  multipleOption={questStartData.userCanSelectMultiple}
                  answersSelection={answersSelection}
                  setAnswerSelection={setAnswerSelection}
                  checkInfo={true}
                  check={findLabelChecked(answersSelection, item.label)}
                  contend={findLabelContend(answersSelection, item.label)}
                  whichTypeQuestion={questStartData.whichTypeQuestion}
                  handleCheckChange={
                    questStartData.userCanSelectMultiple === true
                      ? (check) => handleCheckChange(index, check)
                      : (check) => handleCheckChangeSingle(index, check)
                  }
                  handleContendChange={
                    questStartData.userCanSelectMultiple === true
                      ? (contend) => handleContendChange(index, contend)
                      : (contend) => handleContendChangeSingle(index, contend)
                  }
                  setAddOptionField={setAddOptionField}
                  checkOptionStatus={checkOptionStatus}
                  setCheckOptionStatus={setCheckOptionStatus}
                  postProperties={postProperties}
                />
              ))}
            {showOptions.id !== questStartData._id &&
              rankedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={questStartData._id} />}
          </div>
        </div>
      );
    }

    if (getQuestionTitle(questStartData.whichTypeQuestion) === 'Ranked Choice') {
      return (
        <div className="flex flex-col overflow-auto">
          <div className="relative flex flex-col gap-[5.7px] tablet:gap-[10px]">
            <DndContext
              sensors={[touchSensor, mouseSensor, keyboardSensor]}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              collisionDetection={closestCorners}
              onDragEnd={handleOnDragEnd}
            >
              <SortableContext items={rankedAnswers}>
                {rankedAnswers
                  ?.slice(
                    0,
                    showOptions.isShow && showOptions.id === questStartData._id
                      ? rankedAnswers.length
                      : isFullScreen || location.pathname.startsWith('/p')
                        ? rankedAnswers.length
                        : 10,
                  )
                  .map((item, index) => (
                    <SingleAnswerRankedChoice
                      key={item.id}
                      dragId={item.id}
                      questStartData={questStartData}
                      id={index}
                      item={item}
                      number={index + 1}
                      editable={item.edit}
                      deleteable={item.delete}
                      answer={item.label}
                      addedAnswerUuid={item.uuid}
                      answersSelection={answersSelection}
                      setAnswerSelection={setAnswerSelection}
                      rankedAnswers={rankedAnswers}
                      title={getQuestionTitle(questStartData.whichTypeQuestion)}
                      checkInfo={false}
                      check={findLabelChecked(rankedAnswers, item.label)}
                      contend={findLabelContend(rankedAnswers, item.label)}
                      handleCheckChange={(check) => handleCheckChange(index, check)}
                      handleContendChange={(contend) => handleContendChangeRanked(index, contend)}
                      setAddOptionField={setAddOptionField}
                      checkOptionStatus={checkOptionStatus}
                      setCheckOptionStatus={setCheckOptionStatus}
                      postProperties={postProperties}
                    />
                  ))}
              </SortableContext>
            </DndContext>
            {showOptions.id !== questStartData._id &&
              rankedAnswers?.length >= 10 &&
              isFullScreen === undefined &&
              !location.pathname.startsWith('/p') && <SeeMoreOptions id={questStartData._id} />}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-[5.7px] tablet:gap-[10px]" style={{ minHeight: `${cardSize}px ` }}>
      {renderOptionsByTitle()}
    </div>
  );
};

export default StartTest;
