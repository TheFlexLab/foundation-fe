import { useState, useEffect } from 'react';
import { Tooltip } from '../../../utils/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { resetaddOptionLimit } from '../../../features/quest/utilsSlice';
import { answerValidation, checkAnswerExist } from '../../../services/api/questsApi';
import BasicModal from '../../BasicModal';
import DeleteOption from '../../../pages/Dashboard/components/DeleteOption';
import ContentionIcon from '../../../assets/Quests/ContentionIcon';
import ObjectionPopUp from '../../ObjectionPopUp';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SingleAnswerRankedChoice = (props) => {
  const id = props.id;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.dragId });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkState, setCheckState] = useState(props.check);
  const [contendState, setContendState] = useState(props.contend);
  const [deleteModal, setDeleteModal] = useState(false);
  const [answer, setAnswer] = useState(props.answer);
  const [isTyping, setIsTyping] = useState(true);

  const reset = {
    name: 'Ok',
    color: 'text-[#389CE3] dark:text-blue-700',
    tooltipName: 'Please write something...',
    tooltipStyle: 'tooltip-info',
    showToolTipMsg: true,
  };

  const [prevValue, setPrevValue] = useState('');
  const [prevStatus, setPrevStatus] = useState(props.checkOptionStatus);

  const handleDeleteClose = () => setDeleteModal(false);

  const handlePopUpOpen = () => setModalVisible(true);
  const handlePopUpClose = () => setModalVisible(false);

  useEffect(() => {
    setCheckState(props.check);
  }, [props.check]);

  const handleCheckChange = () => {
    setCheckState((prevState) => {
      props.handleCheckChange(!prevState);
      return !prevState;
    });
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.length <= 200) {
      setIsTyping(true);
      setAnswer(inputValue);

      if (prevValue === inputValue.trim()) {
        setIsTyping(false);
        props.setCheckOptionStatus(prevStatus);
      } else {
        props.setCheckOptionStatus(reset);
      }
    }
  };

  const optionVerification = async (value) => {
    if (prevValue === answer) return;

    setIsTyping(false);
    setPrevValue(value);
    props.setCheckOptionStatus({
      name: 'Checking',
      color: 'text-green-200',
      tooltipName: 'Verifying your option. Please wait...',
      tooltipStyle: 'tooltip-success',
      showToolTipMsg: true,
    });
    setPrevStatus({
      name: 'Checking',
      color: 'text-green-200',
      tooltipName: 'Verifying your option. Please wait...',
      tooltipStyle: 'tooltip-success',
      showToolTipMsg: true,
    });
    // option Validation
    const { validatedAnswer, errorMessage } = await answerValidation({
      answer: value,
    });
    // If any error captured
    if (errorMessage) {
      setPrevStatus({
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
        showToolTipMsg: true,
      });
      return props.setCheckOptionStatus({
        name: 'Rejected',
        color: 'text-[#b00f0f]',
        tooltipName: 'Please review your text for proper grammar while keeping our code of conduct in mind.',
        tooltipStyle: 'tooltip-error',
        showToolTipMsg: true,
      });
    }
    // Check Answer is unique
    let answerExist = checkAnswerExist({
      answersArray: props.answersSelection,
      answer: validatedAnswer,
      index: id,
      startQuest: true,
    });
    if (answerExist) {
      setPrevStatus({
        name: 'Duplicate',
        color: 'text-[#EFD700]',
        tooltipName: 'Found Duplication!',
        tooltipStyle: 'tooltip-error',
        duplication: true,
        showToolTipMsg: true,
      });
      return props.setCheckOptionStatus({
        name: 'Duplicate',
        color: 'text-[#EFD700]',
        tooltipName: 'Found Duplication!',
        tooltipStyle: 'tooltip-error',
        duplication: true,
        showToolTipMsg: true,
      });
    }
    // Answer is validated and status is Ok
    if (validatedAnswer) {
      setAnswer(validatedAnswer);
      setPrevValue(validatedAnswer);
      setPrevStatus({
        name: 'Ok',
        color: 'text-green-200',
        tooltipName: 'Answer is Verified',
        tooltipStyle: 'tooltip-success',
        isVerifiedAnswer: true,
        showToolTipMsg: true,
      });
      props.setCheckOptionStatus({
        name: 'Ok',
        color: 'text-green-200',
        tooltipName: 'Answer is Verified',
        tooltipStyle: 'tooltip-success',
        isVerifiedAnswer: true,
        showToolTipMsg: true,
      });
    }
  };

  useEffect(() => {
    handleAddOption();
  }, [answer]);

  const handleAddOption = () => {
    const newArr = props.rankedAnswers.map((item, index) => (index === id ? { ...item, label: answer.trim() } : item));

    props.setAnswerSelection(newArr);
  };

  const handleDeleteOption = () => {
    // toast.success('Item deleted');
    props.setCheckOptionStatus(reset);

    const newArr = props.rankedAnswers.filter((item, index) => index !== id);

    props.setAnswerSelection(newArr);
    dispatch(resetaddOptionLimit());
    props.setAddOptionField(0);
  };

  const handleContendChange = (state) => {
    if (checkState) {
      handleCheckChange(false);
      props.handleCheckChange(false);
    }
    props.handleContendChange(state);
    setContendState(state);
  };

  const handleContendPopup = () => {
    if (contendState) {
      if (checkState) {
        handleCheckChange(false);
        props.handleCheckChange(false);
      }
      props.handleContendChange(false);
      setContendState(false);
    } else {
      handlePopUpOpen();
    }
  };

  const handleTab = () => {
    document.getElementById(`addedOption-${answer}`).blur();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center pl-7 pr-12 tablet:pl-[69px] tablet:pr-[6.3rem]"
    >
      <div className="relative flex w-full">
        {/* To Display Badges on Left of Option */}
        {props.addedAnswerUuid && (
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/addOptions/${
              props.addedAnswerUuid === persistedUserInfo?.uuid || props.addedAnswerUuid === localStorage.getItem('uId')
                ? 'yellowBadge'
                : 'blueBadge'
            }.svg`}
            alt={`${
              props.addedAnswerUuid === persistedUserInfo?.uuid || props.addedAnswerUuid === localStorage.getItem('uId')
                ? 'yellow'
                : 'blue'
            } badge`}
            className="absolute -left-4 top-1/2 h-4 w-[12px] -translate-y-1/2 tablet:-left-8 tablet:h-[27px] tablet:w-[21px]"
          />
        )}
        {/* To Display Contention and Trash Right of Option */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${props.postProperties === 'HiddenPosts' ? '-right-9 tablet:-right-[72px]' : '-right-[12px] tablet:-right-7'}`}
        >
          {props.postProperties === 'HiddenPosts' ? (
            <div className="flex w-12 min-w-12 items-center pl-3 tablet:w-8 tablet:justify-center tablet:pl-[5px]"></div>
          ) : (
            <div>
              {props.deleteable ? (
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/trash.svg' : 'assets/svgs/dashboard/trash2.svg'}`}
                  alt="trash"
                  className="h-3 w-[9px] cursor-pointer tablet:h-[23px] tablet:w-[17.6px]"
                  onClick={() => handleDeleteOption(props.number)}
                />
              ) : (
                <div
                  id="custom-yello-checkbox"
                  className="flex h-full w-[9px] cursor-pointer items-center justify-center tablet:w-[17.6px]"
                  onClick={handleContendPopup}
                >
                  <ContentionIcon
                    classNames="w-[2.578px] h-[10.313px] tablet:w-[5px] tablet:h-5"
                    checked={contendState}
                  />
                </div>
              )}
              <BasicModal open={deleteModal} handleClose={handleDeleteClose}>
                <DeleteOption
                  answer={props.answer}
                  answersSelection={props.answersSelection}
                  setAnswerSelection={props.setAnswerSelection}
                  handleDeleteClose={handleDeleteClose}
                  handleEditClose={handleDeleteClose}
                />
              </BasicModal>
            </div>
          )}
        </div>
        {/* Six Dots */}
        <div
          className={`${isDragging ? 'border-blue-300' : 'border-white-500 dark:border-gray-100'} flex w-[12.3px] min-w-[12.3px] items-center justify-center rounded-l-[4.734px] border-y border-l bg-white-500 dark:bg-gray-100 tablet:w-[25px] tablet:min-w-[25px] tablet:rounded-l-[10px] tablet:border-y-[3px] tablet:border-l-[3px]`}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/${persistedTheme === 'dark' ? 'six-dots-dark.svg' : 'six-dots.svg'}`}
            alt="six-dots"
            className="w-[5.2px] tablet:w-[11.2px]"
          />
        </div>
        {/* Option */}
        <div
          className={`${
            isDragging
              ? 'border-blue-300 dark:bg-accent-100'
              : 'dark:bg-green border-white-500 bg-white dark:border-gray-100 dark:bg-accent-100'
          } flex w-full items-center rounded-r-[4.7px] border-y border-r tablet:rounded-r-[10px] tablet:border-y-[3px] tablet:border-r-[3px]`}
        >
          <div
            className={`${
              isDragging ? 'border-blue-300 bg-[#F2F6FF] dark:bg-accent-100' : 'border-white-500 dark:border-gray-250'
            } flex w-full justify-between bg-white dark:bg-accent-100`}
          >
            {props.editable ? (
              <TextareaAutosize
                id={`addedOption-${answer}`}
                onChange={handleInputChange}
                onBlur={(e) => e.target.value.trim() !== '' && optionVerification(e.target.value.trim())}
                value={answer}
                autoFocus
                onKeyDown={(e) => e.key === 'Tab' || (e.key === 'Enter' && handleTab())}
                className={`${
                  isDragging ? 'bg-[#F2F6FF] dark:bg-accent-100' : 'bg-white dark:bg-accent-100'
                } w-full resize-none rounded-[4.73px] px-2 py-[5.6px] text-[8.52px] font-normal leading-none text-[#435059] outline-none dark:text-[#D3D3D3] tablet:rounded-[10.949px] tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px]`}
              />
            ) : (
              <h1 className="text-gray px-2 pb-[5.6px] pt-[5.6px] text-[8.52px] font-normal leading-[10px] outline-none dark:text-[#D3D3D3] tablet:py-3 tablet:pl-[18px] tablet:text-[19px] tablet:leading-[19px]">
                {props.answer}
              </h1>
            )}
            {props.deleteable && (
              <div
                className={`${
                  isDragging ? 'bg-[#F2F6FF] dark:bg-accent-100' : 'bg-white dark:bg-accent-100'
                } relative flex items-center rounded-r-[4.7px] text-[0.5rem] font-semibold tablet:rounded-r-[10px] tablet:text-[1rem] laptop:text-[1.25rem] ${
                  props.checkOptionStatus.color
                }`}
              >
                <div className="flex h-[75%] w-[50px] items-center justify-center border-l-[0.7px] tablet:w-[99.58px] laptop:w-[7rem]">
                  <span> {isTyping ? `${answer.length}/200` : props.checkOptionStatus.name}</span>
                </div>
                <Tooltip optionStatus={props.checkOptionStatus} />
              </div>
            )}
          </div>
          <div
            className={`${
              isDragging ? 'border-blue-300' : 'border-white-500 dark:border-gray-250'
            } flex h-full min-h-[21.7px] w-[35px] items-center justify-center rounded-r-[4.7px] bg-white dark:bg-accent-100 tablet:h-full tablet:rounded-r-[10px]`}
          >
            <h1 className="text-[8.52px] font-bold leading-[0px] text-[#22AA69] tablet:text-[19px]">{props.number}</h1>
          </div>
        </div>
      </div>

      {/* =============== Objection PopUp */}
      <ObjectionPopUp
        modalVisible={modalVisible}
        handleClose={handlePopUpClose}
        handleContendChange={handleContendChange}
        option={props.answer}
      />
    </div>
  );
};

export default SingleAnswerRankedChoice;
