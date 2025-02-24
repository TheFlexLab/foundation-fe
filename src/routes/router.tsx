import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RequireAuth from './RequireAuth';

import Guests from '../pages/Guests';
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
import DashboardRedirect from '../pages/DashboardRedirect';
import VerifyCode from '../pages/Signup/VerifyCode';
import BadgeVerifyCode from '../pages/Signup/BadgeVerifyCode';
import About from '../pages/Dashboard/pages/CustomerSupport/About';
import Faq from '../pages/Dashboard/pages/CustomerSupport/Faq';
import TermsOfService from '../pages/Dashboard/pages/CustomerSupport/TermsOfService';
import PrivacyPolicy from '../pages/Dashboard/pages/CustomerSupport/PrivacyPolicy';
import ContactUs from '../pages/Dashboard/pages/CustomerSupport/ContactUs';
import CustomerSupport from '../pages/Dashboard/pages/CustomerSupport';
import GuestRedirect from '../pages/DashboardRedirect/GuestRedirect';
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
import Unsubscribe from '../pages/Emails/Unsubscrbe';
import Withdraws from '../pages/Dashboard/pages/Treasury/pages/withdraws';
import Deposits from '../pages/Dashboard/pages/Treasury/pages/deposits';
import UserProfile from '../pages/UserProfile';
import { OtherProfiles } from '../pages/UserProfile/OtherProfiles';
import OtherProfilesLayout from '../pages/UserProfile/OtherProfilesLayout';
import PublicProfile from '../pages/UserProfile/PublicProfile';
import SharedArticles from '../pages/Dashboard/pages/Profile/pages/share-articles/SharedArticles';
import Test from '../components/Test';
import Collection from '../pages/Dashboard/pages/Collection';

export const getSubDomain = (location: string) => {
  const locationParts = location.split('.');

  const isLocalHost = locationParts.slice(-1)[0] === 'localhost';
  const isDevelopmentDomain = location.endsWith('development.on.foundation');
  const isFoundationDomain = location.endsWith('on.foundation');
  const isWWWSubdomain = location.startsWith('www.');

  // Check if it's a bare localhost or on.foundation or development.on.foundation
  if (isWWWSubdomain) {
    return 'www';
  }

  if (isLocalHost && locationParts.length === 1) {
    return '';
  }

  if (isDevelopmentDomain && locationParts.length === 3) {
    return ''; // Return empty for development.on.foundation
  }

  if (isFoundationDomain && locationParts.length === 2) {
    return ''; // Return empty for on.foundation
  }

  // If anything precedes these, return the subdomain
  if (isLocalHost || isDevelopmentDomain || isFoundationDomain) {
    return locationParts.slice(0, locationParts.length - (isLocalHost ? 1 : isDevelopmentDomain ? 3 : 2)).join('.');
  }

  return '';
};

