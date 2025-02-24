import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useAnalyzeOrderMutation } from '../../../services/mutations/advance-analytics';
import { closestCorners, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import AnalyticResults from './AnalyticResults';
import ClearAllAnalytics from '../../../components/dialogue-boxes/ClearAllAnalytics';
import AnalyzeDialogueBox from '../../../components/dialogue-boxes/AnalyzeDialogueBox';

export default function AdvanceAnalytics({ questStartData, userQuestSettingRef }: any) {
  const persistedTheme = useSelector((state: any) => state.utils.theme);
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const plusImg = `${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/plus.svg' : 'assets/svgs/dashboard/add.svg'}`;
  const [analyzePopup, setAnalyzePopup] = useState(false);
  const [clearAnalyticsPopup, setClearAnalyticsPopup] = useState(false);
  const [analyticResults, setAnalyticResults] = useState(questStartData?.advanceAnalytics || []);
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 0,
    },
  });

  useEffect(() => {
    setAnalyticResults(questStartData?.advanceAnalytics || []);
  }, [questStartData?.advanceAnalytics]);

  const { mutateAsync: handleOrderAnalyze } = useAnalyzeOrderMutation();

  const handleAnalyzeClose = () => setAnalyzePopup(false);
  const handleClearAnalyticsClose = () => setClearAnalyticsPopup(false);

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      let data: any;
      setAnalyticResults((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);
        arrayMove(items, oldIndex, newIndex);
        data = arrayMove(items, oldIndex, newIndex);
        return data;
      });

      if (data) {
        handleOrderAnalyze({
          userUuid: persistedUserInfo.uuid,
          questForeignKey: questStartData._id,
          payload: data,
        } as any);
      }
    }
  };

  return (
    <div className="mt-2 rounded-[12.3px] border-2 border-white-500 bg-white p-[10px] dark:border-gray-100 dark:bg-gray-200 tablet:mt-[15px] tablet:rounded-[15px] tablet:py-[25px]">
      <h1 className="text-gray text-center text-[0.75rem] font-semibold leading-[15px] dark:text-white-400 tablet:text-[1.25rem] tablet:leading-[1.25rem]">
        Analyze results
      </h1>
      <p className="summary-text mt-[10px] text-center tablet:mt-[15px]">
        Filter results to narrow how many participants engaged with certain information or how results change.
      </p>
      <div className="relative mt-[10px] flex flex-col gap-[10px] tablet:mt-[15px] tablet:gap-[15px]">
        <DndContext
          sensors={[touchSensor, mouseSensor, keyboardSensor]}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          collisionDetection={closestCorners}
          onDragEnd={handleOnDragEnd}
        >
          <SortableContext items={analyticResults}>
            {analyticResults?.map((item: any) => (
              <AnalyticResults key={item.id} item={item} questStartData={questStartData} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="mt-[10px] flex items-center justify-between tablet:mx-[36px] tablet:mt-[15px]">
        <Button
          variant={'addOption'}
          onClick={() => {
            if (questStartData?.participantsCount > 0) {
              setAnalyzePopup(true);
            } else {
              toast.warning('There are no participants to filter out');
            }
          }}
        >
          <img src={plusImg} alt="add" className="size-[7.398px] tablet:size-[15.6px]" />
          Add filter
        </Button>
        {questStartData?.advanceAnalytics?.length >= 1 && (
          <Button
            variant={'remove'}
            onClick={() => {
              setClearAnalyticsPopup(true);
            }}
          >
            Clear all filters
          </Button>
        )}
      </div>
      {analyzePopup && (
        <AnalyzeDialogueBox
          handleClose={handleAnalyzeClose}
          modalVisible={analyzePopup}
          title={'Analyze results'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          questStartData={questStartData}
          update={false}
          userQuestSettingRef={userQuestSettingRef}
        />
      )}
      {clearAnalyticsPopup && (
        <ClearAllAnalytics
          handleClose={handleClearAnalyticsClose}
          modalVisible={clearAnalyticsPopup}
          title={'Clear All Filters'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          id={questStartData?._id}
        />
      )}
    </div>
  );
}
