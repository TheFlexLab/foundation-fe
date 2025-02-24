import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PopUp from '../ui/PopUp';
import Checkbox from '../ui/Checkbox';
import { FaSpinner } from 'react-icons/fa';
import { Button } from '../ui/Button';
import { useAddBadgeHub } from '../../services/mutations/verification-adges';
import { contactBadges, financeBadges, personalBadges, socialBadges } from '../../constants/badge-hub';
import * as badgeService from '../../utils/helper-function/badge-service';
import showToast from '../ui/Toast';
import { formatCountNumber } from '../../utils/utils';
import BadgeHubAddBadge from '../../pages/UserProfile/components/BadgeHubAddBadge';
import { useQueryClient } from '@tanstack/react-query';

const BadgeList = ({
  badges,
  handleBadgeId,
  persistedUserInfo,
  persistedTheme,
  badgeService,
  isAddedInBadgeHub,
  title,
}) => {
  const [addBadgePopup, setAddBadgePopup] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('');

  return (
    <div>
      <h1 className="summary-text mb-[10px] tablet:mb-4">{title}</h1>
      <ul className="flex flex-col gap-[5px] tablet:gap-4">
        {badges.map((badge, index) => (
          <li
            key={index}
            className="mx-auto flex w-full max-w-[90%] cursor-pointer items-center justify-between gap-[10px] tablet:max-w-full tablet:gap-4 laptop:max-w-[85%] laptop:gap-6"
            onClick={() => handleBadgeId(badge.type)}
          >
            {badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? (
              <Checkbox id={index} checked={isAddedInBadgeHub(badge.type)} onChange={() => handleBadgeId(badge.type)} />
            ) : (
              <Checkbox
                id={index}
                checked={false}
                onChange={() => {
                  showToast('warning', 'badgeNotAdded');
                }}
              />
            )}
            <img
              src={badge.image}
              alt={badge.title}
              className="size-[6.389vw] rounded-full tablet:size-10 laptop:size-[50px]"
            />
            <div className="flex h-[21.5px] w-[24vw] items-center justify-center rounded-[1.31vw] border border-white-500 dark:border-gray-100 dark:bg-accent-100 tablet:h-[50px] tablet:w-[142px] tablet:rounded-[8px] tablet:border-[3px] laptop:w-[200px] laptop:rounded-[15px]">
              <h1 className="whitespace-nowrap text-[2.11vw] font-medium capitalize leading-normal text-gray dark:text-gray-400 tablet:text-[15px] laptop:text-[20px]">
                {badge.title}
              </h1>
            </div>
            <h5 className="summary-text tablet:min-w-[122px]">
              <Button
                variant={badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? 'cancel' : 'submit'}
                disabled={badgeService.checkBadgeExists(persistedUserInfo, badge.type) ? true : false}
                onClick={() => {
                  if (badgeService.checkBadgeExists(persistedUserInfo, badge.type)) {
                    return;
                  }
                  setAddBadgePopup(true);
                  setSelectedBadge(badge.type);
                }}
              >
                Add Badge
              </Button>
            </h5>
            <div className="flex min-w-10 items-center gap-2 tablet:min-w-[50px] laptop:min-w-[64px]">
              <img
                src={`${import.meta.env.VITE_S3_IMAGES_PATH}/${persistedTheme === 'dark' ? 'assets/svgs/dark/clicks.svg' : 'assets/svgs/clicks.svg'}`}
                alt="clicks"
                className="h-3 w-3 tablet:h-6 tablet:w-6"
              />
              <h1 className="text-[12px] leading-normal text-gray dark:text-[#f1f1f1] tablet:text-[16px]">
                {formatCountNumber(
                  badgeService.getBadgeByType(persistedUserInfo, badge.type)?.badgeHubClicksTrack?.length || 0
                )}
              </h1>
            </div>
          </li>
        ))}
      </ul>
      {addBadgePopup && (
        <BadgeHubAddBadge
          isPopup={addBadgePopup}
          setIsPopup={setAddBadgePopup}
          edit={false}
          setEdit={''}
          type={selectedBadge}
        />
      )}
    </div>
  );
};

