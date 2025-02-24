import api from './Axios';

export const signUp = async (data) => {
  return await api.post('/user/signUpUser', {
    userEmail: data.email,
    userPassword: data.password,
  });
};

export const signUpGuest = async (data) => {
  return await api.post('/user/signUp/guestMode', {
    email: data.email,
    password: data.password,
    uuid: data.uuid,
  });
};

export const signIn = async (data) => {
  return await api.post('/user/signInUser', data);
};

export const signOut = async (uuid) => {
  return await api.post('user/logout', {
    uuid,
  });
};

export const userInfo = async () => {
  try {
    const uuid = localStorage.getItem('uuid');
    const legacyHash = localStorage.getItem('legacyHash');

    // Construct the base URL
    let url = `/user/userInfo/${uuid}`;

    // Conditionally add the legacyHash parameter if it exists
    if (legacyHash) {
      url += `/?infoc=${legacyHash}`;
    }

    const data = await api.get(url);
    return data;
    // return await api.get(url);
  } catch (error) {
    console.log('userInfoError', error);
    if (error?.response?.data?.message === 'User not found') {
      localStorage.clear();
    }
  }
};

export const userInfoById = async () => {
  return await api.post('/user/userInfoById', { uuid: localStorage.getItem('uuid') });
};

export const getTreasuryAmount = async () => {
  const res = await api.get(`/treasury/get`);
  localStorage.setItem('treasuryAmount', res.data.data);
  if (Object.keys(res.data).length === 0 && res.data.constructor === Object) {
    return 0;
  } else {
    return res.data.data;
  }
};

export const getConstants = async () => {
  const res = await api.get(`user/getConstants`);
  localStorage.setItem('Constants', res?.data);
  return res?.data;
};

export const updateUserSettings = async ({
  uuid,
  darkMode,
  defaultSort,
  systemNotifications,
  email,
  emailNotifications,
  newNewsNotifications,
  newPostsNotifications,
}) => {
  return await api.post('user/updateUserSettings', {
    uuid,
    darkMode,
    defaultSort,
    systemNotifications,
    email,
    emailNotifications,
    newNewsNotifications,
    newPostsNotifications,
  });
};

export const changePassword = async (params) => {
  return await api.put('/user/changePassword', params);
};

export const getAllLedgerData = async (page, limit, sort, type) => {
  const uuid = localStorage.getItem('uuid');

  const params = { page, limit, sort, uuid };

  if (type === 'widthraw') {
    params.type = type;
  }

  return await api.get('/ledger/ledgerById', { params });
};

export const getAllRadeemLedgerData = async (page, limit, sort) => {
  const uuid = localStorage.getItem('uuid');
  return await api.get('/ledger/ledgerById', {
    params: { page, limit, sort, txAuth: 'DAO', uuid },
  });
};

export const getAllRedemptionLedgerData = async (page, limit, sort, uuid) => {
  return await api.get('/ledger/ledgerById', {
    params: { page, limit, sort, txAuth: 'DAO', uuid },
  });
};

export const setFilterStates = async (state) => {
  const data = await api.post('/user/setStates', state);
  localStorage.setItem('userData', JSON.stringify(data?.data?.updatedUser));
};

// Not being used in the APP
export const setBookmarkFilterStates = async (state) => {
  return await api.post('/user/setBookmarkStates', state);
};

export const searchLedger = async (uuid, page, limit, sort, term) => {
  return await api.post('/ledger/searchLedger', {
    params: { uuid, page, limit, sort, term },
  });
};

export const searchRedemptionLedger = async (page, limit, sort, term, uuid) => {
  return await api.post('/ledger/searchLedger', {
    params: { page, limit, sort, term, txAuth: 'DAO', uuid },
  });
};

export const deleteAccount = async (uuid) => {
  return await api.delete(`/delete/${uuid}`);
};

export const createGuestMode = async (fid) => {
  const url = fid ? `/user/create/guestMode?fid=${fid}` : '/user/create/guestMode';
  return await api.post(url);
};
