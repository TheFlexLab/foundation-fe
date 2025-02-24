import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { userInfo } from '../../services/api/userAuth';

const Maintenance = () => {
  const { data, isSuccess, isError } = useQuery({
    queryKey: ['userInfo', localStorage.getItem('uuid')],
    queryFn: userInfo,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-md rounded-md bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">Site Under Maintenance</h1>
        <p className="text-gray-1 text-center">We are currently performing maintenance. Please check back later.</p>
      </div>
    </div>
  );
};

export default Maintenance;
