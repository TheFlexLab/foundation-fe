export const analyzeButtons = [
  { id: 1, title: 'Hide Option', name: 'hide' },
  { id: 2, title: 'Filter Counts', name: 'badgeCount' },
  { id: 3, title: 'Filter Target', name: 'target' },
  { id: 4, title: 'Filter Badges', name: 'activity' },
];

export const comparisonOperators = [
  { id: 1, name: 'Greater than' },
  { id: 2, name: 'Less than' },
  { id: 3, name: 'Equal to' },
  { id: 4, name: 'Not equal to' },
];

export const dualOptionsMap: Record<'yes/no' | 'agree/disagree' | 'like/dislike', { id: number; name: string }[]> = {
  'yes/no': [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
  ],
  'agree/disagree': [
    { id: 1, name: 'Agree' },
    { id: 2, name: 'Disagree' },
  ],
  'like/dislike': [
    { id: 1, name: 'Like' },
    { id: 2, name: 'Dislike' },
  ],
};

export const targetDualOptions: Record<
  'yes/no' | 'agree/disagree' | 'like/dislike',
  { id: number; question: string }[]
> = {
  'yes/no': [
    { id: 1, question: 'Yes' },
    { id: 2, question: 'No' },
  ],
  'agree/disagree': [
    { id: 1, question: 'Agree' },
    { id: 2, question: 'Disagree' },
  ],
  'like/dislike': [
    { id: 1, question: 'Like' },
    { id: 2, question: 'Dislike' },
  ],
};

export const activityList = [
  { id: 1, name: 'Twitter' }, // followers > no
  { id: 2, name: 'Date of Birth' }, // from this date to this date
  { id: 3, name: 'Current City' }, // which city
  { id: 4, name: 'Home Town' }, // which hometown
  { id: 5, name: 'Sex' }, // which sex
  { id: 6, name: 'Relationship' }, // which relationship
  { id: 7, name: 'Work' }, // which one of them Company Name / Title / Mode of Job
  { id: 8, name: 'Education' }, // which one of them  School / Degree Program / Field of Study
  // { id: 9, name: 'Security Question' },
  // { id: 10, name: 'Cell Phone' }, // Countries
  // { id: 11, name: 'Personal Email' },
  // { id: 12, name: 'Work Email' },
  // { id: 13, name: 'Education Email' },
  // { id: 14, name: 'Data Encryption' },
  // { id: 15, name: 'LinkedIn' },
  // { id: 16, name: 'Github' },
  // { id: 17, name: 'Farcaster' },
  // { id: 18, name: 'Ethereum Wallet' },
  // { id: 19, name: 'First Name' },
  // { id: 20, name: 'Last Name' },
];
