import api from './Axios';

export const fetchPurchasedFdxHistory = async (userUuid) => {
  try {
    const resp = await api.get(`/finance/purchasedFdxHistory/${userUuid}`);
    return resp.data; // Ensure that the data from the response is returned
  } catch (err) {
    throw err; // Throw error instead of returning it
  }
};
