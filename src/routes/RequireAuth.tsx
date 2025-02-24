import { useEffect } from 'react';
import { addUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilters } from '../features/sidebar/filtersSlice';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistedUser = useSelector((state: any) => state.auth.user);

  const isRoleAllowed = allowedRoles.includes(persistedUser?.role);

  useEffect(() => {
    if (!persistedUser) {
      localStorage.clear();
      navigate('/');
    } else if (persistedUser?.isPasswordEncryption && !localStorage.getItem('legacyHash')) {
      localStorage.clear();
      dispatch(resetFilters());
      dispatch(addUser(null));
      navigate('/');
    }
  }, [persistedUser]);

  return isRoleAllowed ? <Outlet /> : <Navigate to="/" />;
};

export default RequireAuth;
