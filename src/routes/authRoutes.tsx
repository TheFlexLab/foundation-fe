import { Navigate } from 'react-router-dom';
import Guests from '../pages/Guests';
import RequireAuth from './RequireAuth';
import SingleQuest from '../pages/SingleQuest';
import Dashboard from '../pages/Dashboard';
import VerifyEmail from '../pages/Signup/VerifyEmail';
import Profile from '../pages/Dashboard/pages/Profile';
import Contributions from '../pages/Dashboard/pages/Profile/pages/Contributions';
import VerificationBadges from '../pages/Dashboard/pages/Profile/pages/VerificationBadges';
import HiddenPosts from '../pages/Dashboard/pages/Profile/pages/HiddenPosts';
import SharedLinks from '../pages/Dashboard/pages/Profile/pages/SharedLinks';
import BasicTable from '../pages/Dashboard/pages/Profile/pages/Ledger';
import ChangePassword from '../pages/Dashboard/pages/Profile/pages/ChangePassword';
import QuestStartSection from '../pages/Dashboard/pages/QuestStartSection';
import VerifyCode from '../pages/Signup/VerifyCode';
import BadgeVerifyCode from '../pages/Signup/BadgeVerifyCode';
import About from '../pages/Dashboard/pages/CustomerSupport/About';
import Faq from '../pages/Dashboard/pages/CustomerSupport/Faq';
import TermsOfService from '../pages/Dashboard/pages/CustomerSupport/TermsOfService';
import PrivacyPolicy from '../pages/Dashboard/pages/CustomerSupport/PrivacyPolicy';
import ContactUs from '../pages/Dashboard/pages/CustomerSupport/ContactUs';
import CustomerSupport from '../pages/Dashboard/pages/CustomerSupport';
import Welcome from '../pages/Welcome/welcome';
import SharedLinkResults from '../pages/Dashboard/pages/Profile/pages/shared-links/SharedLinkResults';
import UserSettings from '../pages/Dashboard/pages/Profile/pages/UserSettings';
import Feedback from '../pages/Dashboard/pages/Profile/pages/feedback';
import PostsByList from '../pages/Dashboard/pages/Collection/PostsByList';
import SharedListResults from '../pages/Dashboard/pages/Collection/SharedListResults';
import Summary from '../pages/Dashboard/pages/Profile/pages/summary';
// import TermOfService from '../pages/Signup/pages/TermOfService';
// QUESTS
import Quest from '../pages/Dashboard/pages/Quest/Quest';
import YesNo from '../pages/Dashboard/pages/Quest/pages/YesNo';
import OpenChoice from '../pages/Dashboard/pages/Quest/pages/OpenChoice';
import RankChoice from '../pages/Dashboard/pages/Quest/pages/RankChoice';
import AgreeDisagree from '../pages/Dashboard/pages/Quest/pages/AgreeDisagree';
import LikeDislike from '../pages/Dashboard/pages/Quest/pages/LikeDislikeQuest';
import PreviewPost from '../pages/Dashboard/pages/Quest/pages/PreviewPost';
// TREASURY
import TreasuryLayout from '../pages/Dashboard/pages/Treasury/TreasuryLayout';
import TreasurySummary from '../pages/Dashboard/pages/Treasury/pages/TreasurySummary';
import RewardSchedule from '../pages/Dashboard/pages/Treasury/pages/RewardSchedule';
import BuyFDX from '../pages/Dashboard/pages/Treasury/pages/BuyFDX';
import RedemptionCenter from '../pages/Dashboard/pages/Treasury/pages/RedemptionCenter';
import Ledger from '../pages/Dashboard/pages/Treasury/pages/Ledger';
// TEST
import Test from '../components/Test';
// import SignUpPrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';
import Authenticating from '../components/Authenticating';
import MultipleChoice from '../pages/Dashboard/pages/Quest/pages/MultipleChoice';
import EmbedPost from '../pages/Embed/EmbedPost';
import Iframe from '../pages/Embed/Iframe';
import VerifyPhone from '../pages/Signup/VerifyPhone';
import DirectMessaging from '../pages/features/DirectMessaging';
import DirectMessageLayout from '../pages/features/DirectMessaging/DirectMessageLayout';
import NewMessageForm from '../pages/features/DirectMessaging/components/NewMessageForm';
import SeldonAi from '../pages/features/seldon-ai';
import SeldonAiLayout from '../pages/features/seldon-ai/SeldonAiLayout';
import SeldonView from '../pages/features/seldon-ai/SeldonView';
import NewsFeedLayout from '../pages/features/news-feed/NewsFeedLayout';
import NewsFeed from '../pages/features/news-feed';
import DMPreview from '../pages/features/DirectMessaging/DMPreview';
import Collection from '../pages/Dashboard/pages/Collection';

