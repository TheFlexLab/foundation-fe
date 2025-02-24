import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../components/ui/Button';
import { contactBadges, financeBadges, personalBadges, socialBadges } from '../../constants/badge-hub';
import { useLocation } from 'react-router-dom';
import { useBadgeHubClicksTrack } from '../../services/mutations/verification-adges';
import SummaryCard from '../../components/SummaryCard';
import BadgeHubAddBadge from './components/BadgeHubAddBadge';
import BadgeHubPopup from '../../components/dialogue-boxes/BadgeHubPopup';
import BadgeEncryptedPopup from '../../components/dialogue-boxes/BadgeEncryptedPopup';

export default function BadgeHub({ badges }: any) {
  const location = useLocation();
  const isPublicProfile = location.pathname.startsWith('/h/');
  // const [isBadgeHubPopup, setIsBadgeHubPopup] = useState(false);
  const [isBadgeEncryptedPopup, setBadgeEncryptedPopup] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [isPopup, setIsPopup] = useState(false);
  const [singleBadgeData, setSingleBadgeData] = useState();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);
  const { mutateAsync: handleBadgeHubClicksTrack } = useBadgeHubClicksTrack();

  const linkBadgesArray = socialBadges
    ?.filter(
      (badge: any) => badges && badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded)
    )
    .map((badge: any) => {
      const userBadge = badges && badges?.find((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded);
      return {
        ...badge,
        userBadgeData: userBadge,
      };
    });

  const contactBadgesArray = contactBadges
    ?.filter(
      (badge: any) => badges && badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded)
    )
    .map((badge: any) => {
      const userBadge = badges && badges?.find((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded);
      return {
        ...badge,
        userBadgeData: userBadge,
      };
    });

  const financeBadgesArray = financeBadges
    ?.filter((badge: any) => badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded))
    .map((badge: any) => {
      const userBadge = badges && badges?.find((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded);
      return {
        ...badge,
        userBadgeData: userBadge,
      };
    });

  const personalBadgesArray = personalBadges
    ?.filter(
      (badge: any) => badges && badges?.some((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded)
    )
    .map((badge: any) => {
      const userBadge = badges && badges?.find((userBadge: any) => userBadge.type === badge.type && userBadge.isAdded);
      return {
        ...badge,
        userBadgeData: userBadge,
      };
    });

  return (
    <div className="mx-auto flex w-full max-w-[730px] flex-col items-center gap-3 tablet:gap-6">
      {/* <SummaryCard
        headerIcon={isPublicProfile ? '/assets/addOptions/blueBadge.svg' : 'assets/svgs/dashboard/MeBadge.svg'}
        headerTitle="Verification Badges"
        isPublicProfile={isPublicProfile}
      >
        <h1 className="summary-text">
          Enhance your profile by adding verification badges. These badges not only increase your credibility but also
          unlock more earning opportunities within the Foundation community.
        </h1>
        <div className="mt-3 flex w-full justify-center tablet:mt-5">
          <Button variant={'submit'} onClick={() => setIsBadgeHubPopup(true)}>
            Show Badges
          </Button>
        </div>
      </SummaryCard> */}

      {/* <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
        <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
          Social
        </h1>
        <div className="flex gap-2 tablet:gap-4">
          {linkBadgesArray?.map((badge: any) => (
            <button
              key={badge.type}
              onClick={() => {
                if (isPublicProfile) {
                  handleBadgeHubClicksTrack(badge.userBadgeData._id);
                }
                if (badge.type === 'twitter') {
                  window.open(`https://x.com/${badge.userBadgeData.details.username}`, '_blank', 'noopener,noreferrer');
                }
                if (badge.type === 'github') {
                  window.open(badge.userBadgeData.details.profileUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
            </button>
          ))}
        </div>
      </div> */}

      {/* {contactBadgesArray?.length > 0 && (
        <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
          <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
            Contacts
          </h1>
          
        </div>
      )} */}
      {/* {financeBadgesArray?.length > 0 && (
        <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
          <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
            Finance
          </h1>
          <div className="flex flex-wrap gap-2 tablet:gap-4"></div>
        </div>
      )} */}
      {/* {personalBadgesArray?.length > 0 && (
        <div className="flex w-full items-center gap-3 rounded-[9.228px] border-[2.768px] border-gray-250 bg-[#FDFDFD] px-3 py-1 dark:border-gray-100 dark:bg-gray-200 tablet:gap-5 tablet:px-6 tablet:py-2">
          <h1 className="min-w-[53px] text-[12px] font-semibold leading-normal text-[#616161] dark:text-[#f1f1f1] tablet:min-w-[80px] tablet:text-[18px]">
            Personal
          </h1>
           <div className="flex flex-wrap gap-2 tablet:gap-4"></div>
        </div>
      )} */}
      {/* {isBadgeHubPopup && (
        <BadgeHubPopup
          isPopup={isBadgeHubPopup}
          setIsPopup={setIsBadgeHubPopup}
          title="Badge Hub"
          logo={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/profile/domain-badge.svg`}
        />
      )} */}
      {/* );
         } 
          // if (badge.type === 'cell-phone') {
          // return (
         else {
            return (
              <a
                key={badge.type}
                href={
                  Array.isArray(badge.userBadgeData.details?.emails) && badge.userBadgeData.details.emails[0]?.value
                    ? `mailto:${badge.userBadgeData.details.emails[0].value}`
                    : '#'
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (badge?.userBadgeData?.isUserEncrypted && isPublicProfile) {
                    setBadgeEncryptedPopup(true);
                  } else {
                    if (isPublicProfile) {
                      handleBadgeHubClicksTrack(badge.userBadgeData._id);
                    }
                    const emails = badge.userBadgeData.details?.emails;
                    if (Array.isArray(emails) && emails[0]?.value) {
                      console.log(emails[0].value);
                    } else {
                      e.preventDefault();
                      console.error('Email is missing or invalid');
                    }
                  }
                }}
              >
                <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
              </a>
            );
          }
        })} */}
      <div className="grid grid-cols-7 gap-1.5 tablet:gap-3">
        {contactBadgesArray?.map((badge: any) => (
          <button
            key={badge.type}
            onClick={() => {
              if (badge?.userBadgeData?.isUserEncrypted && isPublicProfile) {
                setBadgeEncryptedPopup(true);
              } else {
                if (isPublicProfile) {
                  handleBadgeHubClicksTrack(badge.userBadgeData._id);
                }
                setSelectedBadge(badge.type);
                setIsPopup(true);
              }
            }}
          >
            <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
          </button>
        ))}
        {financeBadgesArray.map((badge: any) => (
          <button
            key={badge.type}
            onClick={() => {
              if (badge?.userBadgeData?.isUserEncrypted && isPublicProfile) {
                setBadgeEncryptedPopup(true);
              } else {
                if (isPublicProfile) {
                  handleBadgeHubClicksTrack(badge.userBadgeData._id);
                }
                setSelectedBadge(badge.type);
                setIsPopup(true);
              }
            }}
          >
            <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
          </button>
        ))}
        {personalBadgesArray.map((badge: any) => (
          <button
            key={badge.type}
            onClick={() => {
              if (badge?.userBadgeData?.isUserEncrypted && isPublicProfile) {
                setSingleBadgeData(badge.userBadgeData);
                setBadgeEncryptedPopup(true);
              } else {
                if (isPublicProfile) {
                  handleBadgeHubClicksTrack(badge.userBadgeData._id);
                }
                setIsPopup(true);
                setSelectedBadge(badge.type);
              }
            }}
          >
            <img src={badge.image} alt="save icon" className="size-[24.5px] rounded-full tablet:size-[35px]" />
          </button>
        ))}
      </div>
      {isPopup && (
        <BadgeHubAddBadge
          isPopup={isPopup}
          setIsPopup={setIsPopup}
          edit={true}
          setEdit={''}
          type={selectedBadge}
          badges={badges}
        />
      )}
      {isBadgeEncryptedPopup && (
        <BadgeEncryptedPopup
          handleClose={() => setBadgeEncryptedPopup(false)}
          modalVisible={isBadgeEncryptedPopup}
          title={'Badge Encrypted'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/analyze-dialogbox.svg`}
          singleBadgeData={singleBadgeData}
        />
      )}
    </div>
  );
}
