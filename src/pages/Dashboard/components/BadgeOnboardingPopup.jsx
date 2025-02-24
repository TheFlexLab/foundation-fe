import { useEffect, useState } from 'react';
import PersonalBadgesPopup from '../../../components/dialogue-boxes/PersonalBadgesPopup';
import EducationBadgePopup from '../../../components/dialogue-boxes/EducationBadgePopup';
import WorkBadgePopup from '../../../components/dialogue-boxes/WorkBadgePopup';
import HomepageBadgePopup from '../../../components/dialogue-boxes/HomepageBadgePopup';
import VerificationPopups from '../pages/Profile/components/VerificationPopups';
import AddCellPhonePopup from '../../../components/dialogue-boxes/AddCellPhonePopup';
import InfoPopup from '../../../components/dialogue-boxes/InfoPopup';
import SocialConnectPopup from '../pages/Profile/pages/verification-badges/SocialConnectPopup';
import LegacyBadgePopup from '../../../components/dialogue-boxes/LegacyBadgePopup';
import Web3ConnectPopup from '../pages/Profile/pages/verification-badges/Web3ConnectPopup';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import LinkHubPopup from '../../../components/dialogue-boxes/LinkHubPopup';
import { updateProgress } from '../../../features/progress/progressSlice';
import { incIndex, setIndex, setPopup } from '../../../features/OnBoardingPopup/onBoardingPopupSlice';
import api from '../../../services/api/Axios';
import HobbiesPopup from '../../../components/dialogue-boxes/HobbiesPopup';
import VolunteerPopup from '../../../components/dialogue-boxes/VolunteerPopup';
import CertificationsPopup from '../../../components/dialogue-boxes/CertificationsPopup';
import IdentityBadgePopup from '../../../components/dialogue-boxes/IdentityBadgePopup';

