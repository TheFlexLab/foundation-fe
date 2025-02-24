import api from '../api/Axios';
import showToast from '../../components/ui/Toast';
import { useSelector } from 'react-redux';
import { compressImageBlobService } from '../imageProcessing';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useAddDomainBadge = (domainBadge, edit, setLoading, handleClose, onboarding, handleSkip, prevState) => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', domainBadge.domain);
      formData.append('title', domainBadge.title);
      formData.append('description', domainBadge.description);
      formData.append('uuid', persistedUserInfo.uuid);

      if (domainBadge.image[0] instanceof Blob) {
        const compress16x9 = await compressImageBlobService(
          domainBadge.image[0],
          domainBadge.coordinates[0].width,
          domainBadge.coordinates[0].height
        );
        formData.append('file16x9', compress16x9, 'seoCroppedImage.png');
        formData.append('coordinate16x9', JSON.stringify(domainBadge.coordinates[0]));
      }
      if (domainBadge.image[1] instanceof Blob) {
        const compress1x1 = await compressImageBlobService(
          domainBadge.image[1],
          domainBadge.coordinates[1].width,
          domainBadge.coordinates[1].height
        );
        formData.append('file1x1', compress1x1, 'profileImage.png');
        formData.append('coordinate1x1', JSON.stringify(domainBadge.coordinates[1]));
      }

      if (edit) {
        formData.append('update', true);
      }

      // if (edit) {
      //   if (prevState.image[2] !== domainBadge.image[2]) {
      //     const blobResponse = await fetch(domainBadge.image[2]);
      //     const blob = await blobResponse.blob();
      //     formData.append('originalFile', blob, 'originalImage.png');
      //   }
      // } else {
      //   const blobResponse = await fetch(domainBadge.image[2]);
      //   const blob = await blobResponse.blob();
      //   formData.append('originalFile', blob, 'originalImage.png');
      // }

      const blobResponse = await fetch(
        domainBadge.image[2] && domainBadge.image[2] !== prevState.image[2] ? domainBadge.image[2] : prevState.image[2]
      );
      const blob = await blobResponse.blob();
      formData.append('originalFile', blob, 'originalImage.png');

      return api.post(`/addDomainBadge`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        if (edit) {
          showToast('success', 'badgeUpdated');
        } else {
          showToast('success', 'badgeAdded');
        }
        if (onboarding) {
          handleSkip();
          return;
        }

        setLoading(false);
        queryClient.invalidateQueries(['userInfo', { exact: true }]);
        handleClose();
      }
    },
    onError: (error) => {
      console.error(error);
      setLoading(false);
      handleClose();
    },
  });
};
export default useAddDomainBadge;

const reOrderLinHubLinks = async (data) => {
  const response = await api.post('/updateBadgeDataArray', {
    type: 'linkHub',
    data,
    uuid: localStorage.getItem('uuid'),
  });

  return response.data;
};

export const useReOrderLinHubLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reOrderLinHubLinks,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
      showToast('success', 'orderUpdated');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

const addBadgeHub = async (userUuid, badgeIds) => {
  const response = await api.patch('/addProfileBadges', {
    userUuid,
    badgeIds,
  });

  return response.data;
};

