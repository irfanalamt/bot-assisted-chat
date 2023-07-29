import React, {useEffect, useState} from 'react';
import useSnackbar from '@/hooks/useSnackbar';
import Snackbar from '@/components/Snackbar';
import axios from 'axios';
import AdminClientEditor from '@/components/AdminClientEditor';

const Manage = () => {
  const [sysAdminInfo, setSysAdminInfo] = useState({
    username: '',
    password: '',
  });
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState(null);
  const [currentClient, setCurrentClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {isSnackbarVisible, snackbarMessage, snackbarType, showSnackbar} =
    useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('sysAdminToken');
    if (token) {
      getClientData();
      setIsLoggedIn(true);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFormValid()) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/sysAdmin/login`,
        sysAdminInfo
      );

      if (response.status === 200) {
        const sysAdminToken = response.data.token;
        localStorage.setItem('sysAdminToken', sysAdminToken);
        showSnackbar('sysAdmin login success.', 'success');
        getClientData();
        setIsLoggedIn(true);
      } else {
        showSnackbar('Login error.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(`${error.message}`, 'error');
    }
  }

  function isFormValid() {
    const {username, password} = sysAdminInfo;

    if (!username || !password) {
      showSnackbar('All fields are required.', 'error');
      return false;
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      showSnackbar('Server URL is not defined.', 'error');
      return false;
    }

    return true;
  }

  function handleChange(event) {
    const {name, value} = event.target;
    setSysAdminInfo((prevState) => ({...prevState, [name]: value}));
  }

  async function getClientData() {
    const token = getToken();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/sysAdmin/clients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const clientData = response.data;
      setClients(clientData);
      setStep(2);
      console.log('clients=', clientData, typeof clientData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

  function getToken() {
    const token = localStorage.getItem('sysAdminToken');

    if (!token) {
      setStep(1);
      setIsLoggedIn(false);
    }

    return token;
  }

  function handleClientSelect(client) {
    console.log('client selected = ' + client.name);
    setCurrentClient(client);
    setStep(3);
  }

  function handleAddNewClient() {
    setCurrentClient(null);
    setStep(3);
  }

  function handleLogout() {
    localStorage.removeItem('sysAdminToken');
    location.reload();
  }

  const {username, password} = sysAdminInfo;

  return (
    <div className='flex flex-col h-screen items-center bg-gray-100 px-6 overflow-auto'>
      <div className='self-start flex justify-between items-center w-full'>
        <h1 className='text-4xl  text-gray-700 font-bold  p-4'>
          BCX System Admin
        </h1>
        {isLoggedIn && (
          <button
            className='px-4 py-2 rounded-full shadow-md text-white bg-red-500 hover:bg-red-700  m-2 transition-colors duration-200'
            onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {step === 1 && (
        <div
          id='login'
          className='w-full h-full flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit}
            className='bg-white rounded-lg shadow-lg px-8 py-8 max-w-md space-y-4'>
            <input
              type='text'
              name='username'
              value={username}
              onChange={handleChange}
              className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500 transition-colors duration-200'
              placeholder='Username'
            />
            <input
              type='password'
              name='password'
              value={password}
              onChange={handleChange}
              className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500 transition-colors duration-200'
              placeholder='Password'
            />
            <button
              type='submit'
              className='w-full bg-purple-500 text-white font-semibold p-3 rounded hover:bg-purple-700 transition ease-in-out duration-200'>
              Login
            </button>
          </form>
          <div>
            {isSnackbarVisible && (
              <Snackbar message={snackbarMessage} messageType={snackbarType} />
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className='w-full h-full flex flex-col  justify-center items-center'>
          <div id='clientList'>
            {clients.map((client, i) => (
              <button
                key={i}
                className='px-4 py-2 rounded-full shadow-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 m-2 transition-colors duration-200'
                onClick={() => handleClientSelect(client)}>
                {client.name}
              </button>
            ))}
          </div>
          <div className='self-end'>
            <button
              className='px-4 py-2 rounded-full shadow-md text-white bg-gray-500 hover:bg-gray-700  m-2 transition-colors duration-200'
              onClick={handleAddNewClient}>
              Add new client
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className='w-full flex flex-col justify-center'>
          <button
            className='px-4 py-2 rounded-full shadow-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 m-2 self-start transition-colors duration-200'
            onClick={() => {
              getClientData();
              setStep(2);
            }}>
            Go back
          </button>
          <AdminClientEditor client={currentClient} />
        </div>
      )}
    </div>
  );
};

export default Manage;
