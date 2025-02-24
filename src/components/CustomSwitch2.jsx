import { Switch } from '@headlessui/react';

const CustomSwitch2 = ({ enabled, setEnabled }) => {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-[#DFE9FC]' : 'bg-gray-250'}
      green-select2`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-3 bg-[#389CE3] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707070]'}
      green-select2-shape`}
      />
    </Switch>
  );
};

export default CustomSwitch2;
