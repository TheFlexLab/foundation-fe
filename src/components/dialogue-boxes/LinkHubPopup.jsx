import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { useSelector } from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import ProgressBar from '../ProgressBar';
import api from '../../services/api/Axios';
import BadgeRemovePopup from './badgeRemovePopup';
import { closestCorners, DndContext, MouseSensor, TouchSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReOrderLinHubLinks } from '../../services/mutations/verification-adges';
import { getIcon } from '../../services/imageProcessing';
import defaultLink from '../../assets/profile/default-link.svg';

const LinkHubItem = ({
  id,
  getIcon,
  item,
  deleteItem,
  setDeleteItem,
  handleDelete,
  handleEdit,
  delLoading,
  setDelLoading,
  setFetchingEdit,
  setAddAnotherForm,
  setEdit,
}) => {
  const persistedTheme = useSelector((state) => state.utils.theme);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative mb-[15px] flex w-full justify-between rounded-[8.62px] border bg-[#FBFBFB] pl-7 text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none dark:border-gray-100 dark:bg-gray-200 tablet:rounded-[21.06px] tablet:border-[3px] tablet:pl-14 tablet:text-[18px] tablet:leading-[21px] ${isDragging ? 'border-blue-300 dark:border-blue-500' : 'border-white-500 dark:border-gray-100'} `}
    >
      <div className="absolute left-0 flex h-full w-4 items-center justify-center rounded-l-[8.62px] bg-white-500 dark:bg-accent-500 tablet:w-[25px] tablet:rounded-l-[21.06px]">
        <img
          src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/${persistedTheme === 'dark' ? 'six-dots-dark.svg' : 'six-dots.svg'}`}
          alt="six dots"
          className="size-3 tablet:size-5"
        />
      </div>
      <div className="py-3 tablet:py-[25px]">
        <div className="flex items-center gap-2 tablet:gap-4">
          <img
            src={getIcon(item.link)}
            alt="save icon"
            onError={(e) => {
              e.target.src = defaultLink;
            }}
            className="size-[20.5px] rounded-full tablet:size-[35px]"
          />
          <div>
            <h4 className="text-gray-1 max-w-[324px] text-[9.28px] font-medium leading-[11.23px] dark:text-[#f1f1f1] tablet:text-[22px] tablet:leading-[26.63px]">
              {item.title}
            </h4>
            <div className="mt-[2px] tablet:mt-2">
              <h6 className="break-all text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] dark:text-[#f1f1f1] tablet:text-[18px] tablet:leading-[26.63px]">
                {item.link}
              </h6>
            </div>
          </div>
        </div>
      </div>
      {deleteItem === item.id ? (
        <div className="max-w-[160px] rounded-[10.06px] border-l border-white-500 px-[9px] py-2 dark:border-gray-100 tablet:max-w-[342px] tablet:rounded-[21.06px] tablet:border-l-[3px] tablet:px-5 tablet:py-[15px]">
          <h1 className="mb-[7px] text-[8px] font-medium leading-[8px] text-[#A7A7A7] dark:text-[#f1f1f1] tablet:mb-[10px] tablet:text-[18px] tablet:font-semibold tablet:leading-[26.73px]">
            Are you sure you want to delete your experience?
          </h1>
          <div className="flex justify-end gap-2 tablet:gap-[25px]">
            <Button
              className={'min-w-[2.875rem] tablet:min-w-[80px]'}
              variant="submit"
              onClick={() => {
                setDelLoading(item.id);
                handleDelete(deleteItem);
              }}
            >
              {delLoading === item.id ? (
                <FaSpinner className="animate-spin text-[#EAEAEA] dark:text-[#f1f1f1]" />
              ) : (
                'Yes'
              )}
            </Button>
            <Button
              className={'w-[2.875rem] tablet:min-w-[80px] laptop:w-[80px]'}
              variant="cancel"
              onClick={() => {
                setDeleteItem('');
              }}
            >
              No
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between py-3 pr-[9px] tablet:py-[25px] tablet:pr-7">
          <div className="flex justify-end gap-[10px] tablet:gap-[30px]">
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/editIcon.svg`}
              alt="Edit Icon"
              className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[23px]"
              onClick={() => {
                setFetchingEdit(true), setAddAnotherForm(true), setEdit(true), handleEdit(item.id);
              }}
            />
            <img
              src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/trash2.svg`}
              alt="Edit Icon"
              className="h-[12px] w-[12px] tablet:h-[23px] tablet:w-[17.64px]"
              onClick={() => setDeleteItem(item.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const LinkHubPopup = ({ isPopup, setIsPopup, type, title, logo, setIsPersonalPopup, handleSkip, onboarding }) => {
  const queryClient = useQueryClient();
  const [field1Data, setField1Data] = useState('');
  const [field2Data, setField2Data] = useState('');
  const [prevInfo, setPrevInfo] = useState({});
  const [existingData, setExistingData] = useState();
  const [deleteItem, setDeleteItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [hollow, setHollow] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(false);
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [addAnotherForm, setAddAnotherForm] = useState(false);
  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 0,
    },
  });
  const { mutateAsync: reOrderLinkHubLinks } = useReOrderLinHubLinks();

  useEffect(() => {
    const param = persistedUserInfo?.badges?.find((badge) => badge.personal && badge.personal.hasOwnProperty(type));
    setExistingData(param?.personal[type]);
  }, [persistedUserInfo.badges]);

  const handleClose = () => {
    queryClient.invalidateQueries({ queryKey: ['my-profile'] }, { exact: true });
    setIsPopup(false);
  };

  const handlefield1Change = (event) => {
    const value = event.target.value;
    setField1Data(value);
  };

  const handlefield2Change = (event) => {
    const value = event.target.value;
    setField2Data(value);
  };

  const handleAddPersonalBadge = async (data) => {
    try {
      if (field1Data.name === '' || field2Data.name === '') {
        showToast('error', 'blankField');
        setLoading(false);
        return;
      }
      const payload = {
        data,
        type,
        uuid: localStorage.getItem('uuid'),
        viewerCount: [],
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge/personal/addWorkOrEducation`, payload);
      if (addBadge.status === 200) {
        if (existingData) {
          showToast('success', 'infoUpdated');
        } else {
          showToast('success', 'badgeAdded');
        }
        if (onboarding) {
          handleSkip();
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
        setLoading(false);
        setDelLoading(false);
        setAddAnotherForm(false);
        setField1Data('');
        setField2Data('');
      }
    } catch (error) {
      console.log(error);
      setAddAnotherForm(false);
    }
  };

  const handleDelete = async (id) => {
    const payload = {
      id: id,
      uuid: localStorage.getItem('uuid'),
      type: type,
    };
    if (localStorage.getItem('legacyHash')) {
      payload.infoc = localStorage.getItem('legacyHash');
    }
    const companies = await api.post(`/addBadge/personal/deleteWorkOrEducation`, payload);
    if (companies.status === 200) {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
    }
  };

  const handleUpdateBadge = async (newData) => {
    try {
      if (field1Data === '' || field2Data === '') {
        showToast('warning', 'blankField');
        setLoading(false);
        return;
      }

      if (prevInfo.title === field1Data.name && prevInfo.link === field2Data.name) {
        showToast('warning', 'infoAlreadySaved');
        setLoading(false);
        return;
      }
      const payload = {
        newData,
        type,
        uuid: localStorage.getItem('uuid'),
        id: prevInfo.id,
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }

      const updateBadge = await api.post(`/addBadge/personal/updateWorkOrEducation`, payload);
      if (updateBadge.status === 200) {
        queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
        showToast('success', 'infoUpdated');
        setLoading(false);
        setAddAnotherForm(false);
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      handleClose();
    }

    setFetchingEdit(false);
  };

  const handleEdit = async (id) => {
    const payload = {
      id: id,
      uuid: localStorage.getItem('uuid'),
      type: type,
    };
    if (localStorage.getItem('legacyHash')) {
      payload.infoc = localStorage.getItem('legacyHash');
    }
    const info = await api.post(`/addBadge/personal/getWorkOrEducation`, payload);
    setPrevInfo(info?.data?.obj);
    if (info.status === 200) {
      setFetchingEdit(false);
      const data = info?.data.obj;

      setField1Data(data.title);
      setField2Data(data.link);

      setHollow(false);
    }
  };

  const handleTab = (index, key) => {
    if (index === 1) {
      document.getElementById(`input-${index}`).blur();
    } else {
      if (key === 'Enter') {
        document.getElementById(`input-${index + 1}`).focus();
      } else {
        if (index > 1) {
          document.getElementById(`input-${index + 1}`).focus();
        } else {
          document.getElementById(`input-${index}`).focus();
        }
      }
    }
  };

  const checkHollow = () => {
    if (field1Data === '' || field2Data === '') {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkHollow();
  }, [field1Data, field2Data]);

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleBadgesClose = () => setModalVisible(false);

  const handleOnDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = existingData.findIndex((item) => item.id === active.id);
      const newIndex = existingData.findIndex((item) => item.id === over.id);
      const newData = arrayMove(existingData, oldIndex, newIndex);
      reOrderLinkHubLinks(newData);
      setExistingData(newData);
    }
  };

  const renderWorkField = (field1, field2) => {
    const [edit, setEdit] = useState(false);

    return (
      <>
        <div className="pb-[15px] tablet:pb-[25px]">
          {modalVisible && (
            <BadgeRemovePopup
              handleClose={handleBadgesClose}
              modalVisible={modalVisible}
              title={deleteModalState?.title}
              image={deleteModalState?.image}
              type={deleteModalState?.type}
              badgeType={deleteModalState?.badgeType}
              persistedUserInfo={persistedUserInfo}
              setIsPersonalPopup={setIsPersonalPopup}
              setIsLoading={setRemoveLoading}
              loading={RemoveLoading}
            />
          )}
          {/* To View Already Added Info */}
          {!addAnotherForm ? (
            <div className="mx-3 flex flex-col gap-[2px] tablet:mx-[40px] tablet:gap-[5px]">
              <h1 className="text-gray-1 py-3 text-[12px] font-medium leading-[13.56px] dark:text-white-400 tablet:pb-[13px] tablet:text-[16px] tablet:leading-normal">
                Put all your essential links in one place on your Home Page, making it easier for others to find and
                connect with you across platforms
              </h1>

              {/* LinkHub Items */}
              {existingData && (
                <DndContext
                  sensors={[touchSensor, mouseSensor, keyboardSensor]}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  collisionDetection={closestCorners}
                  onDragEnd={handleOnDragEnd}
                >
                  <SortableContext items={existingData} strategy={verticalListSortingStrategy}>
                    {existingData?.map((item) => (
                      <LinkHubItem
                        key={item.id}
                        id={item.id}
                        getIcon={getIcon}
                        item={item}
                        deleteItem={deleteItem}
                        setDeleteItem={setDeleteItem}
                        delLoading={delLoading}
                        setDelLoading={setDelLoading}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        setFetchingEdit={setFetchingEdit}
                        setAddAnotherForm={setAddAnotherForm}
                        setEdit={setEdit}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}

              {/* Add New Link Button*/}
              <div className="flex items-center justify-start">
                <Button
                  variant="addOption"
                  onClick={() => {
                    setEdit(false);
                    setAddAnotherForm(true);
                  }}
                >
                  <span className="text-[16px] tablet:text-[32px]">+</span>
                  {existingData ? 'Add New Link' : 'Add Link'}
                </Button>
              </div>

              {/* Remove Badge Button */}
              {existingData ? (
                <div className="flex items-center justify-end">
                  <Button
                    variant="badge-remove"
                    onClick={() => {
                      handleRemoveBadgePopup({
                        title: title,
                        type: type,
                        badgeType: 'personal',
                        image: logo,
                      });
                    }}
                  >
                    {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove Badge'}
                  </Button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div className="px-5 tablet:px-[60px] laptop:px-[72px]">
              <div className="mb-4 flex flex-col gap-[19.5px] pt-[15px] tablet:mb-5 tablet:gap-[38px] tablet:pt-[25px]">
                <div className="w-full">
                  <p className="text-gray-1 mb-1 text-[9.28px] font-medium leading-[11.23px] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field1.label}
                  </p>
                  {fetchingEdit ? (
                    <input
                      type="text"
                      value="Loading..."
                      disabled={true}
                      className={`caret-hidden revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                    />
                  ) : (
                    <input
                      id="input-0"
                      onKeyDown={(e) =>
                        (e.key === 'Tab' && handleTab(0)) || (e.key === 'Enter' && handleTab(0, 'Enter'))
                      }
                      type="text"
                      value={field1Data}
                      onChange={handlefield1Change}
                      placeholder={field1.placeholder}
                      className={`revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                    />
                  )}
                </div>

                <div className="w-full">
                  <p className="text-gray-1 mb-1 text-[9.28px] font-medium leading-[11.23px] tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field2.label}
                  </p>
                  {fetchingEdit ? (
                    <input
                      type="text"
                      value="Loading..."
                      disabled={true}
                      className={`caret-hidden revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                    />
                  ) : (
                    <input
                      id="input-1"
                      onKeyDown={(e) =>
                        (e.key === 'Tab' && handleTab(0)) || (e.key === 'Enter' && handleTab(0, 'Enter'))
                      }
                      type="text"
                      value={field2Data}
                      onChange={handlefield2Change}
                      placeholder={field2.placeholder}
                      className={`revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="addOption"
                  onClick={() => {
                    setField1Data('');
                    setField2Data('');
                    setAddAnotherForm(false);
                    setDelLoading(false);
                    setLoading(false);
                  }}
                  id="cancalTheForm"
                >
                  Cancel
                </Button>

                {hollow || checkHollow() ? (
                  <Button variant="submit-hollow" id="submitButton" disabled={true}>
                    {edit || existingData ? 'Update Badge' : 'Add Badge'}
                  </Button>
                ) : (
                  <Button
                    disabled={loading}
                    variant="submit"
                    onClick={() => {
                      const allFieldObject = {
                        id: uuidv4(),
                        title: field1Data,
                        link: field2Data,
                      };
                      if (edit) {
                        setLoading(true);
                        handleUpdateBadge(allFieldObject);
                      } else {
                        setLoading(true);
                        handleAddPersonalBadge(allFieldObject);
                      }
                    }}
                  >
                    {loading === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit || existingData ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        {onboarding && <ProgressBar handleSkip={handleSkip} />}
      </>
    );
  };

  return (
    <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
      {renderWorkField(
        { label: 'Title', placeholder: 'Enter title' },
        { label: 'Link', placeholder: 'Paste the link here' }
      )}
    </PopUp>
  );
};

export default LinkHubPopup;
