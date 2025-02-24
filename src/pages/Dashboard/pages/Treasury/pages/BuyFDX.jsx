import usePulse from '../../../../../hooks/usePulse';
import BuyBalance from '../components/BuyBalance';
import FdxActivity from '../components/FdxActivity';

const BuyFDX = () => {
  const [isPulse, triggerPulse] = usePulse();

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      <BuyBalance triggerPulse={triggerPulse} />
      <FdxActivity isPulse={isPulse} />
    </div>
  );
};

export default BuyFDX;
