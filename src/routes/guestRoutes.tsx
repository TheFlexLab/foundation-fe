import { Navigate } from 'react-router-dom';
import Iframe from '../pages/Embed/Iframe';
import EmbedPost from '../pages/Embed/EmbedPost';
import VerifyCode from '../pages/Signup/VerifyCode';
import VerifyPhone from '../pages/Signup/VerifyPhone';
import Authenticating from '../components/Authenticating';
import DashboardRedirect from '../pages/DashboardRedirect';
// import TermOfService from '../pages/Signup/pages/TermOfService';
import GuestRedirect from '../pages/DashboardRedirect/GuestRedirect';
// import SignUpPrivacyPolicy from '../pages/Signup/pages/PrivacyPolicy';

const guestRoutes = [
  { path: '/', element: <GuestRedirect redirectUrl="/" /> },
  { path: '/iframe', element: <Iframe /> },
  { path: '/verifycode', element: <VerifyCode /> },
  { path: '/embed/:link', element: <EmbedPost /> },
  { path: '/auth0', element: <DashboardRedirect /> },
  { path: '/verify-phone', element: <VerifyPhone /> },
  { path: '/authenticating', element: <Authenticating /> },
  // { path: '/term-of-service', element: <TermOfService /> },
  // { path: '/privacy-policy', element: <SignUpPrivacyPolicy /> },
  { path: '/p/:id', element: <GuestRedirect redirectUrl={null} /> },
  { path: '/l/:id', element: <GuestRedirect redirectUrl={null} /> },
  { path: '/r/:id', element: <GuestRedirect redirectUrl={null} /> },
  { path: '/treasury/:code', element: <Navigate to="/" state={{ from: '/treasury/:code' }} /> },
  { path: '*', element: <Navigate to="/" /> },
];

export default guestRoutes;
