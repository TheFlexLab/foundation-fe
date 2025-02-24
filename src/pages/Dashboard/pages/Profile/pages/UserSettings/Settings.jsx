import { Switch } from '@headlessui/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../../../../../../components/ui/Button';
import { changeTheme } from '../../../../../../features/utils/utilsSlice';
import { signOut, updateUserSettings } from '../../../../../../services/api/userAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetFilters } from '../../../../../../features/sidebar/filtersSlice';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../../../../../features/auth/authSlice';
import showToast from '../../../../../../components/ui/Toast';
import { getAskPassword, setAskPassword } from '../../../../../../features/profile/userSettingSlice';
import SummaryCard from '../../../../../../components/SummaryCard';

export const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [checkState, setCheckState] = useState(persistedTheme === 'dark' ? true : false);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [defaultSort, setDefaultSort] = useState(persistedUserInfo.userSettings.defaultSort || false);
  const getAskPasswordFromRedux = useSelector(getAskPassword);
  const [askPasswordEverytime, setAskPasswordEverytime] = useState(getAskPasswordFromRedux);
  const [systemNotifications, setSystemNotifications] = useState(
    persistedUserInfo.notificationSettings.systemNotifications || false
  );

  const handleTheme = () => {
    dispatch(changeTheme());
    setCheckState((prevCheckState) => {
      handleUserSettings({ uuid: persistedUserInfo.uuid, darkMode: !prevCheckState });
      return !prevCheckState;
    });
  };

  const { mutateAsync: handleSignout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      dispatch(resetFilters());
      dispatch(addUser(null));
      localStorage.clear();
      navigate('/');
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  const handleGuestSignout = async () => {
    navigate('/guest-signup');
  };

  const { mutateAsync: handleUserSettings } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['userInfo']);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  return (
    <>
      <div className="space-y-2 tablet:space-y-[15px]">
        <SummaryCard headerIcon="/assets/svgs/display-settings.svg" headerTitle="Display Settings">
          <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
            <div>
              <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">Dark Mode</h1>
              <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                Switch to Dark Mode
              </p>
            </div>
            <Switch
              checked={checkState}
              onChange={handleTheme}
              className={`${checkState ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`switch_base ${
                  checkState ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'
                }`}
              />
            </Switch>
          </div>
        </SummaryCard>
        <SummaryCard headerIcon="/assets/svgs/feed-settings.svg" headerTitle="Feed Settings">
          <div className="flex flex-col gap-3 rounded-[6.749px] tablet:gap-6 tablet:rounded-[15px]">
            <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
              <div>
                <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">
                  Post results
                </h1>
                <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                  Show from highest to lowest.
                </p>
              </div>
              <Switch
                checked={defaultSort}
                onChange={(e) => {
                  setDefaultSort(e);
                  handleUserSettings({ uuid: persistedUserInfo.uuid, defaultSort: e });
                }}
                className={`${defaultSort ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${defaultSort ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6' : 'translate-x-[1px] bg-[#707175]'}`}
                />
              </Switch>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">
                  Quick Tips
                </h1>
                <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                  View helpful information as you engage across the patform.
                </p>
              </div>
              <Switch
                checked={systemNotifications}
                onChange={(e) => {
                  setSystemNotifications(e);
                  handleUserSettings({ uuid: persistedUserInfo.uuid, systemNotifications: e });
                }}
                className={`${systemNotifications ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    systemNotifications
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
            </div>
          </div>
        </SummaryCard>
        <SummaryCard headerIcon="/assets/svgs/encrypt.svg" headerTitle="Encryption Settings">
          <div className="flex items-center justify-between rounded-[6.749px] tablet:rounded-[15px]">
            <div className="">
              <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">
                Password Request
              </h1>
              <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                Request password when encrypting or decrypting. Only appicable if you have the encryption badge.
              </p>
            </div>
            <Switch
              checked={askPasswordEverytime}
              onChange={(e) => {
                if (persistedUserInfo.isPasswordEncryption) {
                  setAskPasswordEverytime(e);
                  dispatch(setAskPassword(e));
                } else {
                  showToast('warning', 'noEncryptionBadgeAdded');
                }
              }}
              className={`${askPasswordEverytime ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`switch_base ${
                  askPasswordEverytime
                    ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                    : 'translate-x-[1px] bg-[#707175]'
                }`}
              />
            </Switch>
          </div>
        </SummaryCard>
      </div>
      {/* Logout */}
      {(persistedUserInfo.role === 'user' || persistedUserInfo?.role === 'visitor') && (
        <Button
          variant="submit"
          className="mt-3 flex w-fit items-center gap-[5px] tablet:mt-4 tablet:gap-[10px]"
          onClick={() => {
            if (localStorage.getItem('isGuestMode')) {
              handleGuestSignout();
            } else {
              handleSignout(persistedUserInfo.uuid);
            }
          }}
        >
          <img
            src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/logout-icon.svg`}
            alt="logout-icon"
            className="size-[14px] tablet:size-[25px]"
          />
          Logout
        </Button>
      )}
    </>
  );
};
