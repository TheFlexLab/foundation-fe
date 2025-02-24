import { useEffect, useState } from 'react';
import { DateInput } from '../../../../components/ui/DateInput';
import { ActivityProps } from '../../../../types/advanceAnalytics';

export default function ActivityDob({ state, dispatch }: ActivityProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    if (from) {
      dispatch({ type: 'SET_DOB_FROM', payload: from });
    }
    if (to) {
      dispatch({ type: 'SET_DOB_TO', payload: to });
    }
  }, [from, to]);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="w-full">
        <label htmlFor="dateInput-from" className="text-[10px] tablet:text-[20px]">
          From
        </label>
        <DateInput value={state.dob.from} setVal={setFrom} id="dateInput-from" />
      </div>
      <div className="w-full">
        <label htmlFor="dateInput-to" className="text-[10px] tablet:text-[20px]">
          To
        </label>
        <DateInput value={state.dob.to} setVal={setTo} id="dateInput-to" />
      </div>
    </div>
  );
}
