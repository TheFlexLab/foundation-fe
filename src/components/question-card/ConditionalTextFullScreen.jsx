import QuestTimeRemaining from '../../pages/Dashboard/pages/QuestStartSection/components/QuestTimeRemaining';

const ConditionalTextFullScreen = ({ show, questStartData }) => {
  return (
    <div className="pb-3 pt-[6px] text-center tablet:pb-[1.44rem] tablet:pt-[1.2rem]">
      <QuestTimeRemaining show={show} questStartData={questStartData} />
    </div>
  );
};

export default ConditionalTextFullScreen;
