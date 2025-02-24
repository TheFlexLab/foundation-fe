import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { IoIosMail } from 'react-icons/io';
import api from '../../services/api/Axios';

const Unsubscribe = () => {
  const location = useLocation();
  const [message, setMessage] = useState(false);

  const { mutateAsync: handleUnsubscribe } = useMutation({
    mutationFn: async ({ email, typeEmail }: any) => {
      const response = await api.get(`/user/unsubscribe?email=${email}&type=${typeEmail}`);
      return response.data;
    },
    onSuccess: (data) => {
      setMessage(true);
    },
    onError: (error) => {
      setMessage(false);
    },
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const typeEmail = queryParams.get('type');

    if (email) {
      handleUnsubscribe({ email, typeEmail } as any);
    } else {
      setMessage(false);
    }
  }, [location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-100">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg">
        <IoIosMail className="text-4xl text-blue-100" />
        {message ? (
          <>
            <h1 className="text-2xl font-semibold text-blue-600">You've Successfully Unsubscribed</h1>
            <p>You will no longer receive emails from Foundation.io.</p>
            <p>If you change your mind, you can easily re-enable emails in your settings at any time.</p>
          </>
        ) : (
          <h1 className="text-2xl font-semibold text-blue-600">Unable to unsubscribe.</h1>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
