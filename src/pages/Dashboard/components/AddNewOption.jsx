import { useState } from 'react';
import showToast from '../../../components/ui/Toast';
import { useSelector } from 'react-redux';

const AddNewOption = ({ setAnswerSelection, answersSelection, handleClose, setAddOptionLimit }) => {
  const [temp, setTemp] = useState('');
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleInputChange = (e) => {
    setTemp(e.target.value);
  };

  const handleAddOption = () => {
    if (temp.trim() === '') {
      showToast('warning', 'emptyOption');
      return;
    }

    const newOption = {
      label: temp.trim(),
      check: false,
      contend: false,
      addedOptionByUser: true,
      edit: true,
      delete: true,
    };

    setAnswerSelection([...answersSelection, newOption]);

    setTemp('');
    setAddOptionLimit(1);
    handleClose();
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-[26px] bg-[#232628] p-6">
      <h1 className="text-[22px] font-semibold leading-normal text-[#5B5B5B] dark:text-[#CFCFCF]">
        Add Your Own Option
      </h1>
      <div className="w-full min-w-[30rem] rounded-[10px] bg-white dark:bg-[#0D1012]">
        <div className="flex items-center">
          <div className="bg-white-500 h-full w-fit rounded-l-[10px] px-[7px] pb-[13px] pt-[14px] dark:bg-[#9E9E9E]">
            {persistedTheme === 'dark' ? (
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
                alt="six dots"
              />
            ) : (
              <img src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`} alt="six dots" />
            )}
          </div>
          <input
            value={temp}
            onChange={handleInputChange}
            type="text"
            className="ml-8 w-full bg-white text-[19px] font-normal leading-normal text-[#435059] focus:outline-none dark:bg-[#0D1012] dark:text-[#D3D3D3]"
          />
        </div>
      </div>
      <button
        className={` ${
          persistedTheme === 'dark' ? 'bg-[#333B46]' : 'bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]'
        } inset-0 w-full  rounded-[10px] px-5 py-2 text-[20px] font-semibold leading-normal text-[#EAEAEA] shadow-inner`}
        onClick={handleAddOption}
      >
        Submit
      </button>
    </div>
  );
};

export default AddNewOption;
