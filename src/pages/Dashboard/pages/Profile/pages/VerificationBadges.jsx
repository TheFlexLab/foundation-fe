import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startRegistration } from '@simplewebauthn/browser';
import { Button } from '../../../../../components/ui/Button';
import { setProgress } from '../../../../../features/progress/progressSlice';
import BadgeOnboardingPopup from '../../../components/BadgeOnboardingPopup';
import { badgesTotalLength } from '../../../../../constants/varification-badges';
import { getAskPassword } from '../../../../../features/profile/userSettingSlice';
import { setIndex, setPopup } from '../../../../../features/OnBoardingPopup/onBoardingPopupSlice';
import Web3 from './verification-badges/Web3';
import Social from './verification-badges/Social';
import Privacy from './verification-badges/Privacy';
import Contact from './verification-badges/Contact';
import Personal from './verification-badges/Personal';
import Subscription from './verification-badges/Subscription';
import ProgressBar from '../../../../../components/ProgressBar';
import ContentCard from '../../../../../components/ContentCard';
import HomepageBadge from './verification-badges/HomepageBadge';
import BadgeRemovePopup from '../../../../../components/dialogue-boxes/badgeRemovePopup';
import LegacyConfirmationPopup from '../../../../../components/dialogue-boxes/LegacyConfirmationPopup';
import FinanceBadge from './verification-badges/FinanceBadge';

