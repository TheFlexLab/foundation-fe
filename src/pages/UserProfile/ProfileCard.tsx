import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomepageBadgePopup from '../../components/dialogue-boxes/HomepageBadgePopup';
import SendMessageFromDomain from '../../components/dialogue-boxes/SendMessageFromDomain';
import BadgeHub from './BadgeHub';
import SummaryCard from '../../components/SummaryCard';

export default function ProfileCard({ profile, badges }: any) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  const [isPersonalPopup, setIsPersonalPopup] = useState(false);
  const [sendMessagePopup, setSendMessagePopup] = useState(false);

  return (
    <SummaryCard headerIcon="/assets/profile/domain_white.svg" headerTitle={`${profile?.domain.name}.on.foundation`}>
      <div className="relative mx-auto flex flex-col gap-[14px] tablet:gap-4">
        {isPublicProfile && (
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/message-icon.svg`}
            alt="save icon"
            className="absolute right-0 top-0 h-[17px] w-[12.7px] cursor-pointer tablet:size-[25px]"
            onClick={() => setSendMessagePopup(true)}
          />
        )}
        <div className="flex w-full items-center gap-[14px] tablet:gap-6">
          <div
            className="relative flex size-[60px] min-w-[60px] flex-col gap-[6px] rounded-full border-2 border-[#C9C8C8] tablet:size-[185px] tablet:min-w-[185px] tablet:border-[5px]"
            onClick={() => {
              setIsPersonalPopup(true);
            }}
          >
            {!isPublicProfile && (
              <button className="absolute bottom-0 flex h-[40%] w-full items-center justify-center rounded-b-full bg-[#FBFBFB]/50">
                <img
                  src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/camera.svg`}
                  alt="save icon"
                  className="h-[17px] w-[12.7px] cursor-pointer tablet:h-[39px] tablet:w-[45px]"
                />
              </button>
            )}
            <img
              src={profile?.domain.s3Urls[0]}
              alt="s3 image url"
              className="size-full rounded-full object-cover tablet:size-[175px]"
            />
          </div>
          <div className="flex flex-col gap-1 text-gray-1 dark:text-[#f1f1f1] tablet:gap-3">
            <h1 className="text-[15px] font-semibold tablet:text-[22px]"> {profile?.domain.title}</h1>
            <BadgeHub badges={badges} />
          </div>
          {!isPublicProfile && (
            <>
              {isPersonalPopup && (
                <HomepageBadgePopup
                  isPopup={isPersonalPopup}
                  setIsPopup={setIsPersonalPopup}
                  title="Domain"
                  logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
                  edit={true}
                  setIsPersonalPopup={setIsPersonalPopup}
                  handleSkip={null}
                  onboarding={null}
                  progress={null}
                />
              )}
            </>
          )}
          {sendMessagePopup && (
            <SendMessageFromDomain
              profile={profile}
              isPopup={sendMessagePopup}
              setIsPopup={setSendMessagePopup}
              title="Send Message"
              logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
              fdx={profile?.messageByDomainFDX}
            />
          )}
        </div>
        <p className="text-[11px] leading-normal text-gray-1 dark:text-[#f1f1f1] tablet:text-[18px]">
          {profile?.domain.description}
        </p>
      </div>
    </SummaryCard>
  );
}
