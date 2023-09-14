import {UserCircleIcon} from '@heroicons/react/24/solid';
import {IdentificationIcon} from '@heroicons/react/24/solid';

const TopBar = ({userDetails, handleLogout}) => {
  return (
    <nav className='flex justify-between items-center p-6   bg-gray-800 text-white'>
      <div className='flex'>
        {userDetails && (
          <div className='flex space-x-4'>
            <div className='flex items-center space-x-1'>
              <UserCircleIcon className='w-6 h-6 text-blue-400 ' />
              <span>{userDetails.name}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <IdentificationIcon className='w-6 h-6 text-cyan-400 ' />
              <span>{userDetails.role}</span>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          className='bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300'
          onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
