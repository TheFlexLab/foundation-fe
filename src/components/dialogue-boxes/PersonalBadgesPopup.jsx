import { Button } from '../ui/Button';
import { FaSpinner } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../utils/useDebounce';
import { validation } from '../../services/api/badgesApi';
import { useQuery } from '@tanstack/react-query';
import PopUp from '../ui/PopUp';
import showToast from '../ui/Toast';
import Listbox from '../ui/ListBox';
import ProgressBar from '../ProgressBar';
import CustomCombobox from '../ui/Combobox';
import BadgeRemovePopup from './badgeRemovePopup';
import { useAddPersonalBadge, useSearchCities, useUpdateBadge } from '../../services/mutations/verification-adges';
import { relationshipData, sexOptions } from '../../constants/verification-badges';

const data = [
  { id: 1, name: 'In what city were you born?' },
  { id: 2, name: 'What is the name of your first pet?' },
  { id: 2, name: 'What is the last name of your favorite teacher?' },
];

const PersonalBadgesPopup = ({
  isPopup,
  setIsPopup,
  title,
  type,
  logo,
  placeholder,
  edit,
  setIsPersonalPopup,
  handleSkip,
  onboarding,
  progress,
  page,
  selectedBadge,
}) => {
  const [selected, setSelected] = useState();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [RemoveLoading, setRemoveLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [check, setCheck] = useState(edit ? false : true);
  const [deleteModalState, setDeleteModalState] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [prevInfo, setPrevInfo] = useState();
  const [hollow, setHollow] = useState(edit ? false : true);
  const [fetchingEdit, setFetchingEdit] = useState(false);
  const [query, setQuery] = useState('');
  const [questions, setQuestion] = useState();
  const debounceName = useDebounce(name, 1000);

  const handleClose = () => setIsPopup(false);
  const handleNameChange = (e) => setName(e.target.value);

  const { mutateAsync: searchCities } = useSearchCities();
  const { mutateAsync: handleUpdateBadge, isPending: loading } = useUpdateBadge(handleClose);
  const { mutateAsync: handleAddPersonalBadge, isPending: addLoading } = useAddPersonalBadge(
    handleClose,
    setName,
    onboarding,
    type,
    handleSkip
  );

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
  };

  useEffect(() => {
    const jb = data;
    const queryExists = jb.some((item) => item.name.toLowerCase() === query.toLowerCase());
    const newArr = queryExists
      ? [...jb]
      : [
          { id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`, name: query, button: true },
          ...jb.map((jb) => ({
            ...jb,
            id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          })),
        ];

    setQuestion(newArr);
  }, [query]);

  useEffect(() => {
    if (edit) {
      const value = selectedBadge?.personal[type];
      setPrevInfo(value);
      if (type === 'firstName' || type === 'lastName' || type === 'geolocation') {
        setName(value);
      }
      if (type === 'dateOfBirth') {
        setDate(value);
      }
      if (type === 'currentCity' || type === 'homeTown' || type === 'relationshipStatus' || type === 'sex') {
        setSelected({ name: value });
      }
      if (type === 'security-question') {
        setSelected({ name: Object.keys(value)[0] });
        setName(value[Object.keys(value)[0]]);
      }
    }
  }, []);

  useEffect(() => {
    const isSameAsPrev = (value) => value === prevInfo;
    const hasValue = (value) => Boolean(value);

    if (edit) {
      switch (type) {
        case 'dateOfBirth':
          setHollow(!hasValue(date) || isSameAsPrev(date));
          break;

        case 'geolocation':
        case 'firstName':
        case 'lastName':
          setHollow(!hasValue(name) || (type !== 'geolocation' && check) || isSameAsPrev(name));
          break;

        case 'security-question':
          if (name && selected?.name) {
            setHollow(
              prevInfo && name === prevInfo[Object.keys(prevInfo)[0]] && selected.name === Object.keys(prevInfo)[0]
            );
          } else {
            setHollow(true);
          }
          break;

        case 'currentCity':
        case 'homeTown':
        case 'relationshipStatus':
        case 'sex':
          setHollow(!hasValue(selected?.name) || isSameAsPrev(selected?.name));
          break;

        default:
          setHollow(true);
      }
    } else {
      switch (type) {
        case 'dateOfBirth':
          setHollow(!hasValue(date));
          break;

        case 'geolocation':
        case 'firstName':
        case 'lastName':
          setHollow(!hasValue(name) || (type !== 'geolocation' && check));
          break;

        case 'security-question':
          setHollow(!name || !selected?.name);
          break;

        case 'currentCity':
        case 'homeTown':
        case 'relationshipStatus':
        case 'sex':
          setHollow(!hasValue(selected?.name));
          break;

        default:
          setHollow(true);
      }
    }
  }, [date, selected, name, check, prevInfo, type, edit]);

  const { data: apiResp } = useQuery({
    queryKey: ['validate-name', (title === 'First Name' || title === 'Last Name') && debounceName],
    queryFn: () =>
      validation(title === 'First Name' ? 5 : title === 'Last Name' && 6, name.charAt(0).toUpperCase() + name.slice(1)),
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      const gotLocation = (position) => setName(position.coords.latitude + ',' + position.coords.longitude);

      navigator.geolocation.getCurrentPosition(gotLocation, () => {
        showToast('error', 'failedGettingLocation');
      });
    } else {
      showToast('error', 'locationNotSupported');
    }
  };

  useEffect(() => {
    if (edit) {
      if (prevInfo !== undefined && name !== undefined && prevInfo !== name)
        if (apiResp?.data?.message?.trim() === 'Yes' || apiResp?.data?.message?.trim() === 'Yes.') {
          setCheck(false);
        } else {
          setCheck(true);
        }
    } else {
      if (apiResp?.data?.message?.trim() === 'Yes' || apiResp?.data?.message?.trim() === 'Yes.') {
        setCheck(false);
      } else {
        setCheck(true);
      }
    }
  }, [apiResp]);

  useEffect(() => {
    const fetchCities = async () => {
      if ((type.trim() === 'currentCity' || type.trim() === 'homeTown') && query !== '') {
        const data = await searchCities(query);
        setCities(data);
      }
    };

    fetchCities();
  }, [type, query]);

  const handleRemoveBadgePopup = (item) => {
    setDeleteModalState(item);
    setModalVisible(true);
  };

  const handleBadgesClose = () => setModalVisible(false);

  const renderInputField = (title, name, placeholder, apiResp, data, placeholder2, summaryText) => {
    const isError = apiResp?.data?.message === 'No';

    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        {page !== 'badgeHub' && <h1 className="summary-text mb-[10px] tablet:mb-5">{summaryText}</h1>}
        {data && data.length >= 1 ? (
          <>
            <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
              <div className="my-[5px] w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  Security question
                </p>
                <div className="z-20 flex flex-col gap-[10px] tablet:gap-[15px]">
                  <CustomCombobox
                    items={questions}
                    selected={selected}
                    setSelected={setSelected}
                    query={query}
                    setQuery={setQuery}
                    placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
                    disabled={edit ? (selected?.name ? false : true) : false}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="mb-1 text-[9.28px] font-medium leading-[11.23px] text-gray-1 tablet:mb-[14px] tablet:text-[20px] tablet:leading-[24.2px]">
                  Answer
                </p>
                <input
                  type="text"
                  value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder={placeholder2}
                  disabled={fetchingEdit}
                  className={`verification_badge_input ${edit ? (name ? '' : 'caret-hidden') : ''}`}
                />
                {isError && (
                  <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
                )}
              </div>
            </div>
            <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
              {edit && (
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
              )}
              {hollow ? (
                <Button variant="submit-hollow" disabled={true}>
                  {(loading || addLoading) === true ? (
                    <FaSpinner className="animate-spin text-[#EAEAEA]" />
                  ) : edit ? (
                    'Update Badge'
                  ) : (
                    'Add Badge'
                  )}
                </Button>
              ) : (
                <Button
                  variant="submit"
                  onClick={() =>
                    edit
                      ? handleUpdateBadge({ type, date, name, prevInfo, selected })
                      : handleAddPersonalBadge({ type, date, name, selected })
                  }
                >
                  {(loading || addLoading) === true ? (
                    <FaSpinner className="animate-spin text-[#EAEAEA]" />
                  ) : edit ? (
                    'Update Badge'
                  ) : (
                    'Add Badge'
                  )}
                </Button>
              )}
            </div>
          </>
        ) : title === 'Geolocation' ? (
          <div className="relative">
            <input
              type="text"
              value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
              disabled
              placeholder={placeholder2}
              className="verification_badge_input"
            />
            {page === 'badgeHub' ? (
              <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
                <Button variant={'cancel'} onClick={handleClose}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="mt-[10px] flex justify-between gap-2 tablet:mt-5">
                <Button variant="submit" onClick={() => getLocation()} disabled={edit ? (name ? false : true) : false}>
                  Get Current location
                </Button>
                <div className="flex justify-between gap-[13px] tablet:gap-[35px]">
                  {edit && (
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
                  )}
                  {hollow ? (
                    <Button variant="submit-hollow" disabled={true}>
                      {(loading || addLoading) === true ? (
                        <FaSpinner className="animate-spin text-[#EAEAEA]" />
                      ) : edit ? (
                        'Update Badge'
                      ) : (
                        'Add Badge'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="submit"
                      onClick={() =>
                        edit
                          ? handleUpdateBadge({ type, date, name, prevInfo, selected })
                          : handleAddPersonalBadge({ type, date, name, selected })
                      }
                    >
                      {(loading || addLoading) === true ? (
                        <FaSpinner className="animate-spin text-[#EAEAEA]" />
                      ) : edit ? (
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
        ) : (
          <div className="relative">
            <input
              type="text"
              value={edit ? (!fetchingEdit ? name : 'Loading...') : name}
              onChange={(e) => {
                setCheck(true);
                setName(e.target.value);
              }}
              placeholder={placeholder}
              disabled={fetchingEdit}
              className={`verification_badge_input ${edit ? (name ? '' : 'caret-hidden') : ''}`}
            />
            {isError && (
              <p className="absolute ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
            )}
            <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
              {edit && (
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
              )}
              {hollow ? (
                <div className="flex gap-2">
                  <Button variant="submit-hollow" disabled={true}>
                    {(loading || addLoading) === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="submit"
                    onClick={() =>
                      edit
                        ? handleUpdateBadge({ type, date, name, prevInfo, selected })
                        : handleAddPersonalBadge({ type, date, name, selected })
                    }
                  >
                    {(loading || addLoading) === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentCity = (title, name, placeholder, apiResp, summaryText) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        {page !== 'badgeHub' && <h1 className="summary-text mb-[10px] tablet:mb-5">{summaryText}</h1>}
        <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
          <CustomCombobox
            items={cities}
            selected={selected}
            setSelected={setSelected}
            placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
            query={query}
            setQuery={setQuery}
            type={'city'}
            disabled={page === 'badgeHub' || (edit ? (selected?.name ? false : true) : false)}
          />
          {isError && (
            <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
          )}
        </div>
        {page === 'badgeHub' ? (
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
            <Button variant={'cancel'} onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
            {edit && (
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
            )}
            {hollow ? (
              <Button variant="submit-hollow" disabled={true}>
                {(loading || addLoading) === true ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : edit ? (
                  'Update Badge'
                ) : (
                  'Add Badge'
                )}
              </Button>
            ) : (
              <Button
                variant="submit"
                onClick={() =>
                  edit
                    ? handleUpdateBadge({ type, date, name, prevInfo, selected })
                    : handleAddPersonalBadge({ type, date, name, selected })
                }
              >
                {(loading || addLoading) === true ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : edit ? (
                  'Update Badge'
                ) : (
                  'Add Badge'
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRelationship = (title, data, placeholder, apiResp, summaryText) => {
    const isError = apiResp?.data?.message === 'No';
    return (
      <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
        {page === 'badgeHub' ? (
          <h1 className="summary-text verification_badge_input mb-[10px] tablet:mb-5">{selected?.name}</h1>
        ) : (
          <>
            <h1 className="summary-text mb-[10px] tablet:mb-5">{summaryText}</h1>
            <div className="flex flex-col gap-[10px] tablet:gap-[15px]">
              <Listbox
                items={data}
                selected={selected}
                setSelected={setSelected}
                placeholder={edit ? (selected?.name ? placeholder : 'Loading...') : placeholder}
                disabled={page === 'badgeHub' || (edit ? (selected?.name ? false : true) : false)}
              />
              {isError && (
                <p className="absolute top-16 ml-1 text-[6.8px] font-semibold text-red-400 tablet:text-[14px]">{`Invalid ${title}!`}</p>
              )}
            </div>
          </>
        )}
        {page === 'badgeHub' ? (
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
            <Button variant={'cancel'} onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
            {edit && (
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
            )}
            {hollow ? (
              <Button variant="submit-hollow" disabled={true}>
                {(loading || addLoading) === true ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : edit ? (
                  'Update Badge'
                ) : (
                  'Add Badge'
                )}
              </Button>
            ) : (
              <Button
                variant="submit"
                onClick={() =>
                  edit
                    ? handleUpdateBadge({ type, date, name, prevInfo, selected })
                    : handleAddPersonalBadge({ type, date, name, selected })
                }
              >
                {(loading || addLoading) === true ? (
                  <FaSpinner className="animate-spin text-[#EAEAEA]" />
                ) : edit ? (
                  'Update Badge'
                ) : (
                  'Add Badge'
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
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
      <PopUp open={isPopup} handleClose={handleClose} title={title} logo={logo}>
        {title === 'First Name' &&
          renderInputField(
            'First Name',
            name,
            placeholder,
            apiResp,
            null,
            null,
            'Your first name is a simple way to begin enhancing your value.'
          )}
        {title === 'Last Name' &&
          renderInputField(
            'Last Name',
            name,
            placeholder,
            apiResp,
            null,
            null,
            'Your last name further strengthens your authenticity.'
          )}
        {title === 'Date of Birth' && (
          <div className="px-5 py-[15px] tablet:px-[60px] tablet:py-[25px] laptop:px-[80px]">
            {page !== 'badgeHub' && (
              <h1 className="summary-text mb-[10px] tablet:mb-5">
                Your date of birth strengthens your identity verification, boosting your trustworthiness and creating
                opportunities for age-related rewards.
              </h1>
            )}
            {fetchingEdit ? (
              <input
                type="text"
                value="Loading..."
                disabled={true}
                className={`caret-hidden verification_badge_input`}
              />
            ) : (
              <input
                type="date"
                id="dateInput"
                value={date}
                onChange={handleDateChange}
                className="verification_badge_input"
                disabled={page === 'badgeHub'}
              />
            )}
            {page === 'badgeHub' ? (
              <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
                <Button variant={'cancel'} onClick={handleClose}>
                  Close
                </Button>
              </div>
            ) : (
              <div className="mt-[10px] flex justify-end gap-[15px] tablet:mt-5 tablet:gap-[35px]">
                {edit && (
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
                )}
                {hollow ? (
                  <Button variant="submit-hollow" disabled={true}>
                    {(loading || addLoading) === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="submit"
                    onClick={() =>
                      edit
                        ? handleUpdateBadge({ type, date, name, prevInfo, selected })
                        : handleAddPersonalBadge({ type, date, name, selected })
                    }
                  >
                    {(loading || addLoading) === true ? (
                      <FaSpinner className="animate-spin text-[#EAEAEA]" />
                    ) : edit ? (
                      'Update Badge'
                    ) : (
                      'Add Badge'
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        {title === 'Current City' &&
          renderCurrentCity(
            'Current City',
            name,
            placeholder,
            apiResp,
            'Your current location qualifies you for location-specific rewards.'
          )}
        {title === 'Home Town' &&
          renderCurrentCity('Home Town', name, placeholder, apiResp, 'Enhance your chances for personalized rewards.')}
        {title === 'Relationship Status' &&
          renderRelationship(
            'Relationship Status',
            relationshipData,
            placeholder,
            apiResp,
            'Enhance your credibility, value and opportunities to earn rewards.'
          )}
        {title === 'Sex' &&
          renderRelationship(
            'Sex',
            sexOptions,
            placeholder,
            apiResp,
            'Increase your credibility, value and earning potential.'
          )}
        {title === 'ID / Passport' && renderInputField('ID / Passport', name, handleNameChange, placeholder, apiResp)}
        {title === 'Geolocation' &&
          renderInputField(
            'Geolocation',
            name,
            placeholder,
            apiResp,
            null,
            null,
            'Keeping your location up to date ensures you receive rewards tailored to your travel tendencies and interests, enhancing your overall experience on the platform.'
          )}
        {title === 'Security Question' &&
          renderInputField(
            'Security Question',
            name,
            'Security question here',
            apiResp,
            data,
            'Write your answer here',
            'Your security question helps in recovering your account if you get locked out.'
          )}
        {onboarding && <ProgressBar handleSkip={handleSkip} />}
      </PopUp>
    </>
  );
};

export default PersonalBadgesPopup;