const VerificationBadges = () => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [isPasswordConfirmation, setIsPasswordConfirmation] = useState(false);
  const legacyPromiseRef = useRef();
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [socialRemoveLoading, setSocialRemoveLoading] = useState(false);
  const isOnboardingPopup = useSelector((state) => state.onBoardingPopup.popup);
  const [isPopup, setIsPopup] = useState(isOnboardingPopup ? false : true);
  const checkPseudoBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.pseudo ? true : false));
  const checkPrimary = (itemType) =>
    persistedUserInfo?.badges?.some((i) => i.accountName === itemType && i.primary === true);

  useEffect(() => {
    dispatch(
      setProgress(
        Math.floor(
          ((checkPseudoBadge() ? persistedUserInfo?.badges.length - 1 : persistedUserInfo?.badges.length) /
            badgesTotalLength) *
            100
        )
      )
    );
  }, [persistedUserInfo?.badges]);

  const handleBadgesClose = () => setModalVisible(false);
  const checkLegacyBadge = () => persistedUserInfo?.badges?.some((badge) => (badge?.legacy ? true : false));
  const checkSocial = (name) => persistedUserInfo?.badges?.some((i) => i.accountName === name);

  const handleRemoveBadgePopup = async (item) => {
    if (
      (checkLegacyBadge() && !localStorage.getItem('legacyHash')) ||
      (checkLegacyBadge() && getAskPasswordFromRedux) ||
      item.type === 'password'
    ) {
      await handleOpenPasswordConfirmation();
    }
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleOpenPasswordConfirmation = () => {
    setIsPasswordConfirmation(true);
    return new Promise((resolve) => {
      legacyPromiseRef.current = resolve;
    });
  };

  const handlePasskeyConfirmation = async () => {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/generate-registration-options`);
    const data = await resp.json();
    const attResp = await startRegistration(data);
    attResp.challenge = data.challenge;
    const verificationResp = await fetch(`${import.meta.env.VITE_API_URL}/verify-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attResp),
    });
    const verificationJSON = await verificationResp.json();
    return verificationJSON.verified;
  };

  return (
    <div className="pb-8">
      {isPopup && <BadgeOnboardingPopup isPopup={isPopup} setIsPopup={setIsPopup} edit={false} />}

      {/* DELETE MODAL POPUP */}
      {modalVisible && (
        <BadgeRemovePopup
          handleClose={handleBadgesClose}
          modalVisible={modalVisible}
          title={deleteModalState?.title}
          image={deleteModalState?.image}
          accountName={deleteModalState?.accountName}
          type={deleteModalState?.type}
          badgeType={deleteModalState?.badgeType}
          fetchUser={persistedUserInfo}
          setIsLoading={setSocialRemoveLoading}
          loading={socialRemoveLoading}
        />
      )}
      <LegacyConfirmationPopup
        isPopup={isPasswordConfirmation}
        setIsPopup={setIsPasswordConfirmation}
        title="Confirm Password"
        type={'password'}
        logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/wallet.svg`}
        legacyPromiseRef={legacyPromiseRef}
      />

      {/* Summary Section */}
      <ContentCard
        icon={
          persistedUserInfo.role === 'user' ? 'assets/svgs/dashboard/MeBadge.svg' : 'assets/svgs/dashboard/badge.svg'
        }
        title="Verification Badge Score"
        badgeVal={persistedUserInfo?.badges?.length}
        from={checkPseudoBadge() ? persistedUserInfo?.badges.length - 1 : persistedUserInfo?.badges.length}
        outof={badgesTotalLength}
      >
        <h1 className="summary-text">
          Enhance your profile by adding verification badges. These badges not only increase your credibility but also
          unlock more earning opportunities within the Foundation community.
        </h1>
        <div className="py-[10px] tablet:pt-[18.73px]">
          <ProgressBar />
        </div>
        <div className="flex w-full justify-center">
          <Button
            variant={'submit'}
            onClick={() => {
              setIsPopup(true);
            }}
          >
            Add badge
          </Button>
        </div>
      </ContentCard>
      <ContentCard icon="assets/verification-badges/contact.svg" title="Contact">
        <Contact
          fetchUser={persistedUserInfo}
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          checkLegacyBadge={checkLegacyBadge}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          getAskPassword={getAskPasswordFromRedux}
          checkPseudoBadge={checkPseudoBadge}
        />
      </ContentCard>
      <ContentCard icon="assets/verification-badges/privacy.svg" title="Privacy">
        <Privacy
          checkLegacyBadge={checkLegacyBadge}
          checkPseudoBadge={checkPseudoBadge}
          handleRemoveBadgePopup={handleRemoveBadgePopup}
        />
      </ContentCard>
      <ContentCard icon="assets/verification-badges/social.svg" title="Social">
        <Social
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          checkSocial={checkSocial}
          checkPseudoBadge={checkPseudoBadge}
          checkPrimary={checkPrimary}
        />
      </ContentCard>
      {/* <ContentCard icon="assets/verification-badges/web3.svg" title="Web3">
        <Web3
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          checkPseudoBadge={checkPseudoBadge}
          getAskPassword={getAskPasswordFromRedux}
        />
      </ContentCard> */}
      <ContentCard icon="assets/verification-badges/personal_icon.svg" title="Personal">
        <Personal
          badges={persistedUserInfo?.badges}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          getAskPassword={getAskPasswordFromRedux}
          checkPseudoBadge={checkPseudoBadge}
        />
      </ContentCard>
      <ContentCard icon="assets/profile/homepagebadges.svg" title="Homepage">
        <HomepageBadge checkPseudoBadge={checkPseudoBadge} />
      </ContentCard>
      <ContentCard icon="assets/profile/finance.svg" title="Finance">
        <FinanceBadge checkPseudoBadge={checkPseudoBadge} handleRemoveBadgePopup={handleRemoveBadgePopup} />
        <Web3
          handleRemoveBadgePopup={handleRemoveBadgePopup}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          checkPseudoBadge={checkPseudoBadge}
          getAskPassword={getAskPasswordFromRedux}
        />
      </ContentCard>
      <ContentCard icon="assets/profile/subsl_icon.svg" title="Subscribe">
        <Subscription
          fetchUser={persistedUserInfo}
          handleOpenPasswordConfirmation={handleOpenPasswordConfirmation}
          checkLegacyBadge={checkLegacyBadge}
          handlePasskeyConfirmation={handlePasskeyConfirmation}
          getAskPassword={getAskPasswordFromRedux}
          checkPseudoBadge={checkPseudoBadge}
        />
      </ContentCard>
    </div>
  );
};

export default VerificationBadges;
