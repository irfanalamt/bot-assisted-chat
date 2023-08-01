import React, {useEffect, useState} from 'react';
import useSnackbar from '@/hooks/useSnackbar';
import Snackbar from '@/components/Snackbar';
import axios from 'axios';
import AdminClientEditor from '@/components/AdminClientEditor';
import AdminClientEditorAdmin from '../components/AdminClientEditorAdmin';
import {type} from 'os';

const Manage = () => {
  const [sysAdminInfo, setSysAdminInfo] = useState({
    username: '',
    password: '',
  });
  const [step, setStep] = useState(1);
  const [clients, setClients] = useState(null);
  const [currentClient, setCurrentClient] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showGoBackBtn, setShowGoBackBtn] = useState(true);

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

  function handleAddNewClient() {
    const newId = calculateNewClientId(clients);

    const newClient = {
      clientId: newId,
      name: '',
      email: '',
      phone: '',
      description: '',
      active: true,
    };

    setCurrentClient(newClient);
    setStep(3);
  }

  function calculateNewClientId(clients) {
    if (!clients.length) return 1001;

    let maxId = clients[0].clientId;

    for (let i = 1; i < clients.length; i++) {
      if (clients[i].clientId > maxId) {
        maxId = clients[i].clientId;
      }
    }

    return maxId + 1;
  }

  function handleEditClient(client) {
    setCurrentClient(client);
    setStep(3);
  }

  function handleModifyAdmins(client) {
    setCurrentClient(client);
    setStep(4);
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
        <div className='w-full flex flex-col p-4'>
          <h2 className='text-center text-2xl mb-4'>Client Management</h2>
          <table className='w-full text-left bg-white rounded-lg overflow-hidden shadow-lg'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='py-2 px-4 text-gray-600'>Client ID</th>
                <th className='py-2 px-4 text-gray-600'>Name</th>
                <th className='py-2 px-4 text-gray-600'>Phone</th>
                <th className='py-2 px-4 text-gray-600'>Email</th>
                <th className='py-2 px-4 text-gray-600'>Status</th>
                <th className='py-2 px-4 text-gray-600 '>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, i) => (
                <tr key={i} className='border-t border-gray-200'>
                  <td className='py-2 px-4'>{client.clientId}</td>
                  <td className='py-2 px-4'>{client.name}</td>
                  <td className='py-2 px-4'>{client.phone}</td>
                  <td className='py-2 px-4'>{client.email}</td>
                  <td className='py-2 px-4'>
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        client.active ? 'bg-teal-500' : 'bg-red-500'
                      }`}
                    />
                  </td>
                  <td className='py-2 px-4 flex justify-between items-center space-x-2'>
                    <button
                      className='px-4 py-2 rounded-md shadow-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200 flex-grow'
                      onClick={() => handleEditClient(client)}>
                      Edit
                    </button>
                    <button
                      className='px-4 py-2 rounded-md shadow-md text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-colors duration-200 flex-grow'
                      onClick={() => handleModifyAdmins(client)}>
                      Admins
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className='px-4 py-2 rounded-md shadow-md text-white bg-stone-500 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-opacity-50 transition-colors duration-200 w-max mx-auto mt-8'
            onClick={handleAddNewClient}>
            Add new client
          </button>
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
          <AdminClientEditor
            client={currentClient}
            handleGoBack={() => {
              getClientData();
              setStep(2);
            }}
          />
        </div>
      )}
      {step === 4 && (
        <div className='w-full flex flex-col justify-center'>
          {showGoBackBtn && (
            <button
              className='px-4 py-2 rounded-full shadow-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 m-2 self-start transition-colors duration-200'
              onClick={() => {
                getClientData();
                setStep(2);
              }}>
              Go back
            </button>
          )}

          <AdminClientEditorAdmin
            client={currentClient}
            setShowGoBackBtn={setShowGoBackBtn}
            reloadClientData={getClientData}
          />
        </div>
      )}
    </div>
  );
};

export default Manage;
