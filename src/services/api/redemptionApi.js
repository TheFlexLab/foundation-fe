import showToast from '../../components/ui/Toast';
import api from './Axios';
import { toast } from 'sonner';

export const createRedeeemCode = async (data) => {
  return await api.post('/redeem/create', {
    creator: data.creator,
    owner: data.owner,
    uuid: data.uuid,
    amount: data.amount,
    description: data.description,
    to: data.to,
    expiry: "never",
  });
};

export const addRedeemCode = async (data) => {
  return await api.post('/redeem/transfer', {
    uuid: data.uuid,
    code: data.code,
  });
};

// new
export const redeemCode = async (data) => {
  return await api.post('/redeem/balance', {
    uuid: data.uuid,
    code: data.code,
  });
};

export const deleteHistory = async (data) => {
  return await api.post('/redeem/delete', {
    uuid: data.uuid,
    code: data.code,
  });
};

export const getUnredeemedData = async (id, uuid) => {
  try {
    return await api.get(`/redeem/getUnredeemedById/${id}/${uuid}`);
  } catch (error) {
    showToast('error', 'error', {}, error.response.data.message.split(':')[1])

  }
};

export const getHistoryData = async (id, uuid) => {
  try {
    return await api.get(`/redeem/getRedeemHistoryById/${id}/${uuid}`);
  } catch (error) {
    showToast('error', 'error', {}, error.response.data.message.split(':')[1])

  }
};
