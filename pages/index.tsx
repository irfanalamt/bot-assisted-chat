import React from 'react';
import {useRouter} from 'next/navigation';

const Index: React.FC = () => {
  const router = useRouter();
  return (
    <div className='h-screen bg-gray-100 flex items-center justify-center'>
      <div className='w-full max-w-md bg-white rounded overflow-hidden shadow-lg py-4'>
        <div className='px-6 pb-4 pt-2'>
          <div className='font-bold text-xl mb-2 text-center'>
            Welcome to BCX Chat
          </div>
          <p className='text-gray-700 text-base text-center'>
            Please select your role to proceed.
          </p>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <button
            onClick={() => router.push('/agent/login')}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded w-full transition duration-200'>
            Login as Agent
          </button>
          <button
            onClick={() => router.push('/user/login')}
            className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full transition duration-200'>
            Login as User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
