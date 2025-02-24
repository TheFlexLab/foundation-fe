import { GrClose } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSeldonState,
  handleDebubMode,
  handleKnowledgebase,
  handleSeldonInput,
  resetSeldonProperty,
  resetSeldonState,
} from '../../../../features/seldon-ai/seldonSlice';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Button } from '../../../../components/ui/Button';
import Checkbox from '../../../../components/ui/Checkbox';
import showToast from '../../../../components/ui/Toast';

const ragCollections = [
  {
    id: 1,
    title: 'User',
    val: 'user',
  },
  {
    id: 2,
    title: 'About',
    val: 'about',
  },
  {
    id: 3,
    title: 'Post',
    val: 'knowladgebaseone',
  },
];

export default function SeldonInputs() {
  const dispatch = useDispatch();
  const seldonState = useSelector(getSeldonState);

  const handleCheckboxChange = (item: string) => {
    dispatch(handleKnowledgebase(item));
  };

  return (
    <div className="mt-2 flex h-fit flex-col gap-3 rounded-[8px] p-3 dark:border dark:border-gray-100 dark:bg-gray-200 laptop:my-[15px] laptop:ml-[31px] laptop:w-[18.75rem] laptop:min-w-[18.75rem] laptop:gap-8 laptop:rounded-[15px] laptop:bg-white laptop:py-[23px] laptop:pl-[1.3rem] laptop:pr-[2.1rem]">
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.temperature}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'temperature', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Temperature
          </label>
        </div>
        {seldonState.temperature >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('temperature'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.max_tokens}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'max_tokens', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Max Tokens
          </label>
        </div>
        {seldonState.max_tokens && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('max_tokens'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.top_p}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'top_p', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Top P
          </label>
        </div>
        {seldonState.top_p >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('top_p'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.frequency_penalty}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'frequency_penalty', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Frequency Penalty
          </label>
        </div>
        {seldonState.frequency_penalty >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('frequency_penalty'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.presence_penalty}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'presence_penalty', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Presence Penalty
          </label>
        </div>
        {seldonState.presence_penalty >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('presence_penalty'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.fetchK}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'fetchK', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Fetch K
          </label>
        </div>
        {seldonState.fetchK >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('fetchK'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.lambda}
            placeholder=""
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'lambda', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Lamda
          </label>
        </div>
        {seldonState.lambda >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('lambda'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.finding}
            placeholder=""
            onChange={(e) => {
              const value = e.target.value;

              if (value === '' || parseInt(value, 10) >= 0) {
                dispatch(handleSeldonInput({ name: 'finding', value }));
              } else {
                showToast('warning', 'numberShouldBeBetween1and9');
              }
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Findings
          </label>
        </div>
        {seldonState.finding >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('finding'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative h-[29px] w-full tablet:h-[45px]">
          <input
            type="number"
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.suggestion}
            placeholder=""
            onChange={(e) => {
              const value = e.target.value;

              if (value === '' || parseInt(value, 10) >= 0) {
                dispatch(handleSeldonInput({ name: 'suggestion', value }));
              } else {
                showToast('warning', 'numberShouldBeBetween1and9');
              }
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            Suggestions
          </label>
        </div>
        {seldonState.suggestion >= 0 && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('suggestion'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="relative">
        <div className="relative w-full">
          <TextareaAutosize
            id="floating_outlined"
            className="peer block h-full w-full appearance-none rounded-lg border border-[#707175] bg-transparent py-2 pl-5 pr-8 text-sm text-[#707175] focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-white-100 dark:bg-gray-200 dark:text-white-100 dark:focus:border-blue-500 tablet:rounded-[10px] tablet:border-2 tablet:py-2 tablet:text-[18.23px]"
            value={seldonState.system}
            placeholder=""
            maxRows={3}
            onChange={(e) => {
              dispatch(handleSeldonInput({ name: 'system', value: e.target.value }));
            }}
          />
          <label
            htmlFor="floating_outlined"
            className="absolute left-[15px] start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-gray-400 px-2 text-sm text-[#707175] duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-200 dark:text-white-100 peer-focus:dark:text-blue-500 tablet:bg-white tablet:text-[17px] rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
          >
            System
          </label>
        </div>
        {seldonState.system !== '' && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              dispatch(resetSeldonProperty('system'));
            }}
          >
            <GrClose className="h-4 w-4 text-[#ACACAC] dark:text-white" />
          </button>
        )}
      </div>
      <div className="flex gap-3 tablet:gap-4">
        {ragCollections.map((item) => (
          <Checkbox
            key={item.id}
            checked={seldonState.knowledgebase?.includes(item.val)}
            onChange={() => handleCheckboxChange(item.val)}
            label={item.title}
          />
        ))}
      </div>
      <div className="flex gap-3 tablet:gap-4">
        <Checkbox checked={seldonState.debug} onChange={() => dispatch(handleDebubMode())} label="Debug Mode" />
      </div>
      <Button
        variant="submit"
        onClick={() => {
          dispatch(resetSeldonState());
        }}
      >
        Reset All
      </Button>
    </div>
  );
}
