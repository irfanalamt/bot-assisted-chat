import React, {useState} from 'react';
import Link from 'next/link';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {encode} from '../utils/cipher';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({username: '', password: ''});
  const router = useRouter();

  const isUsernameValid = (username) => username.length > 3;

  const isPasswordValid = (password) => password.length >= 3;

  function onSubmit(event) {
    event.preventDefault();
    if (isUsernameValid(username) && isPasswordValid(password)) {
      setErrors({username: '', password: ''});
      postLoginToServer({username, password});
    } else {
      setErrors({
        username: !isUsernameValid(username) ? 'Invalid Username' : '',
        password: !isPasswordValid(password) ? 'Invalid Password' : '',
      });
    }
  }

  async function postLoginToServer(loginData) {
    try {
      const response = await axios.post(`/api/login`, loginData);

      if (response.status === 200) {
        handleRoleBasedRouting(response.data);
      } else {
        setErrors({
          password: 'Login Error',
        });
      }
    } catch (error) {
      setErrors({
        password: 'Login failed. Check your credentials.',
      });
    }
  }

  function handleRoleBasedRouting({role, token, name, clientId}) {
    const authData = {role, token, name, clientId};

    localStorage.setItem(
      'authData',
      encode(JSON.stringify(authData), process.env.NEXT_PUBLIC_AUTH_KEY)
    );

    if (['clientAdmin', 'admin'].includes(role)) {
      router.push('/admin/home');
    } else if (role === 'agent') {
      router.push('/agent/home');
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400'>
      <div className='text-center'>
        <h1 className='mb-4 text-5xl font-extrabold text-gray-900'>
          Welcome to BCX Chat
        </h1>
        <p className='mb-6 text-xl text-gray-600'>
          Integrating NLP, Live Agents, and Real-Time Interactions into an
          Easy-to-Use Solution
        </p>
      </div>

      <div className='w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-6 mx-auto bg-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200 '>
        <h2 className='mb-5 text-2xl font-bold text-gray-900'>Login</h2>

        <div className='relative mb-6'>
          <input
            className='w-full p-3 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600'
            type='text'
            placeholder='Username'
            autoComplete='new-user'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <p className='absolute text-red-500 text-center left-1/2 transform -translate-x-1/2 mb-2 '>
              {errors.username}
            </p>
          )}
        </div>

        <div className='relative mb-6'>
          <input
            className='w-full p-3 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-600'
            type='password'
            placeholder='Password'
            autoComplete='new-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className='absolute text-red-500 text-center left-1/2 transform -translate-x-1/2 mb-2 w-full'>
              {errors.password}
            </p>
          )}
        </div>

        <button
          className='w-full p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200'
          onClick={onSubmit}>
          Log In
        </button>
      </div>
      <Link
        href='/demo'
        className='p-3 mt-5 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200'>
        Go to Demo
      </Link>
    </div>
  );
};

export default LoginPage;
