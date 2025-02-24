import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../../features/auth/authSlice';
import { createGuestMode } from '../../services/api/userAuth';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FallbackLoading from '../../components/FallbackLoading';
import { toast } from 'sonner';

const GuestRedirect = ({ redirectUrl }) => {
  const dispatch = useDispatch();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fid = searchParams.get('fid');

  const { mutateAsync: createGuest } = useMutation({
    mutationFn: createGuestMode,
    onSuccess: (resp) => {
      localStorage.setItem('isGuestMode', resp.data.isGuestMode);
      localStorage.setItem('jwt', resp.data.token);
      localStorage.setItem('uuid', resp.data.uuid);
      localStorage.setItem('userData', JSON.stringify(resp.data));
      dispatch(addUser(resp.data));
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    },
    onError: (err) => {
      console.log('user', err?.response?.data?.user);

      if (err?.response?.status === 409) {
        toast.error(err?.response?.data?.message);
      }

      localStorage.setItem('shared-post', location.pathname);
      localStorage.setItem('uuid', err?.response?.data?.user?.uuid);

      dispatch(addUser(err?.response?.data?.user));
      if (redirectUrl) {
        navigate(redirectUrl);
      }
    },
  });

  useEffect(() => {
    if (persistedUserInfo === null) {
      if (fid !== null && fid !== undefined) {
        createGuest(fid);
      } else {
        createGuest();
      }
    }
  }, [persistedUserInfo, dispatch]);

  return <FallbackLoading />;
};

export default GuestRedirect;
