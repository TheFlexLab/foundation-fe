import { toast } from 'sonner';
import api from './Axios';

export const validateURL = async (id) => {
  try {
    return await api.get(`/infoquestions/checkMediaDuplicateUrl/${id}`);
  } catch (err) {
    if (err?.response.status === 400) {
      toast.warning(err.response.data.error);
    }
    return 'error';
  }
};
