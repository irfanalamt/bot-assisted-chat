import React from 'react';

interface OnlineStatusProps {
  isOnline: boolean;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({isOnline}) => {
  return (
    <div className='flex items-center space-x-2'>
      <span
        className={`h-3 w-3 rounded-full border border-gray-300 transform transition-transform duration-500 ${
          isOnline
            ? 'bg-gradient-to-r from-green-400 to-blue-500 animate-pulse'
            : 'bg-red-400'
        }`}></span>
      <span className='text-gray-700 text-xs font-medium'>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default OnlineStatus;
