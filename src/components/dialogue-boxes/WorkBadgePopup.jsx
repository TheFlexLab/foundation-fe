import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import ListBox from '../ui/ListBox';
import { FaSpinner } from 'react-icons/fa';
import BadgeRemovePopup from './badgeRemovePopup';
import { useQueryClient } from '@tanstack/react-query';
import showToast from '../ui/Toast';
import ProgressBar from '../ProgressBar';
import { useSelector } from 'react-redux';

const CompanyName = {
  label: 'Company Name',
  type: 'companyName',
  placeholder: 'Company here',
};

const jobTitles = {
  label: 'Title',
  type: 'jobTitle',
  placeholder: 'Job Title here',
};

const EmploymentType = {
  label: 'Employement Type',
  placeholder: 'Full time / Part time',
  items: [
    { id: 1, name: 'Full Time' },
    { id: 2, name: 'Part Time' },
  ],
  type: 'employmentType',
};

const Mode = {
  label: 'Mode of Job',
  placeholder: 'Choose',
  items: [
    { id: 1, name: 'Remote' },
    { id: 2, name: 'Hybrid' },
    { id: 3, name: 'Onsite' },
  ],
  type: 'modeOfJob',
};

const startingYear = {
  label: 'Start Date',
  placeholder: 'Year here',
  type: 'startingYear',
};

const endingYear = {
  label: 'End Date',
  placeholder: 'Date here / Present',
  type: 'endingYear',
};

