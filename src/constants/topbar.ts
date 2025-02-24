export const TopbarItems = [
  {
    id: 1,
    title: 'Profile',
    path: '/profile',
    signupPath: '/guest-signup',
    activePaths: [
      '/profile',
      '/profile/verification-badges',
      '/profile/post-activity',
      '/profile/feedback',
      '/profile/ledger',
      '/profile/feedback-given',
      '/profile/shared-links',
      '/profile/user-settings',
      '/profile/collections',
      '/profile',
    ],
    icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/profile.svg`,
    iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/profile-filled.svg`,
    signupIcon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/signup.svg`,
  },
  // {
  //   id: 2,
  //   title: 'Treasury',
  //   path: '/treasury',
  //   activePaths: [
  //     '/treasury',
  //     '/treasury/reward-schedule',
  //     '/treasury/buy-fdx',
  //     '/treasury/redemption-center',
  //     '/treasury/ledger',
  //   ],
  //   icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/treasury_logo_unselected.svg`,
  //   iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/treasury_logo_selected.svg`,
  // },
  {
    id: 5,
    title: 'Chat',
    path: '/direct-messaging',
    activePaths: [
      '/direct-messaging',
      '/direct-messaging/sent',
      '/direct-messaging/deleted',
      '/direct-messaging/draft',
      '/direct-messaging/new-message',
    ],
    icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/chat.svg`,
    iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/chat-active.svg`,
  },
  // {
  //   id: 4,
  //   title: 'Faqs',
  //   path: '/help/about',
  //   activePaths: ['/help/about', '/help/faq', '/help/terms-of-service', '/help/privacy-policy', '/help/contact-us'],
  //   icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/faq.svg`,
  //   iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/faq-filled.svg`,
  // },
  // {
  //   id: 6,
  //   title: 'Seldon',
  //   path: '/seldon-ai',
  //   activePaths: ['/seldon-ai'],
  //   icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/seldon.svg`,
  //   iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/seldon.svg`,
  // },
];

export const MobileTopbarItems = [
  {
    id: 1,
    title: 'Profile',
    path: '/profile',
    signupPath: '/guest-signup',
    activePaths: [
      '/profile',
      '/profile/verification-badges',
      '/profile/post-activity',
      '/profile/feedback',
      '/profile/ledger',
      '/profile/feedback-given',
      '/profile/shared-links',
      '/profile/user-settings',
      '/profile/collections',
      '/profile',
    ],
    icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/profile.svg`,
    iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/profile-filled.svg`,
    signupIcon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/signup.svg`,
  },
  {
    id: 2,
    title: 'Chat',
    path: '/direct-messaging',
    activePaths: [
      '/direct-messaging',
      '/direct-messaging/sent',
      '/direct-messaging/deleted',
      '/direct-messaging/draft',
      '/direct-messaging/new-message',
    ],
    icon: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/chat.svg`,
    iconSelected: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/topbar/chat-active.svg`,
  },
];