export default function BadgeOnboardingPopup({ isPopup, setIsPopup, edit, setEdit }) {
  const fetchUser = useSelector((state) => state.auth.user);
  const isOnboardingPopup = useSelector((state) => state.onBoardingPopup.popup);
  const onBoardingIndex = useSelector((state) => state.onBoardingPopup.index);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const checkPersonalBadge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.personal?.hasOwnProperty(itemType) || false) || false;

  const checkWorkOrEdu = (itemType) =>
    fetchUser?.badges?.find((badge) => badge.personal && badge.personal.hasOwnProperty(itemType));

  const checkDomainBadge = () => {
    return fetchUser?.badges?.some((badge) => !!badge?.domain) || false;
  };

  const checkSocial = (name) => fetchUser?.badges?.some((i) => i.accountName === name);

  const checkContact = (itemType) => fetchUser?.badges?.some((i) => i.type === itemType);

  const checkLegacyBadge = () => fetchUser?.badges?.some((badge) => (badge?.legacy ? true : false));

  const checkWeb3Badge = (itemType) =>
    fetchUser?.badges?.some((badge) => badge?.web3?.hasOwnProperty(itemType) || false) || false;

  const location = useLocation();
  const badgeData = [
    {
      component: InfoPopup,
      title: 'Continue Where You Left Off!',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/leftover.svg`,
      message: `Add more badges to boost your profile, increase credibility, and easily earn more FDX along the way. Each badge brings you closer to maximizing your earning potential on Foundation!`,
      buttonText: 'Continue',
      info: true,
      check: location.pathname === '/profile/verification-badges' ? false : true,
    },
    {
      component: InfoPopup,
      title: 'Congratulations!',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/congrats.svg`,
      message:
        'Congratulations, you’ve earned 10 FDX! Keep adding verification badges and receive an additional 10 FDX for each one! Every badge you add increases your credibility on Foundation. Every badge added increases your value and credibility on the network.',
      buttonText: 'Continue',
      info: true,
      check: location.pathname === '/' ? false : true,
    },
    {
      component: PersonalBadgesPopup,
      title: 'First Name',
      type: 'firstName',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/firstname.png`,
      placeholder: 'First Name Here',
      info: false,
      check: checkPersonalBadge('firstName'),
    },
    {
      component: PersonalBadgesPopup,
      title: 'Last Name',
      type: 'lastName',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/lastname.png`,
      placeholder: 'Last Name Here',
      info: false,
      check: checkPersonalBadge('lastName'),
    },
    {
      component: PersonalBadgesPopup,
      title: 'Date of Birth',
      type: 'dateOfBirth',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/dob.svg`,
      placeholder: 'MM/DD/YYYY',
      info: false,
      check: checkPersonalBadge('dateOfBirth'),
    },
    {
      component: HomepageBadgePopup,
      title: 'Domain',
      type: 'domainBadge',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`,
      placeholder: 'Answer Here',
      info: false,
      check: checkDomainBadge(),
    },
    {
      component: LinkHubPopup,
      title: 'Link Hub',
      type: 'linkHub',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/linkhub.svg`,
      info: false,
      check: checkPersonalBadge('linkHub'),
    },
    {
      component: InfoPopup,
      title: 'Onward and upward!',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/leftover.svg`,
      message: `Every badge you add strengthens your validity and improves the quality of crowd-sourced insights on Foundation. Plus, you're stacking up more FDX with each step—keep going!`,
      buttonText: 'Continue',
      info: true,
      check: false,
    },
    {
      component: AddCellPhonePopup,
      type: 'cell-phone',
      title: 'Phone Number',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/cellphone-1.png`,
      info: false,
      check: checkContact('cell-phone'),
    },

    {
      component: PersonalBadgesPopup,
      title: 'Current City',
      type: 'currentCity',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/currentcity-1.png`,
      placeholder: 'Current City here',
      info: false,
      check: checkPersonalBadge('currentCity'),
    },
    {
      component: PersonalBadgesPopup,
      title: 'Home Town',
      type: 'homeTown',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hometown.svg`,
      placeholder: 'Hometown Here',
      info: false,
      check: checkPersonalBadge('homeTown'),
    },

    {
      component: PersonalBadgesPopup,
      title: 'Geolocation',
      type: 'geolocation',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
      placeholder: 'Geolocation',
      info: false,
      check: checkPersonalBadge('geolocation'),
    },
    {
      component: PersonalBadgesPopup,
      title: 'Sex',
      type: 'sex',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationaship-1.png`,
      placeholder: 'Choose',
      info: false,
      check: checkPersonalBadge('sex'),
    },
    {
      component: PersonalBadgesPopup,
      title: 'Relationship Status',
      type: 'relationshipStatus',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/relationship.svg`,
      placeholder: 'Choose',
      info: false,
      check: checkPersonalBadge('relationshipStatus'),
    },

    {
      component: InfoPopup,
      title: 'Lets keep going!',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/leftover.svg`,
      message: `Adding more badges leads to more opportunities and rewards for you on Foundation. Keep the momentum going!`,
      buttonText: 'Continue',
      info: true,
      check: false,
    },
    {
      component: VerificationPopups,
      type: 'personal',
      title: 'Personal Email',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Personal-Email-2xa.png`,
      placeholder: 'Personal email here',
      info: false,
      check: checkContact('personal'),
    },
    {
      component: WorkBadgePopup,
      title: 'Work',
      type: 'work',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/work-a.png`,
      placeholder: 'Work Here',
      info: false,
      check: checkWorkOrEdu('work'),
    },
    {
      component: VerificationPopups,
      type: 'work',
      title: 'Work Email',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Work-Email-2xa.png`,
      placeholder: 'Work email here',
      info: false,
      check: checkContact('work'),
    },

    {
      component: EducationBadgePopup,
      title: 'Education',
      type: 'education',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/education-1.png`,
      placeholder: 'Education Here',
      info: false,
      check: checkWorkOrEdu('education'),
    },
    {
      component: VerificationPopups,
      type: 'education',
      title: 'Education Email',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Education-Email-2xa.png`,
      placeholder: 'Educational email here',
      info: false,
      check: checkContact('education'),
    },
    {
      component: HobbiesPopup,
      title: 'Hobbies',
      type: 'hobbies',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/hobbies.svg`,
      placeholder: 'Hobbies Here',
      info: false,
      check: checkWorkOrEdu('hobbies'),
    },
    {
      component: VolunteerPopup,
      title: 'Volunteer',
      type: 'volunteer',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/volunteer.svg`,
      placeholder: 'Volunteer Here',
      info: false,
      check: checkWorkOrEdu('volunteer'),
    },
    {
      component: CertificationsPopup,
      title: 'Certifications',
      type: 'certifications',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/certificate.svg`,
      placeholder: 'Certifications Here',
      info: false,
      check: checkWorkOrEdu('certifications'),
    },
    {
      component: PersonalBadgesPopup,
      title: 'Security Question',
      type: 'security-question',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/securityquestion-a.png`,
      placeholder: 'Answer Here',
      info: false,
      check: checkPersonalBadge('security-question'),
    },
    {
      component: IdentityBadgePopup,
      title: 'Identity',
      type: 'identity',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/identity.svg`,
      info: false,
      check: checkPersonalBadge('identity'),
    },

    {
      component: InfoPopup,
      title: 'Let’s take it to the next level!',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/leftover.svg`,
      message: `Adding all these badges starts you off with an impressive FDX balance! Your contributions play a key role in keeping Foundation’s data authentic. Keep it up—more badges and rewards are just ahead!`,
      buttonText: 'Continue',
      info: true,
      check: false,
    },
    {
      component: LegacyBadgePopup,
      title: 'Password',
      type: 'password',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`,
      placeholder: 'Answer Here',
      info: false,
      check: checkLegacyBadge(),
    },
    {
      component: SocialConnectPopup,
      type: 'twitter',
      title: 'Twitter',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Twitter-2x.png`,
      accountName: 'twitter',
      link: '/auth/twitter',
      info: false,
      check: checkSocial('twitter'),
    },
    {
      component: SocialConnectPopup,
      type: 'linkedin',
      title: 'LinkedIn',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/LinkedIn-2x.png`,
      accountName: 'linkedin',
      link: '/auth/linkedin',
      info: false,
      check: checkSocial('linkedin'),
    },
    {
      component: SocialConnectPopup,
      type: 'facebook',
      title: 'Facebook',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Facebook-2x.png`,
      accountName: 'facebook',
      link: '/auth/facebook',
      info: false,
      check: checkSocial('facebook'),
    },
    {
      component: SocialConnectPopup,
      type: 'github',
      title: 'Github',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/Github-2x.png`,
      accountName: 'github',
      link: '/auth/github',
      info: false,
      check: checkSocial('github'),
    },

    {
      component: SocialConnectPopup,
      type: 'farcaster',
      title: 'Farcaster',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
      accountName: '',
      link: '',
      check: checkSocial('farcaster'),
    },
    {
      component: SocialConnectPopup,
      type: 'youtube',
      title: 'Youtube',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/youtube.svg`,
      accountName: '',
      link: '',
      check: checkSocial('youtube'),
    },
    {
      component: Web3ConnectPopup,
      type: 'etherium-wallet',
      title: 'Ethereum Wallet',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/verification-badges/farcaster.svg`,
      accountName: '',
      link: '',
      check: checkWeb3Badge('etherium-wallet'),
    },

    {
      component: InfoPopup,
      title: 'Thats all the badges!',
      logo: `${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/finish.svg`,
      message: `Completing all your verification badges gives you a highly verified status on Foundation!`,
      message2:
        'Your commitment to completing all badges enhances your credibility and opens the door to more earning opportunities.',
      message3: 'Thank you for being an essential part of our community!',
      buttonText: 'Finish',
      info: true,
      check: false,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(isOnboardingPopup ? onBoardingIndex : 0);

  useEffect(() => {
    if (!isOnboardingPopup) {
      dispatch(setPopup(true));
    }
  }, []);

  const actionableBadges = badgeData.filter((badge) => !badge.check);

  const handleNext = () => {
    if (currentIndex < actionableBadges.length - 1) {
      dispatch(incIndex());
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsPopup(false);
      dispatch(setPopup(false));
    }
  };

  const handleSkip = async (type) => {
    if (actionableBadges[currentIndex]?.buttonText === 'Finish') {
      dispatch(setPopup(false));
      dispatch(setIndex(0));
      if (location.pathname === '/') {
        const res = await api.patch(`/updateOnBoarding/${fetchUser._id}`);
        if (res.status === 200) {
          console.log(res);
        }
      }

      queryClient.invalidateQueries(['userInfo']);
    }
    if (type) {
      dispatch(updateProgress());
    }
    handleNext();
  };

  // const totalBadges = badgeData.filter((badge) => !badge.info);
  // const completedBadges = badgeData.filter((badge) => !badge.info && badge.check);
  // const progress = Math.floor((completedBadges.length / totalBadges.length) * 100);
  const CurrentBadgeComponent = actionableBadges[currentIndex]?.component;
  const handlePopupClose = async (data) => {
    dispatch(setPopup(false));
    dispatch(setIndex(0));
    setIsPopup(data);
    if (location.pathname === '/') {
      const res = await api.patch(`/updateOnBoarding/${fetchUser._id}`);
      if (res.status === 200) {
        console.log(res);
      }
    }

    queryClient.invalidateQueries(['userInfo']);
  };

  return (
    <CurrentBadgeComponent
      isPopup={isPopup}
      setIsPopup={handlePopupClose}
      title={actionableBadges[currentIndex]?.title}
      type={actionableBadges[currentIndex]?.type}
      logo={actionableBadges[currentIndex]?.logo}
      placeholder={actionableBadges[currentIndex]?.placeholder}
      edit={edit}
      setEdit={setEdit}
      fetchUser={fetchUser}
      handleSkip={handleSkip}
      onboarding={true}
      selectedBadge={actionableBadges[currentIndex]?.type}
      message={actionableBadges[currentIndex]?.message}
      message2={actionableBadges[currentIndex]?.message2}
      message3={actionableBadges[currentIndex]?.message3}
      buttonText={actionableBadges[currentIndex]?.buttonText}
      accountName={actionableBadges[currentIndex]?.accountName}
      link={actionableBadges[currentIndex]?.link}
    />
  );
}
