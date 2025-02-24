import api from './Axios';

export const validation = async (no, data) => {
  return await api.get(`/ai-validation/${no}/?userMessage=${encodeURIComponent(data)}`);
};

export const sendOtp = async (phoneNumber) => {
  return await api.post('/sendOtp', {
    phoneNumber,
  });
};

export const verifyOtp = async (data) => {
  return await api.post('/verifyOtp', {
    phoneNumber: data.phone,
    otp: data.otpString,
    userUuid: data.userUuid,
    legacyEmail: data.legacyEmail,
  });
};

export const resendOtp = async (phoneNumber) => {
  return await api.post('/resendOtp', {
    phoneNumber,
  });
};