export const useAddBadgeHub = () => {
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: (selectedIds) => addBadgeHub(persistedUserInfo.uuid, selectedIds),
    onSuccess: () => {
      showToast('success', 'addBadgeInProfile');
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

const badgeHubClicksTrack = async (badgeId, clickerUuid) => {
  const response = await api.patch('/badgeHubClicksTrack', {
    badgeId,
    clickerUuid,
    clickerTimestamps: new Date().getTime(),
  });

  return response.data;
};

export const useBadgeHubClicksTrack = () => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: (badgeId) => badgeHubClicksTrack(badgeId, persistedUserInfo.uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', localStorage.getItem('uuid')] }, { exact: true });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

// SEARCH CITIES
const searchCities = async (query) => {
  const cities = await api.post(`search/searchCities/?name=${query}`);
  return cities.data;
};

export const useSearchCities = () => {
  return useMutation({
    mutationFn: (query) => searchCities(query),
    onError: (error) => {
      console.error(error);
    },
  });
};

// UPDATE PERSONAL BADGE
const updateBadge = async ({ type, name, date, selected, prevInfo }) => {
  if (!type) {
    showToast('error', 'typeNotProvided');
    return;
  }

  // Helper to check if information is already saved
  const isInfoAlreadySaved = () => {
    switch (type.trim()) {
      case 'firstName':
      case 'lastName':
      case 'geolocation':
        return name === prevInfo;
      case 'dateOfBirth':
        return date === prevInfo;
      case 'currentCity':
      case 'homeTown':
      case 'relationshipStatus':
      case 'sex':
        return selected?.name === prevInfo;
      case 'security-question':
        return name === prevInfo[Object.keys(prevInfo)[0]] && selected?.name === Object.keys(prevInfo)[0];
      default:
        return false;
    }
  };

  if (isInfoAlreadySaved()) {
    showToast('warning', 'infoAlreadySaved');
    return;
  }

  let value;

  // Assign value based on type
  switch (type.trim()) {
    case 'dateOfBirth':
      value = date;
      break;
    case 'security-question':
      if (!selected) {
        showToast('warning', 'selectSecQuestion');
        return;
      }
      if (!name) {
        showToast('warning', 'emptyAnswer');
        return;
      }
      value = { [selected?.name]: name };
      break;
    case 'currentCity':
    case 'homeTown':
    case 'relationshipStatus':
    case 'sex':
      value = selected?.name;
      break;
    default:
      value = name;
  }

  // Validate value
  if (!value) {
    showToast('warning', 'blankField');
    return;
  }

  const payload = {
    newData: value,
    type: type,
    uuid: localStorage.getItem('uuid'),
  };

  // Add legacyHash if present
  const legacyHash = localStorage.getItem('legacyHash');
  if (legacyHash) {
    payload.infoc = legacyHash;
  }

  const addBadge = await api.post(`/addBadge/personal/updatePersonalBadge`, payload);
  return addBadge.data;
};

export const useUpdateBadge = (handleClose) => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: updateBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
      showToast('success', 'badgeUpdated');
      handleClose();
    },
    onError: (error) => {
      console.error(error);
      showToast('error', 'updateFailed');
      handleClose();
    },
  });
};

// ADD PERSONAL BADGE
const addPersonalBadge = async ({ type, name, date, selected }) => {
  // Determine value based on type
  let value;
  switch (type.trim()) {
    case 'dateOfBirth':
      value = date;
      break;

    case 'security-question':
      if (!selected?.name) {
        showToast('warning', 'selectSecQuestion');
        setLoading(false);
        return;
      }
      if (!name) {
        showToast('warning', 'emptyAnswer');
        setLoading(false);
        return;
      }
      value = { [selected?.name]: name };
      break;

    case 'currentCity':
    case 'homeTown':
    case 'relationshipStatus':
    case 'sex':
      if (!selected?.name) {
        showToast('warning', 'blankField');
        setLoading(false);
        return;
      }
      value = selected?.name;
      break;

    case 'firstName':
    case 'lastName':
    case 'geolocation':
      if (!name) {
        showToast('warning', 'blankField');
        setLoading(false);
        return;
      }
      value = name;
      break;

    default:
      showToast('warning', 'unsupportedType');
      setLoading(false);
      return;
  }

  // Construct payload
  const payload = {
    personal: { [type]: value },
    uuid: localStorage.getItem('uuid'),
    ...(localStorage.getItem('legacyHash') && { infoc: localStorage.getItem('legacyHash') }),
  };

  const response = await api.post(`/addBadge/personal/add`, payload);
  return response.data;
};

export const useAddPersonalBadge = (handleClose, setName, onboarding, type, handleSkip) => {
  const queryClient = useQueryClient();
  const persistedUserInfo = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: addPersonalBadge,
    onSuccess: () => {
      showToast('success', 'badgeAdded');
      setName('');
      if (onboarding) {
        handleSkip(type);
      } else {
        queryClient.invalidateQueries({ queryKey: ['userInfo', persistedUserInfo.uuid] }, { exact: true });
        handleClose();
      }
    },
    onError: (error) => {
      console.error(error);
      handleClose();
    },
  });
};
