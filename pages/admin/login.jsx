import React, {useState} from 'react';
import {useRouter} from 'next/router';
import useSnackbar from '@/hooks/useSnackbar';
import Snackbar from '@/components/Snackbar';
import axios from 'axios';
const Login = () => {
  const [adminInfo, setAdminInfo] = useState({
    clientId: '',
    username: '',
    accessCode: '',
  });
  const {isSnackbarVisible, snackbarMessage, snackbarType, showSnackbar} =
    useSnackbar();

  const router = useRouter();

  const handleChange = (event) => {
    const {name, value} = event.target;
    setAdminInfo((prevState) => ({...prevState, [name]: value}));
  };

  const isFormValid = () => {
    const {clientId, username, accessCode} = adminInfo;

    if (!clientId || !username || !accessCode) {
      showSnackbar('All fields are required.', 'error');
      return false;
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      showSnackbar('Server URL is not defined.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/login`,
        adminInfo
      );

      if (response.status === 200) {
        showSnackbar('Admin login success.', 'success');
        setTimeout(() => {
          router.push('/admin/home');
        }, 2000);
      } else {
        showSnackbar('Login error.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(`${error.message}`, 'error');
    }
  };

  const {username, accessCode, clientId} = adminInfo;

  return (
    <div className='flex flex-col h-screen items-center bg-gray-200 px-2 pt-40'>
      <h1 className='text-3xl text-center text-gray-600 font-bold my-6'>
        BCX Chat
      </h1>
      <div>
        <div className='text-xl text-center text-gray-800 font-bold mb-4'>
          Admin Login
        </div>
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-lg shadow-md px-8 py-8 max-w-md space-y-4'>
          <input
            type='text'
            name='clientId'
            value={clientId}
            onChange={handleChange}
            className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500'
            placeholder='ClientID'
          />
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
            placeholder='Password'
          />
          <button
            type='submit'
            className='w-full bg-purple-500 text-white font-semibold p-3 rounded hover:bg-purple-700 transition ease-in-out duration-200'>
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

export default Login;
