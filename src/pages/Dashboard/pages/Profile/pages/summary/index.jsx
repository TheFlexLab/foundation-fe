import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../../../../components/ui/Button';
import VerificationBadgeScore from '../../../../../../components/summary/VerificationBadgeScore';
import SummaryCard from '../../../../../../components/SummaryCard';
import AddToListPopup from '../../../../../../components/dialogue-boxes/AddToListPopup';

const Summary = () => {
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [addToList, setAddToList] = useState(false);

  return (
    <div className="mx-auto mb-4 flex max-w-[778px] flex-col gap-3 px-4 tablet:mb-8 tablet:gap-6 tablet:px-6">
      <VerificationBadgeScore />
      <SummaryCard headerIcon="/assets/summary/post-activity-logo2.svg" headerTitle="Post Activity">
        <h1 className="summary-text">
          Creating posts is a great way to earn FDX. Your contributions gain value as others engage with them, enhancing
          your impact within the Foundation community.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you've created
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.questsCreated}</h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Engagements with your posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.yourPostEngaged}</h5>
          </div>
          <div className="max-w-28 border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts I've engaged with
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.questsActivity?.myQuestsEngagementCount || 0}
            </h5>
          </div>
        </div>

        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/post-activity')}>
            View all post activity
          </Button>
          {/* <Button variant={'submit'} onClick={() => navigate('/profile/feedback-given')}>
            View all feedback given
          </Button> */}
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/feedback-given.svg" headerTitle="Feedback Given">
        <h1 className="summary-text">
          See the feedback you've given on other's posts, including those you've chosen to hide.
        </h1>
        <div className="mt-3 grid grid-cols-2 divide-x divide-[#707175] text-center dark:divide-gray-300 tablet:mt-5">
          <div className="flex w-full justify-end">
            <div className="w-full max-w-28 pr-2 tablet:max-w-[200px] tablet:pr-4">
              <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Posts I have given feedback on
              </h1>
              <h5 className="text-[18px] font-normal">{persistedUserInfo?.questsActivity?.feedbackGiven}</h5>
            </div>
          </div>
          <div className="w-full max-w-28 pl-2 tablet:max-w-[200px] tablet:pl-4">
            <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts I have hidden
            </h1>
            <h5 className="text-[18px] font-normal">{persistedUserInfo?.questsActivity?.myHiddenQuestsCount}</h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/feedback-given')}>
            View all feedback given
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/feedback-received.svg" headerTitle="Feedback Received">
        <h1 className="summary-text">
          Here’s a look at the posts you’ve created that others have provided feedback on, including those they've
          chosen to hide.
        </h1>
        <div className="mt-3 grid grid-cols-2 divide-x divide-[#707175] text-center dark:divide-gray-300 tablet:mt-5">
          <div className="flex w-full justify-end">
            <div className="w-full max-w-28 pr-2 tablet:max-w-[200px] tablet:pr-4">
              <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Feedback on my posts
              </h1>
              <h5 className="text-[18px] font-normal">{persistedUserInfo?.questsActivity?.feedbackReceived}</h5>
            </div>
          </div>
          <div className="w-full max-w-28 pl-2 tablet:max-w-[200px] tablet:pl-4">
            <h1 className="text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Hidden Posts
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/feedback')}>
            View all feedback received
          </Button>
        </div>
      </SummaryCard>

      <SummaryCard headerIcon="/assets/summary/share-posts-logo.svg" headerTitle="Shared Posts">
        <h1 className="summary-text">
          Sharing posts helps broaden your reach. The more engagement your shares receive, the more FDX you earn. Shared
          posts are displayed on your Home Page for all to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-3 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Posts you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics?.sharedQuests}
            </h5>
          </div>

          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total engagements
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics.totalQuestsCompleted}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total views
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.sharedQuestsStatistics?.totalQuestsImpression}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/shared-links')}>
            View all shared posts
          </Button>
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/summary/my-list-logo.svg" headerTitle="My Collections">
        <h1 className="summary-text">
          Organize what posts matter most and get a deeper understanding of your audience with Collections. The more
          engagement your Collections receive, the more FDX you’ll earn! Shared collections will appear on your home
          page for all to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Collections you’ve shared
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsCount}
            </h5>
          </div>
          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total collections
            </h1>
            <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.myListStatistics?.totalLists}</h5>
          </div>

          <div className="max-w-28 border-r border-[#707175] pr-3 dark:border-gray-300 tablet:max-w-full tablet:pr-6">
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total collection engagement
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsParticipentsCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total collection views
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myListStatistics?.totalSharedListsClicksCount}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex justify-center tablet:mt-5">
          <Button variant="submit" onClick={() => setAddToList(true)}>
            Create a new collection
          </Button>
          {addToList && (
            <AddToListPopup handleClose={() => setAddToList(false)} modalVisible={addToList} page={'my-collection'} />
          )}
        </div>
      </SummaryCard>
      <SummaryCard headerIcon="/assets/topbar/news.svg" headerTitle="Shared Articles">
        <h1 className="summary-text">
          Manage news articles you’ve shared and track engagement metrics. Shared articles also appear on your Home Page
          for your audience to see.
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
          <div className="max-w-28 border-r border-[#707175] pr-3 tablet:max-w-full tablet:pr-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Articles you’ve shared
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.myArticleStatistics.totalSharedArticlesCount}
            </h5>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 tablet:mt-5 tablet:gap-6">
            <h1 className="text-gray-1 text-center text-[12px] font-semibold leading-[116%] dark:text-gray-300 tablet:text-[16px] tablet:leading-normal">
              Total engagements
            </h1>
            <h5 className="text-gray-1 text-center text-[18px] font-normal dark:text-gray-300">
              {persistedUserInfo?.myArticleStatistics.overAllArticleSharedEngagementCount}
            </h5>
          </div>
          <div>
            <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
              Total views
            </h1>
            <h5 className="text-center text-[18px] font-normal">
              {persistedUserInfo?.myArticleStatistics?.totalSharedArticleViews}
            </h5>
          </div>
        </div>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => navigate('/profile/shared-articles')}>
            View all shared articles
          </Button>
        </div>
      </SummaryCard>
      {/* Other Links */}
      <div className="mt-[2px] flex w-full flex-col gap-3 tablet:gap-[15px]">
        <Link
          to="/profile/user-settings"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline dark:text-blue-600 tablet:text-[16px]"
        >
          User Settings {'>'}
        </Link>
        <Link
          to="/profile/ledger"
          className="text-[12px] font-medium leading-normal text-[#4A8DBD] hover:underline dark:text-blue-600 tablet:text-[16px]"
        >
          My Activity {'>'}
        </Link>
      </div>
    </div>
  );
};

export default Summary;
