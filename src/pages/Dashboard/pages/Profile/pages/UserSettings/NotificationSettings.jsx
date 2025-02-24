import { Switch } from '@headlessui/react';
import { updateUserSettings } from '../../../../../../services/api/userAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CloseEmailNotificationPopup from '../../../../../../components/dialogue-boxes/CloseEmailNotificationPopup';
import showToast from '../../../../../../components/ui/Toast';
import SummaryCard from '../../../../../../components/SummaryCard';

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(
    persistedUserInfo.notificationSettings.emailNotifications || false
  );
  const [postNotifications, setPostNotifications] = useState(
    persistedUserInfo.notificationSettings.newPostsNotifications || false
  );
  const [newsNotifications, setNewsNotifications] = useState(
    persistedUserInfo.notificationSettings.newNewsNotifications || false
  );

  const { mutateAsync: handleUserSettings } = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      console.log(error);
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
    },
  });

  const handleCloseModal = () => setModalVisible(false);

  return (
    <div className="space-y-2 tablet:space-y-[15px]">
      {modalVisible && (
        <CloseEmailNotificationPopup
          handleClose={handleCloseModal}
          modalVisible={modalVisible}
          title={'Email Notification'}
          image={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/email-icon.svg`}
          emailNotifications={emailNotifications}
          setEmailNotifications={setEmailNotifications}
        />
      )}
      <SummaryCard headerIcon="/assets/svgs/notification-icon.svg" headerTitle="Notification Settings">
        <div className="flex flex-col gap-3 rounded-[6.749px] tablet:gap-6 tablet:rounded-[15px]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">General</h1>{' '}
              <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                Get updates on new features, opportunities to earn FDX and more.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <h1 className="text-gray text-end text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">
                Email
              </h1>
              <Switch
                checked={emailNotifications}
                onChange={(e) => {
                  setModalVisible(true);
                }}
                className={`${emailNotifications ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`switch_base ${
                    emailNotifications
                      ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                      : 'translate-x-[1px] bg-[#707175]'
                  }`}
                />
              </Switch>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">New Posts</h1>
              <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                Stay up to date on the latest posts on Foundation.
              </p>
            </div>
            <Switch
              checked={postNotifications}
              onChange={(e) => {
                setPostNotifications(e);
                handleUserSettings({ uuid: persistedUserInfo.uuid, newPostsNotifications: e });
              }}
              className={`${postNotifications ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`switch_base ${
                  postNotifications
                    ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                    : 'translate-x-[1px] bg-[#707175]'
                }`}
              />
            </Switch>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray text-[10px] font-semibold dark:text-gray-300 tablet:text-[20px]">
                Foundation News
              </h1>
              <p className="text-gray-1 text-[8px] font-medium dark:text-gray-300 tablet:text-[16px]">
                Get notified of recently published articles.
              </p>
            </div>
            <Switch
              checked={newsNotifications}
              onChange={(e) => {
                // showToast('warning', 'featureComingSoon');
                setNewsNotifications(e);
                handleUserSettings({ uuid: persistedUserInfo.uuid, newNewsNotifications: e });
              }}
              className={`${newsNotifications ? 'bg-[#BEDEF4]' : 'bg-gray-250'} switch_basic_design`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`switch_base ${
                  newsNotifications
                    ? 'translate-x-[9px] bg-[#4A8DBD] tablet:translate-x-6'
                    : 'translate-x-[1px] bg-[#707175]'
                }`}
              />
            </Switch>
          </div>
        </div>
      </SummaryCard>
    </div>
  );
}
