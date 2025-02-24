import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const navMenuList = [
  // {
  //   title: 'News',
  //   path: '/news',
  //   icon: `/assets/mobilenav/news.svg`,
  //   darkicon: `/assets/mobilenav/news-dark.svg`,
  //   allowedRole: 'public',
  // },
  {
    title: 'Treasury',
    path: '/treasury',
    icon: `/assets/mobilenav/treasury.svg`,
    darkicon: `/assets/mobilenav/treasury-dark.svg`,
    allowedRole: 'public',
  },
  {
    title: 'Verification Badges',
    path: '/profile/verification-badges',
    icon: `/assets/mobilenav/verificationbadges.svg`,
    darkicon: `/assets/mobilenav/verificationbadges-dark.svg`,
  },
  {
    title: 'Feedback Given',
    path: '/profile/feedback-given',
    icon: `/assets/mobilenav/feedback-given.svg`,
    darkicon: `/assets/mobilenav/feedback-given-dark.svg`,
  },
  {
    title: 'Feedback Received',
    path: '/profile/feedback',
    icon: `/assets/mobilenav/feedback-received.svg`,
    darkicon: `/assets/mobilenav/feedback-received-dark.svg`,
  },
  {
    title: 'Shared Posts',
    path: '/profile/shared-links',
    icon: `/assets/mobilenav/sharedpost.svg`,
    darkicon: `/assets/mobilenav/sharedpost-dark.svg`,
  },
  {
    title: 'My Collections',
    path: '/profile/collections',
    icon: `/assets/mobilenav/my-list.svg`,
    darkicon: `/assets/mobilenav/my-list-dark.svg`,
  },
  {
    title: 'Shared Articles',
    path: '/profile/shared-articles',
    icon: `/assets/mobilenav/sharedarticles.svg`,
    darkicon: `/assets/mobilenav/sharedarticles-dark.svg`,
  },
  {
    title: 'Post Activity',
    path: '/profile/post-activity',
    icon: `/assets/mobilenav/post-activity-logo2.svg`,
    darkicon: `/assets/mobilenav/post-activity-logo2-dark.svg`,
  },
  {
    title: 'User Settings',
    path: '/profile/user-settings',
    icon: `/assets/mobilenav/usersetting.svg`,
    darkicon: `/assets/mobilenav/usersetting-dark.svg`,
  },
  {
    title: 'Help',
    path: '/help/about',
    icon: `/assets/mobilenav/help.svg`,
    darkicon: `/assets/mobilenav/help-dark.svg`,
    allowedRole: 'public',
  },
  {
    title: 'Seldon',
    path: 'seldon-ai',
    icon: `/assets/mobilenav/seldon.svg`,
    darkicon: `/assets/mobilenav/seldon-dark.svg`,
  },
];

export default function NavMobileMenu() {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const isUser = persistedUserInfo?.role === 'user';
  const isPseudoBadge = persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));
  const persistedTheme = useSelector((state) => state.utils.theme);
  const location = useLocation();

  useEffect(() => {
    const activeMenu = document.querySelector('[data-headlessui-state="open"]');
    if (activeMenu) {
      document.getElementById('menu-button').click();
    }
  }, [location]);

  return (
    <Menu as="div" className="relative inline-block h-5 text-left tablet:h-8">
      <Menu.Button className="size-5 h-5 min-w-5 tablet:size-8 tablet:min-w-8" id="menu-button">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/hamburger.svg`}
          alt="menu"
          className="size-full"
        />
      </Menu.Button>
      <Menu.Items
        transition="true"
        className="absolute -right-[15px] z-[1000] mt-2 w-48 origin-top-right rounded-bl-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in dark:bg-gray-200 dark:ring-gray-100 tablet:w-60"
      >
        {navMenuList
          .filter((item) => isUser || item.allowedRole === 'public')
          .filter((item) => {
            if (item.title === 'Seldon') return isPseudoBadge;
            return true;
          })
          .map((item, index) => (
            <Menu.Item
              className={`border-b border-b-[#D9D9D9] px-5 py-2 hover:bg-[#F2F3F5] dark:border-b-gray-100 dark:hover:bg-black tablet:py-3 ${
                navMenuList.length === index + 1 ? 'border-b-0' : ''
              }`}
              key={index + 1}
            >
              <Link
                to={item.path}
                className="text-gray-1 flex items-center gap-2 text-[12px] font-semibold leading-normal dark:text-white-400 tablet:text-[16px]"
              >
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}${persistedTheme === 'dark' ? item.darkicon : item.icon}`}
                  alt={item.title}
                  className="size-[17px] tablet:size-6"
                />
                {item.title}
              </Link>
            </Menu.Item>
          ))}
      </Menu.Items>
    </Menu>
  );
}
