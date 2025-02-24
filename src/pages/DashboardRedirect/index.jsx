import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userInfo } from '../../services/api/userAuth';
import { addUser } from '../../features/auth/authSlice';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: userInfoData,
    isSuccess: userInfoSuccess,
    isError: userInfoError,
  } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfo,
  });

  if (userInfoSuccess && userInfoData?.status === 200) {
    if (userInfoData.data) {
      dispatch(addUser(userInfoData?.data));
      navigate('/');
    }
  }

  if (userInfoError) {
    console.log({ userInfoError });
  }

  return (
    <div className="dark:bg text-gray-1 flex h-full min-h-screen justify-center bg-white pt-8 text-lg dark:bg-black dark:text-[#B8B8B8]">
      Authorizing...
    </div>
  );
};

export default DashboardRedirect;
