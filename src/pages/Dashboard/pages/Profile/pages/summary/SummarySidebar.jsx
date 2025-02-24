import { Link } from 'react-router-dom';
import { setGuestSignUpDialogue } from '../../../../../../features/extras/extrasSlice';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

const SummarySidebar = ({ userData }) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const yourPosts = [
    { id: 1, title: 'Posts you’ve created', val: (userData && userData?.questsCreated) || 0 },
    { id: 2, title: 'Engagements with your posts', val: (userData && userData?.yourPostEngaged) || 0 },
    { id: 3, title: 'Objections received', val: (userData && userData?.contentionsOnAddedAns) || 0 },
    { id: 4, title: 'Agreements received', val: (userData && userData?.selectionsOnAddedAns) || 0 },
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
      text: 'See why your posts were <br />hidden >',
    },
  ];

  const othersPosts = [
    {
      id: 1,
      title: 'Posts you’ve engaged with',
      val: (userData && userData?.questsActivity?.myQuestsEngagementCount) || 0,
    },
    { id: 2, title: 'Options added', val: (userData && userData?.addedAnswers) || 0 },
    { id: 3, title: 'Changing my option', val: (userData && userData?.changedAnswers) || 0 },
    { id: 4, title: 'Objections given', val: (userData && userData?.contentionsGiven) || 0 },
    {
      id: 5,
      title: 'Feedback Given',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.feedbackGiven) || 0,
      link: '/profile/feedback-given',
      text: 'Go to Feedback Given >',
    },
    {
      id: 6,
      title: 'Posts I have hidden',
      val: (persistedUserInfo && persistedUserInfo?.questsActivity?.myHiddenQuestsCount) || 0,
      link: '/profile/feedback-given',
      text: `View posts you've hidden <br/> and why >`,
    },
  ];

  return (
    <div>
      <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white px-6 py-[23px] dark:border-gray-100 dark:bg-gray-200 tablet:dark:border laptop:block">
        <h1 className="text-[18px] font-semibold text-blue-100 dark:text-white-100">Your posts</h1>
        <div className="mt-5 flex flex-col gap-[17px]">
          {yourPosts.map((item) => (
            <React.Fragment key={item.id}>
              <div className="text-gray flex items-center justify-between dark:text-white-100">
                <p className="max-w-[180px] text-[16px] font-medium leading-[118.75%]">{item.title}</p>
                <p className="text-[16px] font-medium leading-[118.75%]">{item.val}</p>
              </div>
              <Link
                to={item.link}
                onClick={(e) => {
                  if (persistedUserInfo?.role !== 'user') {
                    e.preventDefault();
                    dispatch(setGuestSignUpDialogue(true));
                  }
                }}
                className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-100 hover:underline dark:text-blue-600 tablet:-mt-3"
              >
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Other posts */}
      <div className="mr-[31px] mt-[15px] hidden h-fit w-[18.75rem] min-w-[18.75rem] rounded-[15px] bg-white px-6 py-[23px] dark:border-gray-100 dark:bg-gray-200 tablet:dark:border laptop:block">
        <h1 className="text-[18px] font-semibold text-blue-100 dark:text-white-100">Others Posts</h1>
        <div className="mt-5 flex flex-col gap-[17px]">
          {othersPosts.map((item) => (
            <React.Fragment key={item.id}>
              <div className="text-gray flex items-center justify-between dark:text-white-100">
                <p className="max-w-[180px] text-[16px] font-medium leading-[118.75%]">{item.title}</p>
                <p className="text-[16px] font-medium leading-[118.75%]">{item.val}</p>
              </div>
              <Link
                to={item.link}
                onClick={(e) => {
                  if (persistedUserInfo?.role !== 'user') {
                    e.preventDefault();
                    dispatch(setGuestSignUpDialogue(true));
                  }
                }}
                className="cursor-pointer text-[14px] font-normal leading-[121.4%] text-blue-100 hover:underline dark:text-blue-600 tablet:-mt-3"
              >
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummarySidebar;