const badgeCategories = [
  // { title: 'Social Badges', badges: socialBadges },
  { title: 'Contact Badges', badges: contactBadges },
  { title: 'Finance Badges', badges: financeBadges },
  { title: 'Personal Badges', badges: personalBadges },
];

const BadgeHubPopup = ({ isPopup, setIsPopup, title, logo }) => {
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
    queryClient.invalidateQueries({ queryKey: ['my-profile'] }, { exact: true });
    setIsPopup(false);
  };

  const { mutateAsync: handleAddBadgeHub, isPending } = useAddBadgeHub();

  const handleCheckboxChange = (id, type) => {
    setSelectedIds((prev) => {
      const itemExists = prev.some((selectedItem) => selectedItem.id === id && selectedItem.type === type);

      if (itemExists) {
        return prev.filter((selectedItem) => selectedItem.id !== id || selectedItem.type !== type);
      } else {
        return [...prev, { id, type }];
      }
    });
  };

  useEffect(() => {
    if (persistedUserInfo?.badges) {
      const addedBadges = persistedUserInfo.badges
        .filter((badge) => badge.isAdded)
        .map((badge) => ({ id: badge._id, type: badge.type }));

      setSelectedIds(addedBadges);
    }
  }, [persistedUserInfo?.badges]);

  const getBadgeIds = (badgeList, badgeTypes) => {
    return badgeList
      .filter((badge) => badgeTypes.some((badgeType) => badgeType.type === badge.type))
      .map((badge) => ({ id: badge._id, type: badge.type }));
  };

  const selectAll = () => {
    const allSocialBadges = getBadgeIds(persistedUserInfo?.badges, socialBadges);
    const allContactIds = getBadgeIds(persistedUserInfo?.badges, contactBadges);
    const allFinanceIds = getBadgeIds(persistedUserInfo?.badges, financeBadges);
    const allPersonalIds = getBadgeIds(persistedUserInfo?.badges, personalBadges);

    const arr = [...allSocialBadges, ...allContactIds, ...allFinanceIds, ...allPersonalIds];

    setSelectedIds(arr);
  };

  const getSelectedBadgeTypes = (badgeTypes) => {
    return badgeTypes
      .filter((infoBadge) => persistedUserInfo?.badges?.some((badge) => badge.type === infoBadge.type))
      .map((badge) => badge.type);
  };

  const allSelected = [
    ...getSelectedBadgeTypes(socialBadges),
    ...getSelectedBadgeTypes(contactBadges),
    ...getSelectedBadgeTypes(financeBadges),
    ...getSelectedBadgeTypes(personalBadges),
  ];

  const handleBadgeId = (type) => {
    const badge = badgeService.getBadgeIdByType(persistedUserInfo, type);
    handleCheckboxChange(badge, type);
  };

  const isAddedInBadgeHub = (itemType) => selectedIds?.some((badge) => badge?.type === itemType) || false;

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo} customClasses={'overflow-y-auto'}>
      <div className="flex flex-col gap-[10px] px-5 py-[15px] tablet:gap-4 tablet:px-8 tablet:py-[25px] laptop:px-[80px]">
        <h1 className="summary-text">Select the badges you want to display on your profile.</h1>
        {badgeCategories.map((category, index) => (
          <BadgeList
            key={index}
            badges={category.badges}
            handleBadgeId={handleBadgeId}
            persistedUserInfo={persistedUserInfo}
            persistedTheme={persistedTheme}
            badgeService={badgeService}
            isAddedInBadgeHub={isAddedInBadgeHub}
            title={category.title}
          />
        ))}
        <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
          <Button
            variant="submit"
            onClick={() => {
              if (selectedIds.length > 1 && allSelected.length === selectedIds.length) {
                setSelectedIds([]);
              } else {
                selectAll();
              }
            }}
          >
            {selectedIds.length > 1 && allSelected.length === selectedIds.length ? 'Clear All' : 'Select All'}
          </Button>
          <Button
            variant={'submit'}
            onClick={() => {
              const ids = selectedIds.map((badge) => badge.id);
              handleAddBadgeHub(ids);
            }}
          >
            {isPending ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Save'}
          </Button>
        </div>
      </div>
    </PopUp>
  );
};

export default BadgeHubPopup;
