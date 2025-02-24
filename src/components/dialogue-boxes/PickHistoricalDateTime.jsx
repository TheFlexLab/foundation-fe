import PopUp from '../ui/PopUp';
import { Button } from '../ui/Button';

export default function PickHistoricalDateTime({
  handleClose,
  modalVisible,
  title,
  image,
  historicalDate,
  setHistoricalDate,
}) {
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setHistoricalDate(selectedDate);
  };

  return (
    <PopUp logo={image} title={title} open={modalVisible} handleClose={handleClose}>
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <input
          type="date"
          id="dateInput"
          value={historicalDate}
          onChange={handleDateChange}
          className="verification_badge_input"
        />
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-[25px] tablet:gap-[34px]">
          <Button variant={'submit'} onClick={handleClose}>
            Yes
          </Button>
          <Button variant={'cancel'} onClick={handleClose}>
            No
          </Button>
        </div>
      </div>
    </PopUp>
  );
}