export function Router() {
  const subDomain = getSubDomain(window.location.hostname);

  if (subDomain === 'www') {
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}`;
  }
  if (subDomain !== '' && subDomain !== 'www') {
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/h/${subDomain}`;
  }

  const persistedUser = useSelector((state: any) => state.auth.user);
  const ROLES = {
    User: 'user',
    Guest: 'guest',
    Visitor: 'visitor',
  };

  return (
    <>
      {!persistedUser?.uuid ? (
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem('userExist') === 'true' ? <Navigate to="/" /> : <GuestRedirect redirectUrl="/" />
            }
          />
          <Route path="/iframe" element={<Iframe />} />
          <Route path="/embed/:link" element={<EmbedPost />} />
          {/* <Route path="/term-of-service" element={<TermOfService />} /> */}
          {/* <Route path="/privacy-policy" element={<SignUpPrivacyPolicy />} /> */}
          <Route path="/verifycode" element={<VerifyCode />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/auth0" element={<DashboardRedirect />} />
          <Route path="/p/:id/:fid?" element={<GuestRedirect redirectUrl={null} />} />
          <Route path="/l/:id" element={<GuestRedirect redirectUrl={null} />} />
          <Route path="/r/:id" element={<GuestRedirect redirectUrl={null} />} />
          <Route path="/h/:domain" element={<GuestRedirect redirectUrl={null} />} />
          <Route path="/treasury/:code" element={<Navigate to="/" state={{ from: '/treasury/:code' }} />} />
          <Route path="/authenticating" element={<Authenticating />} />
          {/* <Route path="/tiktok" element={<Test />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Guest, ROLES.Visitor]} />}>
            <Route path="/iframe" element={<Iframe />} />
            <Route path="/embed/:link" element={<EmbedPost />} />
            <Route path="/authenticating" element={<Authenticating />} />
            {/* <Route path="/term-of-service" element={<TermOfService />} /> */}
            {/* <Route path="/privacy-policy" element={<SignUpPrivacyPolicy />} /> */}
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/test" element={<Test />} />
            <Route path="/" element={<Dashboard />}>
              <Route path="" element={<QuestStartSection />} />
              <Route path="help/" element={<CustomerSupport />}>
                <Route path="about" element={<About />} />
                <Route path="faq" element={<Faq />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="contact-us" element={<ContactUs />} />
              </Route>
              <Route path="post" element={<Quest />}>
                <Route path="" element={<MultipleChoice />} />
                <Route path="agree-disagree" element={<AgreeDisagree />} />
                <Route path="yes-no" element={<YesNo />} />
                <Route path="like-dislike" element={<LikeDislike />} />
                <Route path="open-choice" element={<OpenChoice />} />
                <Route path="ranked-choice" element={<RankChoice />} />
              </Route>
              <Route path="treasury/" element={<TreasuryLayout />}>
                {/* <Route path="" element={<TreasurySummary />} /> */}
                {/* <Route path="reward-schedule" element={<RewardSchedule />} /> */}
                <Route path="" element={<RewardSchedule />} />
                <Route path="buy-fdx" element={<BuyFDX />} />
                <Route path="redemption-center" element={<RedemptionCenter />} />
                <Route path="ledger" element={<Ledger />} />
                <Route path="withdrawls" element={<Withdraws />} />
                <Route path="deposits" element={<Deposits />} />
              </Route>
              {/* <Route path="treasury/:code" element={<TreasuryLayout />}>
                <Route path="" element={<TreasurySummary />} />
                <Route path="reward-schedule" element={<RewardSchedule />} />
                <Route path="buy-fdx" element={<BuyFDX />} />
                <Route path="redemption-center" element={<RedemptionCenter />} />
                <Route path="ledger" element={<Ledger />} />
              </Route> */}
              <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                <Route path="profile/" element={<Profile />}>
                  <Route path="summary" element={<Summary />} />
                  {/* <Route path="me" element={<UserProfile />} /> */}
                  <Route path="" element={<UserProfile />} />
                  <Route path="verification-badges" element={<VerificationBadges />} />
                  <Route path="post-activity" element={<Contributions />} />
                  <Route path="collections" element={<Collection />} />
                  <Route path="postsbylist/:categoryId" element={<PostsByList />} />
                  <Route path="ledger" element={<BasicTable />} />
                  <Route path="feedback-given" element={<HiddenPosts />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="shared-links" element={<SharedLinks />} />
                  <Route path="shared-articles" element={<SharedArticles />} />
                  <Route path="user-settings" element={<UserSettings />} />
                  <Route path="change-password" element={<ChangePassword />} />
                </Route>
              </Route>
              <Route path="/direct-messaging/" element={<DirectMessageLayout />}>
                <Route path="" element={<DirectMessaging />} />
                <Route path="new-message" element={<NewMessageForm />} />
                <Route path="preview" element={<DMPreview />} />
                <Route path="*" element={<DirectMessaging />} />
              </Route>
              <Route path="/seldon-ai/" element={<SeldonAiLayout />}>
                <Route path="" element={<SeldonAi />} />
              </Route>
              <Route path="/news/" element={<NewsFeedLayout />}>
                <Route path="" element={<NewsFeed />} />
              </Route>
              <Route path="/profile-others/" element={<OtherProfilesLayout />}>
                <Route path="" element={<OtherProfiles />} />
              </Route>
            </Route>
            <Route path="/post-preview" element={<PreviewPost />} />
            <Route path="/shared-links/result" element={<SharedLinkResults />} />
            <Route path="/shared-collection-link/result" element={<SharedListResults />} />
            <Route path="/post/:isFullScreen" element={<Guests />} />
            <Route path="/p/:id" element={<SingleQuest />} />
            <Route path="/l/:id" element={<PostsByList />} />
            <Route path="/r/:id" element={<SeldonView />} />
            <Route path="/h/:domain" element={<PublicProfile />} />
            <Route path="/badgeverifycode" element={<BadgeVerifyCode />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verifycode" element={<VerifyCode />} />
            <Route path="/verify-phone" element={<VerifyPhone />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
