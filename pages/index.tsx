import React from 'react';
import {useRouter} from 'next/navigation';

const Index: React.FC = () => {
  const router = useRouter();
  return (
    <div className='h-screen bg-gray-200 flex items-center justify-center'>
      <div className='w-10/12 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white rounded-lg overflow-hidden shadow-lg p-6'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-center text-gray-700'>
            Welcome to BCX Chat
          </h1>
        </div>
        <div className='space-y-4'>
          <button
            onClick={() => router.push('/admin/login')}
            className='bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 text-white font-semibold py-2 px-4 rounded w-full transition duration-200 ease-in-out'>
            Login as Admin
          </button>
          <button
            onClick={() => router.push('/agent/login')}
            className='bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold py-2 px-4 rounded w-full transition duration-200 ease-in-out'>
            Login as Agent
          </button>
          <button
            onClick={() => router.push('/user/home')}
            className='bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold py-2 px-4 rounded w-full transition duration-200 ease-in-out'>
            Chat Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
