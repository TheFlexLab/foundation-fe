import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { useQueryClient } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import api from '../../services/api/Axios';
import CustomCombobox from '../ui/Combobox';
import { FaSpinner } from 'react-icons/fa';
import BadgeRemovePopup from './badgeRemovePopup';
import showToast from '../ui/Toast';
import ProgressBar from '../ProgressBar';
import { useSelector } from 'react-redux';

const School = {
  label: 'School',
  type: 'school',
  placeholder: 'School here',
};

const degreePrograms = {
  label: 'Degree Program',
  type: 'degreeProgram',
  placeholder: 'Degree here',
};

const fieldOfStudy = {
  label: 'Field of Study',
  type: 'fieldOfStudy',
  placeholder: 'Field of Study here',
};

const StartingYear = {
  label: 'Start Date',
  placeholder: 'Year here',
  type: 'startingYear',
};

const graduationYear = {
  label: 'Graduation Date',
  placeholder: 'Year here / Present',
  type: 'graduationYear',
};

const EducationBadgePopup = ({
  isPopup,
  setIsPopup,
  type,
  title,
  logo,
  fetchUser,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  page,
  selectedBadge,
}) => {
  const queryClient = useQueryClient();
  const [universities, setUniversities] = useState([]);
  const [field1Data, setField1Data] = useState([]);
  const [field2Data, setField2Data] = useState([]);
  const [field3Data, setField3Data] = useState();
  const [field4Data, setField4Data] = useState();
  const [field5Data, setField5Data] = useState([]);
  const [prevInfo, setPrevInfo] = useState({});
  const [isPresent, setIsPresent] = useState(false);
  const [existingData, setExistingData] = useState(selectedBadge?.personal?.education || []);
  const [query, setQuery] = useState('');
  const [query2, setQuery2] = useState('');
  const [query3, setQuery3] = useState('');
  const [deleteItem, setDeleteItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hollow, setHollow] = useState(false);
  const [isError2, setIsError2] = useState(false);
  const [eduData, setEduData] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [fetchingEdit, setFetchingEdit] = useState(false);
  const [addAnotherForm, setAddAnotherForm] = useState(false);
  const persistedUserInfo = useSelector((state) => state.auth.user);

  const searchDegreeAndFields = async (type, query) => {
    try {
      const jb = await api.post(`search/searchDegreesAndFields/?name=${query}&type=${type}`);

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

      setEduData(newArr);
    } catch (err) {
      setEduData([{ id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: query, button: true }]);
    }
  };

  useEffect(() => {
    setHollow(true);
    setIsError(false);
    searchDegreeAndFields(degreePrograms.type, query2);
  }, [query2]);

  useEffect(() => {
    setHollow(true);
    setIsError2(false);
    searchDegreeAndFields(fieldOfStudy.type, query3);
  }, [query3]);

  const searchUniversities = async () => {
    const universities = await api.post(`search/searchUniversities/?name=${query}`);
    setUniversities(universities.data);
  };

  const handlePresentToggle = () => {
    setIsPresent(!isPresent);
    if (!isPresent) {
      setField4Data('Present');
    } else {
      setField4Data('');
    }
  };

  useEffect(() => {
    searchUniversities();
  }, [query]);

  const handleClose = () => setIsPopup(false);

  const handlefield3Change = (event) => {
    const value = event.target.value;
    setField3Data(value);
  };

  const handlefield4Change = (event) => {
    const value = event.target.value;
    setField4Data(value);
  };

  const handleAddPersonalBadge = async (data) => {
    try {
      if (
        field1Data.name === undefined ||
        field2Data.name === undefined ||
        field2Data.name === '' ||
        field3Data === undefined ||
        field4Data === undefined ||
        field4Data === '' ||
        field5Data.name === undefined ||
        field5Data.name === ''
      ) {
        showToast('error', 'blankField');
        setLoading(false);
        return;
      }

      if (field4Data < field3Data) {
        showToast('error', 'graduationDateEarlierStart');
        setLoading(false);
        return;
      }
      if (field4Data === field3Data) {
        showToast('error', 'graduationDateSameStart');
        setLoading(false);
        return;
      }

      if (existingData.length > 0) {
        if (existingData.some((item) => item.id === field1Data.id)) {
          showToast('error', 'schoolAlreadyExist');

          setLoading(false);
          return;
        }
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
        if (field2Data.button) {
          const dataSaved = await api.post(`/addBadge/degreesAndFields/add`, {
            name: field2Data.name,
            uuid: localStorage.getItem('uuid'),
            type: degreePrograms.type,
          });
          if (dataSaved.status === 200) {
            console.log(dataSaved);
          }
        }
        if (field5Data.button) {
          const dataSaved2 = await api.post(`/addBadge/degreesAndFields/add`, {
            name: field5Data.name,
            uuid: localStorage.getItem('uuid'),
            type: fieldOfStudy.type,
          });
          if (dataSaved2.status === 200) {
            console.log(dataSaved2);
          }
        }
        if (existingData.length > 0) {
          showToast('success', 'infoUpdated');
        } else {
          showToast('success', 'badgeAdded');
        }
        if (onboarding) {
          handleSkip();
          return;
        }
        setExistingData(addBadge.data.data);
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        setLoading(false);
        setDelLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
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
      queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
      setDelLoading(false);
      setExistingData(companies.data.data);
    }
  };

  const handleUpdateBadge = async (newData) => {
    try {
      if (
        field1Data.name === undefined ||
        field2Data.name === undefined ||
        field2Data.name === '' ||
        field3Data === undefined ||
        field4Data === undefined ||
        field4Data === '' ||
        field5Data.name === undefined ||
        field5Data.name === ''
      ) {
        showToast('warning', 'blankField');
        setLoading(false);
        return;
      }
      if (field4Data < field3Data) {
        showToast('warning', 'graduationDateSameStart');
        setLoading(false);
        return;
      }
      if (field4Data === field3Data) {
        showToast('warning', 'graduationDateSameStart');
        setLoading(false);
        return;
      }

      if (
        prevInfo.school === field1Data.name &&
        prevInfo.degreeProgram === field2Data.name &&
        prevInfo.fieldOfStudy === field5Data.name &&
        prevInfo.startingYear === field3Data &&
        prevInfo.graduationYear === field4Data
      ) {
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
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        showToast('success', 'infoUpdated');
        if (field2Data.button) {
          const dataSaved = await api.post(`/addBadge/degreesAndFields/add`, {
            name: field2Data.name,
            uuid: localStorage.getItem('uuid'),
            type: degreePrograms.type,
          });
          if (dataSaved.status === 200) {
            console.log(dataSaved);
          }
        }
        if (field5Data.button) {
          const dataSaved2 = await api.post(`/addBadge/degreesAndFields/add`, {
            name: field5Data.name,
            uuid: localStorage.getItem('uuid'),
            type: fieldOfStudy.type,
          });
          if (dataSaved2.status === 200) {
            console.log(dataSaved2);
          }
        }
        setExistingData(updateBadge.data.data);

        setLoading(false);
        setAddAnotherForm(false);
      }
    } catch (error) {
      showToast('error', 'error', {}, error.response.data.message.split(':')[1]);
      setAddAnotherForm(false);
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

      setField1Data({ id: data.id, name: data.school, country: data.country });
      setField2Data({ id: data.id, name: data.degreeProgram });
      setField5Data({ id: data.id, name: data.fieldOfStudy });
      setField3Data(data.startingYear);
      if (data.graduationYear === 'Present') {
        setIsPresent(true);
        setField4Data(data.graduationYear);
      } else {
        setField4Data(data.graduationYear);
      }
      setHollow(false);
    }
  };

  const handleTab = (index, key) => {
    if (index === 3) {
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

  const verifyDegree = async (toVerify) => {
    setHollow(true);
    const response = await api.get(`/ai-validation/7?userMessage=${toVerify}`);
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

  const verifyFieldOfStudy = async (toVerify) => {
    setHollow(true);
    const response = await api.get(`/ai-validation/8?userMessage=${toVerify}`);
    if (
      response.data.message === 'Rejected' ||
      response.data.message === 'Rejected.' ||
      response.data.status === 'VIOLATION'
    ) {
      setIsError2(true);
      setHollow(true);
    } else {
      if (response.data.message !== 'Accepted') {
        setField5Data({ ...field5Data, name: response.data.message });
      }
      setHollow(false);
      setIsError2(false);
    }
  };

  const checkHollow = () => {
    if (
      field1Data.name === undefined ||
      field2Data.name === undefined ||
      field2Data.name === '' ||
      !field3Data ||
      !field4Data ||
      field5Data.name === undefined ||
      field5Data.name === ''
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    checkHollow();
  }, [field1Data, field2Data, field3Data, field4Data, field5Data]);

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleBadgesClose = () => setModalVisible(false);

  const renderWorkField = (field1, field2, field3, field4, field5) => {
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
              fetchUser={fetchUser}
              setIsPersonalPopup={setIsPersonalPopup}
              setIsLoading={setRemoveLoading}
              loading={RemoveLoading}
            />
          )}
          {/* To View Already Added Info */}
          {!addAnotherForm ? (
            <div className="mx-3 flex flex-col gap-[2px] tablet:mx-[40px] tablet:gap-[5px]">
              <h1 className="py-3 text-[12px] font-medium leading-[13.56px] text-gray-1 dark:text-white-400 tablet:pb-[13px] tablet:text-[16px] tablet:leading-normal">
                {page === 'badgeHub'
                  ? ''
                  : 'Your educational background paves the way for reward opportunities aligned with your expertise.'}
              </h1>
              {existingData.length > 0 &&
                existingData.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full justify-between rounded-[8.62px] border border-white-500 bg-[#FBFBFB] pl-[9px] text-[9.28px] font-medium leading-[11.23px] text-[#B6B4B4] focus:outline-none dark:border-gray-100 dark:bg-gray-200 dark:text-[#f1f1f1] tablet:rounded-[21.06px] tablet:border-[3px] tablet:pl-7 tablet:text-[18px] tablet:leading-[21px]"
                  >
                    <div className="py-3 tablet:py-[25px]">
                      <h4 className="max-w-[324px] text-[9.28px] font-medium leading-[11.23px] text-gray-1 dark:text-[#f1f1f1] tablet:text-[22px] tablet:leading-[26.63px]">
                        {item.school}
                      </h4>
                      <div className="mt-[2px] max-w-[270px] tablet:mt-2">
                        <h5 className="text-[9.28px] font-medium leading-[11.23px] text-gray-1 dark:text-[#f1f1f1] tablet:text-[20px] tablet:leading-[26.63px]">
                          {item.degreeProgram + ' ' + 'in' + ' ' + item.fieldOfStudy}
                        </h5>
                        <h6 className="text-[8.28px] font-medium leading-[10.93px] text-[#B6B4B4] dark:text-[#f1f1f1] tablet:text-[18px] tablet:leading-[26.63px]">
                          {item.country}
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
                          {item.startingYear + '-' + item.graduationYear}
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
                      {existingData?.length >= 1 ? 'Add New Education' : 'Add Education'}
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
                        {RemoveLoading === true ? <FaSpinner className="animate-spin text-[#EAEAEA]" /> : 'Remove'}
                      </Button>
                    </div>
                  ) : (
                    <div></div>
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
                <CustomCombobox
                  items={universities}
                  placeholder={edit ? (field1Data?.name ? field1.placeholder : 'Loading...') : field1.placeholder}
                  selected={field1Data}
                  setSelected={setField1Data}
                  query={query}
                  setQuery={setQuery}
                  id={1}
                  handleTab={handleTab}
                  disabled={edit ? (field1Data.name ? false : true) : false}
                />
              </div>
              <div className="mb-4 mt-[15px] flex gap-[6.5px] tablet:mb-5 tablet:gap-[10px] tablet:pt-[25px]">
                <div className="w-full">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field2.label}
                  </p>
                  <CustomCombobox
                    items={eduData}
                    placeholder={edit ? (field2Data?.name ? field2.placeholder : 'Loading...') : field2.placeholder}
                    selected={field2Data}
                    setSelected={setField2Data}
                    query={query2}
                    verify={verifyDegree}
                    setQuery={setQuery2}
                    setHollow={setHollow}
                    setError={setIsError}
                    id={2}
                    handleTab={handleTab}
                    verification={true}
                    wordsCheck={true}
                    disabled={edit ? (field2Data.name ? false : true) : false}
                  />
                  {isError && (
                    <p className="top-25 absolute ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${field2.label}!`}</p>
                  )}
                </div>
                <p className="flex items-center pt-4 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:pt-10 tablet:text-[20px]">
                  in
                </p>
                <div className="w-full">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field5.label}
                  </p>
                  <CustomCombobox
                    items={eduData}
                    placeholder={edit ? (field5Data?.name ? field5.placeholder : 'Loading...') : field5.placeholder}
                    selected={field5Data}
                    setSelected={setField5Data}
                    query={query3}
                    verify={verifyFieldOfStudy}
                    setQuery={setQuery3}
                    setHollow={setHollow}
                    setError={setIsError2}
                    id={3}
                    handleTab={handleTab}
                    verification={true}
                    disabled={edit ? (field5Data.name ? false : true) : false}
                  />

                  {isError2 && (
                    <p className="top-25 absolute ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${field5.label}!`}</p>
                  )}
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
                Not Completed
              </label>

              <div className="mb-4 mt-[15px] flex gap-[19.5px] tablet:mb-5 tablet:mt-[25px] tablet:gap-[38px]">
                <div className="w-full">
                  <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                    {field3.label}
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
                      id="input-4"
                      onKeyDown={(e) =>
                        (e.key === 'Tab' && handleTab(4)) || (e.key === 'Enter' && handleTab(4, 'Enter'))
                      }
                      type="date"
                      value={field3Data}
                      onChange={handlefield3Change}
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
                      {field4.label}
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
                        id="input-5"
                        onKeyDown={(e) =>
                          (e.key === 'Tab' && handleTab(4)) || (e.key === 'Enter' && handleTab(4, 'Enter'))
                        }
                        type="date"
                        value={field4Data}
                        onChange={handlefield4Change}
                        placeholder={field4.placeholder}
                        className={`revert-calender-color w-full rounded-[8.62px] border border-white-500 bg-[#FBFBFB] px-[12px] py-2 text-[9.28px] font-medium leading-[11.23px] text-[#707175] focus:outline-none dark:border-gray-100 dark:bg-accent-100 dark:text-gray-300 tablet:rounded-[10px] tablet:border-[3px] tablet:px-[28px] tablet:py-3 tablet:text-[18px] tablet:leading-[21px]`}
                        style={{ textTransform: 'uppercase' }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="addOption"
                  onClick={() => {
                    setField1Data([]);
                    setField2Data([]);
                    setField3Data();
                    setField4Data();
                    setField5Data([]);
                    setIsPresent(false);
                    setAddAnotherForm(false);
                    setDelLoading(false);
                    setLoading(false);
                  }}
                  id="cancalTheForm"
                >
                  Cancel
                </Button>

                {hollow || isError || isError2 || checkHollow() ? (
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
                        [field5.type]: field5Data.name,
                        ['country']: field1Data.country,
                        [field3.type]: field3Data,
                        [field4.type]: field4Data,
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
      {title === 'Education' && renderWorkField(School, degreePrograms, StartingYear, graduationYear, fieldOfStudy)}
    </PopUp>
  );
};

export default EducationBadgePopup;
