import React, {useState} from 'react';
import {useRouter} from 'next/router';
import useSnackbar from '@/hooks/useSnackbar';
import Snackbar from '@/components/Snackbar';
import axios from 'axios';

interface UserInfo {
  username: string;
  accessCode: string;
}

const LoginPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    accessCode: '',
  });
  const {isSnackbarVisible, snackbarMessage, snackbarType, showSnackbar} =
    useSnackbar();

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setUserInfo((prevState) => ({...prevState, [name]: value}));
  };

  const isFormValid = (): boolean => {
    const {username, accessCode} = userInfo;

    if (!username || !accessCode) {
      showSnackbar(
        'Both username and access code fields are required.',
        'error'
      );
      return false;
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      showSnackbar('Server URL is not defined.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid()) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/agent/login`,
        userInfo
      );

      const data = response.data;

      console.log('data', data);
      if (response.status === 200) {
        showSnackbar('Agent login success.', 'success');
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          router.push('/agent/home');
        }, 2000);
      } else {
        console.log(data.message);
        showSnackbar('Login error.', 'error');
      }
    } catch (error: any) {
      console.error('Error:', error.message);
      showSnackbar(`Server error: ${error.message}`, 'error');
    }
  };

  const {username, accessCode} = userInfo;

  return (
    <div className='flex flex-col h-screen items-center bg-gray-200 px-2 pt-40'>
      <h1 className='text-3xl text-center text-gray-600 font-bold my-6'>
        BCX Chat
      </h1>
      <div>
        <div className='text-xl text-center text-gray-800 font-bold mb-4'>
          Agent Login
        </div>
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-lg shadow-md px-8 py-8 max-w-md space-y-4'>
          <input
            type='text'
            name='username'
            value={username}
            onChange={handleChange}
            className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500'
            placeholder='Username'
          />
          <input
            type='password'
            name='accessCode'
            value={accessCode}
            onChange={handleChange}
            className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500'
            placeholder='Access Code'
          />
          <button
            type='submit'
            className='w-full bg-indigo-500 text-white font-semibold p-3 rounded hover:bg-green-600 transition ease-in-out duration-200'>
            Login
          </button>
        </form>
      </div>
      <div>
        {isSnackbarVisible && (
          <Snackbar message={snackbarMessage} messageType={snackbarType} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
