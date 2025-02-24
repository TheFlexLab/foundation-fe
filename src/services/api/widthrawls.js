import api from '../api/Axios';

export const widthrawFdx = async (data) => {
  return await api.post('/widthrawFdx', {
    uuid: data.uuid,
    amount: data.amount,
    data: data.data,
    from: data.from,
    to: data.to,
    feesPaid: data.feesPaid,
  });
};
export const fetchFeeBalance = async () => {
  return await api.get('/fetchFeeBalance');
};
