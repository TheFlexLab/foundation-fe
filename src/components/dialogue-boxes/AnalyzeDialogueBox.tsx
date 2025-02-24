import PopUp from '../ui/PopUp';
import { useState } from 'react';
import { analyzeButtons } from '../../constants/advanceAnalytics';
import { AnalyzeModalProps } from '../../types/advanceAnalytics';
import BadgeCount from '../../pages/features/advance-analytics/BadgeCount';
import Target from '../../pages/features/advance-analytics/Target';
import HideOption from '../../pages/features/advance-analytics/HideOption';
import Activity from '../../pages/features/advance-analytics/Activity';

export default function AnalyzeDialogueBox({
  handleClose,
  modalVisible,
  title,
  image,
  questStartData,
  update,
  selectedItem,
  userQuestSettingRef
}: AnalyzeModalProps) {
  const [selectedBtn, setSelectedBtn] = useState(update ? selectedItem.type : 'hide');

  const renderSelectedComponent = () => {
    switch (selectedBtn) {
      case 'hide':
        return (
          <HideOption
            handleClose={handleClose}
            questStartData={questStartData}
            update={update}
            selectedItem={selectedItem}
          />
        );
      case 'badgeCount':
        return (
          <BadgeCount
            handleClose={handleClose}
            questStartData={questStartData}
            update={update}
            selectedItem={selectedItem}
          />
        );
      case 'target':
        return (
          <Target
            handleClose={handleClose}
            questStartData={questStartData}
            update={update}
            selectedItem={selectedItem}
            userQuestSettingRef={userQuestSettingRef}
          />
        );
      case 'activity':
        return (
          <Activity
            handleClose={handleClose}
            questStartData={questStartData}
            update={update}
            selectedItem={selectedItem}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PopUp
      logo={image}
      title={title}
      open={modalVisible}
      handleClose={handleClose}
      customStyle=""
      customClasses=""
      closeIcon=""
      isBackground=""
      remove=""
      autoSize=""
    >
      <div className="px-[18px] py-[10px] tablet:px-[55px] tablet:py-[25px]">
        <h1 className="summary-text mb-2 tablet:mb-4">Filter by:</h1>
        <div className="flex items-center justify-center gap-[15px]">
          {analyzeButtons.map((item) => (
            <button
              key={item.id}
              className={`slider-link min-w-[60px] tablet:min-w-[120px] ${selectedBtn === item.name ? 'slider-link-active' : 'slider-inactive'}`}
              onClick={() => setSelectedBtn(item.name)}
              disabled={update && selectedItem.type !== item.name}
            >
              {item.title}
            </button>
          ))}
        </div>
        {renderSelectedComponent()}
      </div>
    </PopUp>
  );
}
