export const createQuestItems = [
  { id: 0, title: 'Multiple Choice', path: '/post' },
  { id: 1, title: 'Open Choice', path: '/post/open-choice' },
  { id: 2, title: 'Ranked Choice', path: '/post/ranked-choice' },
  { id: 3, title: 'Like/Dislike', path: '/post/like-dislike' },
  { id: 4, title: 'Agree/Disagree', path: '/post/agree-disagree' },
  { id: 5, title: 'Yes/No', path: '/post/yes-no' },
];

export const profileItems = [
  // { id: 8, title: 'Summary', path: '/profile', to: '' },
  // { id: 9, title: 'Home Page', path: '/profile/me', to: '' },
  { id: 9, title: 'Home Page', path: '/profile', to: '' },
  { id: 4, title: 'Shared Posts', path: '/profile/shared-links', to: 'shared-links' },
  { id: 7, title: 'My Collections', path: '/profile/collections', to: 'collections' },
  { id: 10, title: 'Shared Articles', path: '/profile/shared-articles', to: 'shared-articles' },
  { id: 1, title: 'Verification Badges', path: '/profile/verification-badges', to: '' },
  { id: 0, title: 'Post Activity', path: '/profile/post-activity', to: 'post-activity' },
  { id: 3, title: 'Feedback Given', path: '/profile/feedback-given', to: 'hidden-posts' },
  { id: 6, title: 'Feedback Received', path: '/profile/feedback', to: 'feedback' },
  { id: 5, title: 'User Settings', path: '/profile/user-settings', to: 'user-settings' },
  { id: 2, title: 'My Activity', path: '/profile/ledger', to: 'ledger' },
];

export const treasuryItems = [
  // { id: 0, title: 'Summary', path: '/treasury' },
  // { id: 1, title: 'Rewards & Fees', path: '/treasury/reward-schedule' },
  { id: 1, title: 'Rewards & Fees', path: '/treasury' },
  // { id: 2, title: 'Buy FDX', path: '/treasury/buy-fdx' },
  // { id: 3, title: 'Redemption center', path: '/treasury/redemption-center' },
  { id: 4, title: 'Treasury Activity', path: '/treasury/ledger' },
  { id: 5, title: 'Withdrawals', path: '/treasury/withdrawls' },
  { id: 6, title: 'Deposits', path: '/treasury/deposits' },
];

export const helpItems = [
  { id: 1, title: 'About', path: '/help/about' },
  { id: 2, title: "FAQ's", path: '/help/faq' },
  { id: 3, title: 'Terms of Service', path: '/help/terms-of-service' },
  { id: 4, title: 'Privacy Policy', path: '/help/privacy-policy' },
  { id: 5, title: 'Contact Us', path: '/help/contact-us' },
];

export const DMItems = [
  { id: 1, title: 'Received', path: '/direct-messaging' },
  { id: 2, title: 'Sent', path: '/direct-messaging/sent' },
  { id: 3, title: 'Deleted', path: '/direct-messaging/deleted' },
  { id: 4, title: 'Draft', path: '/direct-messaging/draft' },
];
