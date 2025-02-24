import { Switch } from '@headlessui/react';

const CustomSwitch = ({ enabled, setEnabled }) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-[#89CFF0]' : 'bg-gray-250'}
    green-select`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${
          enabled
            ? 'translate-x-3 bg-gradient-to-r from-[#6BA5CF] to-[#389CE3] tablet:translate-x-6'
            : '-translate-x-[7px] bg-[#707070]'
        }
      green-select-shape`}
      />
    </Switch>
  );
};

export default CustomSwitch;
