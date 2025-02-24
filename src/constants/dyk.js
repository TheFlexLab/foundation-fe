// export const dyk = {
//   id: 'system_notification',
//   header: 'Posting on Foundation',
//   text: [
//     'Foundation uses Artificial intelligence (AI) to help refine the posts you write. Each post must be unique - either by statement/question, or by the media you share. If the AI is frustrating you, try framing your statement, question or options differently!',
//   ],
//   buttonText: '',
//   buttonUrl: '',
//   youtubeEmbedUrl: '',
//   category: 'createPost',
//   mode: 'User, Guest',
//   priority: 2,
//   timestamp: new Date().toISOString(),
// };

export const dyk = [
  {
    id: 'system_notification1',
    header: 'All Posts Are Anonymous!',
    text: [
      `All posts on Foundation are fully anonymous! To ensure meaningful responses, always provide proper context. Posts lacking context may be suppressed.`,
      'Example:',
      '✗ Don’t say: Have you ever bought anything from one of my links?',
      '✓ Do say: Have you ever bought anything from a link shared by an influencer on social media?',
    ],
    buttonText: '',
    buttonUrl: '',
    youtubeEmbedUrl: '',
    show: 'ALL Only on Create Post',
    category: 'createPost',
    mode: 'User, Guest',
    priority: 2,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'system_notification2',
    header: 'Ensuring Quality and Safety in Your Posts',
    text: [
      'Foundation enhances your posting experience by correcting spelling and grammar while screening for hate speech, violence, self-harm, harassment, and extreme content. Posts violating these guidelines may be rejected, leading to a Code of Conduct failure. Some content may be marked as Adult, limiting visibility to users who enable this feature. Please align your contributions with our community standards for a constructive environment.',
    ],
    buttonText: '',
    buttonUrl: '',
    youtubeEmbedUrl: '',
    show: 'ALL Only on Create Post',
    category: 'createPost',
    mode: 'User, Guest',
    priority: 2,
    timestamp: new Date().toISOString(),
  },
];
