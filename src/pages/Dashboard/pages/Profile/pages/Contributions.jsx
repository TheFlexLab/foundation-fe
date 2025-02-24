import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SummaryCard from '../../../../../components/SummaryCard';
import ContentCard from '../../../../../components/ContentCard';

const Contributions = () => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  useEffect(() => {
    queryClient.invalidateQueries(['userInfo']);
  }, []);

  const yourPosts = [
    { id: 1, title: 'Posts you’ve created', val: (persistedUserInfo && persistedUserInfo?.questsCreated) || 0 },
    {
      id: 2,
      title: 'Engagements with your posts',
      val: (persistedUserInfo && persistedUserInfo?.yourPostEngaged) || 0,
    },
    { id: 3, title: 'Objections received', val: (persistedUserInfo && persistedUserInfo?.contentionsOnAddedAns) || 0 },
    { id: 4, title: 'Agreements received', val: (persistedUserInfo && persistedUserInfo?.selectionsOnAddedAns) || 0 },
    {
      id: 5,
      title: 'Feedback Received',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.feedbackReceived) || 0,
      link: '/profile/feedback',
      text: 'Go to Feedback Received >',
    },
    {
      id: 6,
      title: 'My posts hidden by users',
      val: (persistedUserInfo && persistedUserInfo?.feedBackQuestsStatistics?.otherHidingOurQuestsCount) || 0,
      link: '/profile/feedback',
      text: 'See why your posts were hidden >',
    },
  ];

  const othersPosts = [
    {
      id: 1,
      title: 'Posts you’ve engaged with',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.myQuestsEngagementCount) || 0,
    },
    { id: 2, title: 'Options added', val: (persistedUserInfo && persistedUserInfo?.addedAnswers) || 0 },
    { id: 3, title: 'Changing my option', val: (persistedUserInfo && persistedUserInfo?.changedAnswers) || 0 },
    { id: 4, title: 'Objections given', val: (persistedUserInfo && persistedUserInfo?.contentionsGiven) || 0 },
    {
      id: 5,
      title: 'Feedback Given',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.feedbackGiven) || 0,
      link: '/profile/feedback-given',
      text: 'Go to Feedback Given >',
    },
    {
      id: 5,
      title: 'Posts I have hidden',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.myHiddenQuestsCount) || 0,
      link: '/profile/feedback-given',
      text: `View posts you've hidden and why >`,
    },
  ];

  return (
    <>
      <div className="mx-4 mb-4 flex max-w-[778px] flex-col gap-[15px] overflow-y-auto tablet:mx-6">
        {/* Summary Section */}
        <SummaryCard headerIcon="/assets/summary/post-activity-logo2.svg" headerTitle="Post Activity">
          <h1 className="summary-text">Track your engagement and influence within the Foundation community.</h1>
          <div className="mt-3 flex items-center justify-center gap-6 tablet:mt-5">
            <div className="max-w-28 border-r border-[#707175] pr-6 tablet:max-w-full">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Posts you've created
              </h1>
              <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.questsCreated}</h5>
            </div>
            <div className="max-w-24 tablet:max-w-full">
              <h1 className="text-center text-[12px] font-semibold leading-[116%] tablet:text-[16px] tablet:leading-normal">
                Engagements with your posts
              </h1>
              <h5 className="text-center text-[18px] font-normal">{persistedUserInfo?.yourPostEngaged}</h5>
            </div>
          </div>
        </SummaryCard>

        {/* <div
        className={`${
          persistedTheme === 'dark' ? 'dark-shadow-inside border-2 border-[#858585] dark:border-white' : 'shadow-inside'
        } relative ml-[42px] mr-[59px] hidden h-[183px] rounded-[45px] laptop:block`}
      >
        <div className="absolute -top-7 left-[50%] flex w-full -translate-x-[50%] transform gap-[10px] px-[10px] 2xl:justify-center">
          {list?.map((item) => (
            <div className="w-full" key={item.id}>
              <div className="flex flex-col items-center justify-center text-gray-1 dark:text-white">
                <img
                  src={persistedTheme === 'dark' ? item.icon : item.iconLight}
                  alt={item.alt}
                  className="mb-3 h-[49px] w-[49px]"
                />
                <h4 className="text-center text-[14.72px] font-semibold leading-[17.8px]">
                  {item.title.split('-')[0]}
                </h4>
                <h4 className="mb-6 text-center text-[14.72px] font-semibold leading-[17.8px]">
                  {item.title.split('-')[1]}
                </h4>
                <h1 className="text-center text-[28px] font-semibold leading-[11.45px]">
                  {formatCountNumber(item.value)}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div> */}
        {/* <div className="flex flex-col gap-[30px] tablet:gap-16 laptop:hidden">
        <div
          className={`${
            persistedTheme === 'dark' ? 'dark-shadow-inside border-[1px] border-[#858585]' : 'shadow-inside'
          } relative mx-[18px] h-[82px] rounded-[11.4px] border-[#858585] tablet:mx-[42px] tablet:h-[183px] tablet:rounded-[45px] tablet:border-[2px]`}
        >
          <div className="absolute -top-3 left-[50%] flex w-full -translate-x-[50%] transform gap-2 px-[10px] tablet:-top-7">
            {firstHalf?.map((item) => (
              <div className="w-full" key={item.id}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={persistedTheme === 'dark' ? item.icon : item.iconLight}
                    alt={item.alt}
                    className="mb-[7px] h-[23px] w-[23px] tablet:mb-[18px] tablet:h-[60px] tablet:w-[50px]"
                  />
                  <h4 className="text-center text-[8px] font-semibold leading-[9.68px] text-gray-1 tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[0]}
                  </h4>
                  <h4 className="mb-[10px] text-center text-[8px] font-semibold leading-[9.68px] text-gray-1 tablet:mb-6 tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[1]}
                  </h4>
                  <h1 className="text-center text-[16px] font-semibold leading-[14px] text-gray-1 2xl:text-[35px] tablet:text-[24px] dark:text-[#B8B8B8]">
                    {formatCountNumber(item.value)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={`${
            persistedTheme === 'dark' ? 'dark-shadow-inside border-[1px] border-[#858585]' : 'shadow-inside'
          } relative mx-[18px] h-[82px] rounded-[11.4px] border-[#858585] tablet:mx-[42px] tablet:h-[183px] tablet:rounded-[45px] tablet:border-[2px]`}
        >
          <div className="absolute -top-3 left-[50%] flex w-full -translate-x-[50%] transform gap-2 px-[10px] tablet:-top-7">
            {secondHalf?.map((item) => (
              <div className="w-full" key={item.id}>
                <div className="flex flex-col items-center justify-center">
                  <img
                    src={persistedTheme === 'dark' ? item.icon : item.iconLight}
                    alt={item.alt}
                    className="mb-[7px] h-[23px] w-[23px] tablet:mb-[18px] tablet:h-[60px] tablet:w-[50px]"
                  />
                  <h4 className="text-center text-[8px] font-semibold leading-[9.68px] text-gray-1 tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[0]}
                  </h4>
                  <h4 className="mb-[10px] text-center text-[8px] font-semibold leading-[9.68px] text-gray-1 tablet:mb-6 tablet:text-[18px] tablet:leading-[25px] dark:text-[#B8B8B8]">
                    {item.title.split('-')[1]}
                  </h4>
                  <h1 className="text-center text-[16px] font-semibold leading-[14px] text-gray-1 2xl:text-[35px] tablet:text-[24px] dark:text-[#B8B8B8]">
                    {formatCountNumber(item.value)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      </div>
      <ContentCard
        icon={
          persistedUserInfo.role === 'user' ? 'assets/svgs/dashboard/MeBadge.svg' : 'assets/svgs/dashboard/badge.svg'
        }
        title="Your Posts"
        badgeVal={persistedUserInfo?.badges?.length}
        from={persistedUserInfo?.badges.length}
      >
        <div className="flex flex-col gap-2 rounded-b-[10px] py-[10px] tablet:gap-[25px] tablet:p-[5px]">
          {yourPosts.map((item) => (
            <>
              <div key={item.id} className="text-gray flex items-center justify-between dark:text-white-100">
                <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.title}</h4>
                <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.val}</h4>
              </div>
              <Link
                to={item.link}
                className="-mt-2 cursor-pointer text-[9px] font-normal leading-[119%] text-blue-100 hover:underline dark:text-blue-600 tablet:-mt-6 tablet:text-[14px] tablet:leading-[121.4%]"
              >
                {item.text}
              </Link>
            </>
          ))}
        </div>
      </ContentCard>
      <ContentCard
        icon="assets/badge_icon.png"
        title="Other Posts"
        badgeVal={persistedUserInfo?.badges?.length}
        from={persistedUserInfo?.badges.length}
      >
        <div className="flex flex-col gap-2 rounded-b-[10px] py-[10px] tablet:gap-[25px] tablet:p-[5px]">
          {othersPosts.map((item) => (
            <>
              <div key={item.id} className="text-gray flex items-center justify-between dark:text-white-100">
                <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.title}</h4>
                <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">{item.val}</h4>
              </div>
              <Link
                to={item.link}
                className="-mt-2 cursor-pointer text-[9px] font-normal leading-[119%] text-blue-100 hover:underline dark:text-blue-600 tablet:-mt-6 tablet:text-[14px] tablet:leading-[121.4%]"
              >
                {item.text}
              </Link>
            </>
          ))}
        </div>
      </ContentCard>
      <ContentCard icon="assets/post-activity/coc-icon.svg" title="Code of Conduct">
        <div className="flex flex-col gap-2 rounded-b-[10px] py-[10px] tablet:gap-[25px] tablet:p-[5px]">
          <div className="text-gray flex items-center justify-between dark:text-white-100">
            <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">
              Number of code of conduct violations
            </h4>
            <h4 className="text-center text-[12px] font-medium leading-[153%] tablet:text-[18px]">
              {(persistedUserInfo && persistedUserInfo?.violationCounter) || 0}
            </h4>
          </div>
          <Link
            to={'/help/terms-of-service'}
            className="-mt-2 cursor-pointer text-[9px] font-normal leading-[119%] text-blue-100 hover:underline dark:text-blue-600 tablet:-mt-6 tablet:text-[14px] tablet:leading-[121.4%]"
          >
            View code of conduct {'>'}
          </Link>
        </div>
      </ContentCard>
    </>
  );
};

export default Contributions;
