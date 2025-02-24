import { useSelector } from 'react-redux';
import { formatCountNumber } from '../../../utils/utils';

const SidebarRight = ({ userData }) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  // const userData = useSelector((state) => state.auth.user);

  const sidebarList = [
    {
      id: 1,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon1.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon11.svg`,
      alt: 'icon1',
      title: 'Posts-Created',
      value: (userData && userData?.questsCreated) || 0,
    },
    {
      id: 2,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon2.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon12.svg`,
      alt: 'icon1',
      title: 'Posts-Engaged',
      value: (userData && userData?.yourPostEngaged) || 0,
    },
    {
      id: 3,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/your-post-engaged.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/your-post-engaged.svg`,
      alt: 'your-post-engaged',
      title: 'Your Posts-Engaged',
      value: (userData && userData?.usersAnswered) || 0,
    },
    {
      id: 4,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/couter-eye.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/couter-eye.svg`,
      alt: 'your-post-hidden',
      title: 'Your Posts-Hidden',
      value: (userData && userData?.yourHiddenPostCounter) || 0,
    },
    // {
    //   id: 3,
    //   icon: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/wronganswers.svg`},
    //   iconLight: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/correntans.svg`},
    //   alt: "icon1",
    //   title: "Correct Answers",
    //   value: (response && response?.correctAnswer) || 0,
    // },
    // {
    //   id: 4,
    //   icon: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/correctanswers.svg`},
    //   iconLight: {`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/wrongans.svg`},
    //   alt: "icon1",
    //   title: "Wrong Answers",
    //   value: (response && response?.wrongAnswers) || 0,
    // },
    {
      id: 5,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon5.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon15.svg`,
      alt: 'icon1',
      title: 'Selections-Changed',
      value: (userData && userData?.changedAnswers) || 0,
    },
    {
      id: 6,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon6.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon16.svg`,
      alt: 'icon1',
      title: 'Options-Added',
      value: (userData && userData?.addedAnswers) || 0,
    },
    {
      id: 7,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon7.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/working.png`,
      alt: 'icon1',
      title: 'Agreement-Received',
      value: (userData && userData?.selectionsOnAddedAns) || 0,
    },
    {
      id: 8,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon8.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon18.svg`,
      alt: 'icon1',
      title: 'Objections-Received',
      value: (userData && userData?.contentionsOnAddedAns) || 0,
    },
    {
      id: 9,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon9.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon19.svg`,
      alt: 'icon1',
      title: 'Objections-Given',
      value: (userData && userData?.contentionsGiven) || 0,
    },
    {
      id: 10,
      icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/last.svg`,
      iconLight: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/icon20.svg`,
      alt: 'icon1',
      title: 'Code of Conduct-Fails',
      value: (userData && userData?.violationCounter) || 0,
    },
  ];

  return (
    <div
      className={`${userData && (userData.role === 'guest' || persistedUserInfo?.role === 'visitor') && location.pathname === '/' ? 'hidden' : 'my-5 hidden h-fit max-h-[calc(100vh-96px)] w-[18.75rem] min-w-[18.75rem] overflow-y-auto rounded-[15px] bg-white py-[25px] pl-[1.3rem] pr-[2.1rem] no-scrollbar dark:bg-[#000] tablet:my-[15px] laptop:block'} `}
    >
      <p className="font-inter mb-[25px] text-center text-[10.79px] font-medium leading-[18px] text-[#616161] dark:text-[#D2D2D2] tablet:text-[18px]">
        My Contributions
      </p>
      {sidebarList.map((item) => (
        <div className={`flex items-center gap-4 ${item.id !== 1 && 'mt-[1.6vh]'}`} key={item.id}>
          {persistedTheme === 'dark' ? (
            <img src={item.icon} alt={item.alt} className="h-10 w-10" />
          ) : (
            <img src={item.iconLight} alt={item.alt} className="h-10 w-10" />
          )}

          <div className="text-gray-1 flex w-full items-center justify-between text-[14px] font-medium leading-5 dark:text-[#878787]">
            <div>
              <h5>{item.title?.split('-')[0]}</h5>
              <h5>{item.title?.split('-')[1]}</h5>
            </div>
            <h5 className="text-[22px] font-semibold">{formatCountNumber(item.value)}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SidebarRight;