const WorkBadgePopup = ({
  isPopup,
  setIsPopup,
  type,
  title,
  logo,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  progress,
  page,
  selectedBadge,
}) => {
  const queryClient = useQueryClient();
  const [field1Data, setField1Data] = useState([]);
  const [field2Data, setField2Data] = useState([]);
  const [delLoading, setDelLoading] = useState(false);
  const [field4Data, setField4Data] = useState([]);
  const [field5Data, setField5Data] = useState();
  const [field6Data, setField6Data] = useState();
  const [isPresent, setIsPresent] = useState(false);
  const [prevInfo, setPrevInfo] = useState({});
  const [deleteItem, setDeleteItem] = useState('');
  const [isError, setIsError] = useState(false);
  const [hollow, setHollow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(false);
  const [addAnotherForm, setAddAnotherForm] = useState(false);
  const [existingData, setExistingData] = useState(selectedBadge?.personal?.work || []);
  const [query, setQuery] = useState('');
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const handleClose = () => setIsPopup(false);

  const searchJobTitles = async () => {
    try {
      const jb = await api.post(`search/searchJobTitles/?name=${query}`);

      const queryExists = jb.data.some((item) => item.name.toLowerCase() === query.toLowerCase());
      const newArr = queryExists
        ? [...jb.data]
        : [
            { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: query, button: true },
            ...jb.data.map((jb) => ({
              ...jb,
              id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            })),
          ];

      setJobs(newArr);
    } catch (err) {
      setJobs([{ id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: query, button: true }]);
    }
  };

  useEffect(() => {
    setHollow(true);
    setIsError(false);
    searchJobTitles();
  }, [query]);

  const handlePresentToggle = () => {
    setIsPresent(!isPresent);
    if (!isPresent) {
      setField6Data('Present');
    } else {
      setField6Data('');
    }
  };

  const handleTab = (index, key) => {
    if (index === 2) {
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
    if (
      field1Data.name === undefined ||
      field2Data.name === undefined ||
      field4Data.name === undefined ||
      !field5Data ||
      !field6Data
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkHollow();
  }, [field1Data, field2Data, field4Data, field5Data, field6Data]);

  const handleAddPersonalBadge = async (data) => {
    try {
      if (
        field1Data.name === undefined ||
        field2Data.name === undefined ||
        field4Data.name === undefined ||
        field5Data === undefined ||
        field6Data === undefined ||
        field6Data === ''
      ) {
        showToast('error', 'blankField');
        setLoading(false);
        return;
      }

      if (field6Data < field5Data) {
        showToast('warning', 'DateEarlierStart');
        setLoading(false);

        return;
      }
      if (field6Data === field5Data) {
        showToast('warning', 'DateSameStart');
        setLoading(false);
        return;
      }
      const payload = {
        data,
        type,
        uuid: localStorage.getItem('uuid'),
      };
      if (localStorage.getItem('legacyHash')) {
        payload.infoc = localStorage.getItem('legacyHash');
      }
      const addBadge = await api.post(`/addBadge/personal/addWorkOrEducation`, payload);
      if (addBadge.status === 200) {
        const companySaved = await api.post(`/addBadge/company/add`, {
          name: field1Data.name,
          uuid: localStorage.getItem('uuid'),
        });
        if (companySaved.status === 200) {
          console.log(companySaved);
        }

        if (field2Data.button) {
          const jobsSaved = await api.post(`/addBadge/jobTitles/add`, {
            name: field2Data.name,
            uuid: localStorage.getItem('uuid'),
          });
          if (jobsSaved.status === 200) {
            console.log(jobsSaved);
          }
        }
        if (existingData.length > 0) {
          showToast('success', 'infoUpdated');
        } else {
          showToast('success', 'badgeAdded');
        }
        setExistingData(addBadge.data.data);
        if (onboarding) {
          handleSkip();
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        setLoading(false);
        setAddAnotherForm(false);
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      setAddAnotherForm(false);
    }
  };

  const verifyJobTitle = async (toVerify) => {
    setHollow(true);
    const response = await api.get(`/ai-validation/9?userMessage=${toVerify}`);
    if (
      response.data.message === 'Rejected' ||
      response.data.message === 'Rejected.' ||
      response.data.status === 'VIOLATION'
    ) {
      setIsError(true);
      setHollow(true);
    } else {
      if (response.data.message !== 'Accepted') {
        setField2Data({ ...field2Data, name: response.data.message });
      }
      setIsError(false);
      setHollow(false);
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
      queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
      console.log(companies.data);
      setExistingData(companies.data.data);
    }
  };

  const handleUpdateBadge = async (newData) => {
    try {
      if (
        prevInfo.companyName === field1Data.name &&
        prevInfo.jobTitle === field2Data.name &&
        prevInfo.modeOfJob === field4Data.name &&
        prevInfo.startingYear === field5Data &&
        prevInfo.endingYear === field6Data
      ) {
        showToast('warning', 'infoAlreadySaved');
        setLoading(false);

        return;
      }
      if (field6Data < field5Data) {
        showToast('warning', 'DateEarlierStart');
        setLoading(false);

        return;
      }
      if (field6Data === field5Data) {
        showToast('warning', 'DateSameStart');
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
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        showToast('success', 'infoUpdated');
        if (prevInfo.CompanyName !== field1Data.name) {
          const companySaved = await api.post(`/addBadge/company/add`, {
            name: field1Data.name,
            uuid: localStorage.getItem('uuid'),
          });
          if (companySaved.status === 200) {
            console.log(companySaved);
          }
        }
        if (field2Data.button) {
          const jobsSaved = await api.post(`/addBadge/jobTitles/add`, {
            name: field2Data.name,
            uuid: localStorage.getItem('uuid'),
          });
          if (jobsSaved.status === 200) {
            console.log(jobsSaved);
          }
        }
        setLoading(false);
        setAddAnotherForm(false);
        setExistingData(updateBadge.data.data);
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      setAddAnotherForm(false);
    }
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
      setHollow(false);
      console.log(info);
      const data = info?.data.obj;

      setField1Data({ id: data.id, name: data.companyName });
      setField2Data({ name: data.jobTitle });
      setField4Data({ name: data.modeOfJob });
      setField5Data(data.startingYear);
      if (data.endingYear === 'Present') {
        setIsPresent(true);
        setField6Data(data.endingYear);
      } else {
        setField6Data(data.endingYear);
      }
      setFetchingEdit(false);
    }
  };

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleBadgesClose = () => setModalVisible(false);

  const renderWorkField = (field1, field2, field3, field4, field5, field6) => {
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
              setIsPersonalPopup={setIsPersonalPopup}
              setIsLoading={setRemoveLoading}
              loading={RemoveLoading}
            />
          )}
          {!addAnotherForm ? (
            <div className="mx-3 flex flex-col gap-[2px] tablet:mx-[40px] tablet:gap-[5px]">
              <h1 className="py-3 text-[12px] font-medium leading-[13.56px] text-gray-1 dark:text-white-400 tablet:pb-[13px] tablet:text-[16px] tablet:leading-normal">
                {page === 'badgeHub' ? '' : 'Your work experience opens opportunities tailored to your expertise.'}
              </h1>
              {existingData.length > 0 &&
                existingData.map((item, index) => (
                  <div
                    key={index}
                    className="mb-4 flex w-full justify-between rounded-[8.62px] border border-white-500 bg-[#FBFBFB] pl-[9px] text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none dark:border-gray-100 dark:bg-gray-200 dark:text-[#f1f1f1] tablet:rounded-[21.06px] tablet:border-[3px] tablet:pl-7 tablet:text-[18px] tablet:leading-[21px]"
                  >
                    <div className="py-3 tablet:py-[25px]">
                      <h4 className="max-w-[324px] text-[9.28px] font-medium leading-[11.23px] text-gray-1 dark:text-[#f1f1f1] tablet:text-[22px] tablet:leading-[26.63px]">
                        {item.companyName}
                      </h4>
                      <div className="max-w-[270px]">
                        <h5 className="text-[9.28px] font-medium leading-[11.23px] text-gray-1 dark:text-[#f1f1f1] tablet:text-[20px] tablet:leading-[26.63px]">
                          {item.jobTitle}
                        </h5>
                        <h6 className="text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] dark:text-[#f1f1f1] tablet:text-[18px] tablet:leading-[26.63px]">
                          {item.modeOfJob}
                        </h6>
                      </div>
                    </div>
                    {deleteItem === item.id ? (
                      <div className="max-w-[160px] rounded-[10.06px] border-l border-white-500 px-[9px] py-2 tablet:max-w-[342px] tablet:rounded-[21.06px] tablet:border-l-[3px] tablet:px-5 tablet:py-[15px]">
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
                        {page === 'badgeHub' ? (
                          <div></div>
                        ) : (
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
                        )}
                        <h4 className="text-[8.28px] font-medium leading-[10.93px] text-[#A7A7A7] dark:text-[#f1f1f1] tablet:text-[18px] tablet:leading-[26.63px]">
                          {item.startingYear + ' - ' + item.endingYear}
                        </h4>
                      </div>
                    )}
                  </div>
                ))}
              {page === 'badgeHub' ? (
                <div className="flex justify-end gap-[15px] tablet:gap-[35px]">
                  <Button variant={'cancel'} onClick={handleClose}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-start">
                    <Button
                      variant="addOption"
                      onClick={() => {
                        setEdit(false);
                        setAddAnotherForm(true);
                      }}
                    >
                      <span className="text-[16px] tablet:text-[32px]">+</span>
                      {existingData.length > 0 ? 'Add New Work' : 'Add Work'}
                    </Button>
                  </div>
                  {existingData.length > 0 ? (
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
                        {RemoveLoading === true ? (
                          <FaSpinner className="animate-spin text-[#EAEAEA]" />
                        ) : (
                          'Remove Badge'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="px-5 pt-[15px] tablet:px-[60px] laptop:px-[72px]">
              <div className="mb-[5px] tablet:mb-[15px]">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field1.label}
                </p>
                <input
                  type="text"
                  value={edit ? (!fetchingEdit ? field1Data.name : 'Loading...') : field1Data.name}
                  onChange={(e) => {
                    setField1Data({ id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: e.target.value });
                  }}
                  disabled={fetchingEdit ? true : false}
                  onKeyDown={(e) => (e.key === 'Tab' && handleTab(1)) || (e.key === 'Enter' && handleTab(1, 'Enter'))}
                  id="input-1"
                  placeholder={field1.placeholder}
                  className="verification_badge_input"
                />
              </div>
              <div className="mb-[5px] mt-[15px] tablet:mb-[15px]">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  {field2.label}
                </p>
                <CustomCombobox
                  items={jobs}
                  placeholder={edit ? (field2Data?.name ? field2.placeholder : 'Loading...') : field2.placeholder}
                  selected={field2Data}
                  setSelected={setField2Data}
                  query={query}
                  setQuery={setQuery}
                  id={2}
                  handleTab={handleTab}
                  verify={verifyJobTitle}
                  setHollow={setHollow}
                  setError={setIsError}
                  verification={true}
                  disabled={edit ? (field2Data?.name ? false : true) : false}
                />
                {isError && (
                  <p className="top-25 absolute ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${field2.label}!`}</p>
                )}
              </div>
              <div className="flex items-center gap-[17.5px] tablet:gap-9">
                <div className="my-[5px] w-full tablet:mb-[25px]">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field4.label}
                  </p>
                  <div className="z-20 flex flex-col gap-[10px] tablet:gap-[15px]">
                    <ListBox
                      items={field4.items}
                      selected={field4Data}
                      setSelected={setField4Data}
                      placeholder={edit ? (field4Data?.name ? field4.placeholder : 'Loading...') : field4.placeholder}
                      disabled={edit ? (field4Data?.name ? false : true) : false}
                    />
                  </div>
                </div>
              </div>
              <label
                id="custom-square-checkbox"
                className="flex items-center gap-2 text-[10px] font-medium text-gray-1 tablet:gap-[15px] tablet:text-[20px]"
              >
                <input
                  type="checkbox"
                  checked={isPresent}
                  onChange={handlePresentToggle}
                  className="checkbox size-[14px] tablet:size-[25px]"
                />
                I am currently working in this role
              </label>

              <div className="mt-[15px] flex gap-[17.5px] tablet:mb-5 tablet:mt-[25px] tablet:gap-[37px]">
                <div className="w-full">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field5.label}
                  </p>
                  {fetchingEdit ? (
                    <input
                      type="text"
                      value="Loading..."
                      disabled={true}
                      className={`caret-hidden revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                    />
                  ) : (
                    <input
                      type="date"
                      value={field5Data}
                      onChange={(e) => setField5Data(e.target.value)}
                      placeholder={field5.placeholder}
                      className={`revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                      style={{ textTransform: 'uppercase' }}
                    />
                  )}
                </div>
                {isPresent ? (
                  <div className="w-full"></div>
                ) : (
                  <div className="w-full">
                    <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                      {field6.label}
                    </p>
                    {fetchingEdit ? (
                      <input
                        type="text"
                        value="Loading..."
                        disabled={true}
                        className={`caret-hidden revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                      />
                    ) : (
                      <input
                        type="date"
                        value={field6Data}
                        onChange={(e) => setField6Data(e.target.value)}
                        disabled={isPresent}
                        placeholder={field6.placeholder}
                        className={`revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                        style={{ textTransform: 'uppercase' }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="mt-[10px] flex justify-between">
                <Button
                  variant="addOption"
                  onClick={() => {
                    setField1Data([]);
                    setField2Data([]);
                    setField4Data([]);
                    setField5Data();
                    setField6Data();
                    setIsPresent(false);

                    setAddAnotherForm(false);
                  }}
                >
                  Cancel
                </Button>
                {hollow || checkHollow() ? (
                  <Button variant="submit-hollow" id="submitButton" disabled={true}>
                    {edit || existingData?.length >= 1 ? 'Update Badge' : 'Add Badge'}
                  </Button>
                ) : (
                  <Button
                    disabled={loading}
                    variant="submit"
                    onClick={() => {
                      const allFieldObject = {
                        ['id']: field1Data.id,
                        [field1.type]: field1Data.name,
                        [field2.type]: field2Data.name,
                        [field4.type]: field4Data.name,
                        [field5.type]: field5Data,
                        [field6.type]: field6Data,
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
                    ) : edit || existingData?.length >= 1 ? (
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
      {title === 'Work' && renderWorkField(CompanyName, jobTitles, EmploymentType, Mode, startingYear, endingYear)}
    </PopUp>
  );
};

export default WorkBadgePopup;