const authRoutes = [
  {
    element: <RequireAuth allowedRoles={['user', 'guest', 'visitor']} />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
        children: [
          { path: '', element: <QuestStartSection /> },
          {
            path: 'news',
            element: <NewsFeedLayout />,
            children: [{ path: '', element: <NewsFeed /> }],
          },
          {
            path: 'post',
            element: <Quest />,
            children: [
              { path: '', element: <MultipleChoice /> },
              { path: 'agree-disagree', element: <AgreeDisagree /> },
              { path: 'yes-no', element: <YesNo /> },
              { path: 'like-dislike', element: <LikeDislike /> },
              { path: 'open-choice', element: <OpenChoice /> },
              { path: 'ranked-choice', element: <RankChoice /> },
            ],
          },
          {
            path: 'profile',
            element: <RequireAuth allowedRoles={['user']} />,
            children: [
              {
                element: <Profile />,
                children: [
                  { path: '', element: <Summary /> },
                  { path: 'verification-badges', element: <VerificationBadges /> },
                  { path: 'post-activity', element: <Contributions /> },
                  { path: 'collections', element: <Collection /> },
                  { path: 'postsbylist/:categoryId', element: <PostsByList /> },
                  { path: 'ledger', element: <BasicTable /> },
                  { path: 'feedback-given', element: <HiddenPosts /> },
                  { path: 'feedback', element: <Feedback /> },
                  { path: 'shared-links', element: <SharedLinks /> },
                  { path: 'user-settings', element: <UserSettings /> },
                  { path: 'change-password', element: <ChangePassword /> },
                ],
              },
            ],
          },
          {
            path: 'treasury',
            element: <TreasuryLayout />,
            children: [
              { path: '', element: <TreasurySummary /> },
              { path: 'reward-schedule', element: <RewardSchedule /> },
              { path: 'buy-fdx', element: <BuyFDX /> },
              { path: 'redemption-center', element: <RedemptionCenter /> },
              { path: 'ledger', element: <Ledger /> },
            ],
          },
          {
            path: 'direct-messaging',
            element: <DirectMessageLayout />,
            children: [
              { path: '', element: <DirectMessaging /> },
              { path: 'new-message', element: <NewMessageForm /> },
              { path: 'preview', element: <DMPreview /> },
              { path: '*', element: <DirectMessaging /> },
            ],
          },
          {
            path: 'help',
            element: <CustomerSupport />,
            children: [
              { path: 'about', element: <About /> },
              { path: 'faq', element: <Faq /> },
              { path: 'terms-of-service', element: <TermsOfService /> },
              { path: 'privacy-policy', element: <PrivacyPolicy /> },
              { path: 'contact-us', element: <ContactUs /> },
            ],
          },
          {
            path: 'seldon-ai',
            element: <RequireAuth allowedRoles={['user']} />,
            children: [
              {
                element: <SeldonAiLayout />,
                children: [{ path: '', element: <SeldonAi /> }],
              },
            ],
          },
          // Unknown Route
          {
            path: 'treasury/:code',
            element: <TreasuryLayout />,
            children: [
              { path: '', element: <TreasurySummary /> },
              { path: 'reward-schedule', element: <RewardSchedule /> },
              { path: 'buy-fdx', element: <BuyFDX /> },
              { path: 'redemption-center', element: <RedemptionCenter /> },
              { path: 'ledger', element: <Ledger /> },
            ],
          },
        ],
      },
      { path: '/p/:id', element: <SingleQuest /> },
      { path: '/iframe', element: <Iframe /> },
      { path: '/embed/:link', element: <EmbedPost /> },
      { path: '/authenticating', element: <Authenticating /> },
      // { path: '/term-of-service', element: <TermOfService /> },
      // { path: '/privacy-policy', element: <SignUpPrivacyPolicy /> },
      { path: '/r/:id', element: <SeldonView /> },
      { path: '/p/:id', element: <SingleQuest /> },
      { path: '/l/:id', element: <PostsByList /> },
      { path: '/post-preview', element: <PreviewPost /> },
      { path: '/verify-email', element: <VerifyEmail /> },
      { path: '/post/:isFullScreen', element: <Guests /> },
      { path: '/badgeverifycode', element: <BadgeVerifyCode /> },
      { path: '/verifycode', element: <VerifyCode /> },
      { path: '/verify-phone', element: <VerifyPhone /> },
      { path: '/shared-links/result', element: <SharedLinkResults /> },
      { path: '/shared-collection-link/result', element: <SharedListResults /> },
      { path: '/test', element: <Test /> },
    ],
  },
  // { path: '/welcome', element: <Welcome /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default authRoutes;
