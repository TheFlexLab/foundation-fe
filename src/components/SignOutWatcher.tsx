import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetFilters } from '../features/sidebar/filtersSlice';
import { addUser } from '../features/auth/authSlice';
import { signOut } from '../services/api/userAuth';

const SignOutWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const persistedUserInfo = useSelector((state: any) => state.auth.user);

  const { mutateAsync: handleSignout } = useMutation({
    mutationFn: (uuid: string) => signOut(uuid),
    onSuccess: () => {
      dispatch(resetFilters());
      dispatch(addUser(null));
      localStorage.clear();
      // localStorage.setItem('userExist', 'true');
      navigate('/');
    },
    onError: (error: unknown) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (persistedUserInfo?.tempLogout) {
      handleSignout(persistedUserInfo.uuid);
    }
  }, [persistedUserInfo, handleSignout]);

  return null;
};

export default SignOutWatcher;
