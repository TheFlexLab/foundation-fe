import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { resetaddOptionLimit } from '../../../features/quest/utilsSlice';

const DeleteOption = (props) => {
  const dispatch = useDispatch();
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleDeleteOption = () => {
    const newArr = props.answersSelection.filter((item) => item.label !== props.answer);

    props.setAnswerSelection(newArr);
    dispatch(resetaddOptionLimit());
    // toast.success('Item deleted');
    props.handleEditClose();
    props.handleDeleteClose();
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-[4.7px] bg-[#232628] p-6 tablet:min-w-[350px] tablet:rounded-[26px]">
      <h1 className="text-[8.72px] font-semibold leading-normal text-[#5B5B5B] tablet:text-[22px] dark:text-[#CFCFCF]">
        Delete Option
      </h1>
      <div className="flex gap-2 tablet:gap-6">
        <button
          className="inset-0 w-full rounded-[4.7px] bg-[#d11a2a] px-5 py-1 text-[8.52px] font-semibold leading-normal text-[#EAEAEA] shadow-inner tablet:rounded-[10px] tablet:py-2 tablet:text-[20px]"
          onClick={handleDeleteOption}
        >
          Yes
        </button>
        <button
          className={` ${
            persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
          } inset-0 w-full rounded-[4.7px] px-5 py-1 text-[8.52px]  font-semibold leading-normal text-[#EAEAEA] shadow-inner tablet:rounded-[10px] tablet:py-2 tablet:text-[20px]`}
          onClick={() => {
            props.handleDeleteClose();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteOption;
