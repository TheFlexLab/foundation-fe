import axios from 'axios';
import api from './Axios';

export const verifyCode = async (urlQuery) => {
  return await api.post(`user/verify?${urlQuery}`, {
    verificationCode: urlQuery.substr(urlQuery.length - 6),
  });
};

export const referral = async ({ code, uuid }) => {
  return await api.post('user/referral', {
    code,
    uuid,
  });
};

export const sendVerificationEmail = async ({ userEmail }) => {
  return await api.post('user/sendVerifyEmail', {
    userEmail,
  });
};

export const authSuccess = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  if (!token) {
    console.log('No token found in query parameters');
    return;
  }

  try {
    return await axios.get(`${import.meta.env.VITE_API_URL}/auth/login/success`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error;
  }
};
