import axios from 'axios';
import {useState} from 'react';
import useSnackbar from '@/hooks/useSnackbar';
import Snackbar from '@/components/Snackbar';

const EditClientAdmin = ({admin, handleGoBack, reloadClientData}) => {
  const [adminData, setAdminData] = useState(
    admin || {name: '', username: '', phone: '', email: '', accessCode: ''}
  );
  const {isSnackbarVisible, snackbarMessage, snackbarType, showSnackbar} =
    useSnackbar();

  function isFormValid() {
    const {name, email, phone, username} = adminData;

    if (!name || !email || !phone || !username) {
      showSnackbar('All fields are required.', 'error');
      return false;
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      showSnackbar('Please enter a valid email.', 'error');
      return false;
    }

    // username at least 3 characters, alphanum
    const usernameRegex = /^[a-z0-9]{3,}$/i;
    if (!usernameRegex.test(username)) {
      showSnackbar(
        'Username must be at least 3 characters and only contain alphanumeric characters.',
        'error'
      );
      return false;
    }

    return true;
  }

  async function handleSaveAdminData(e) {
    e.preventDefault();

    if (!isFormValid()) return;

    const token = localStorage.getItem('sysAdminToken');
    if (!token) return;

    const data = {
      clientId: adminData.clientId,
      id: adminData.id,
      name: adminData.name,
      username: adminData.username,
      accessCode: adminData.accessCode,
      email: adminData.email,
      phone: adminData.phone,
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/sysAdmin/admin`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTask = response.data;
      console.log('Updated Task:', updatedTask);
      setTimeout(() => {
        reloadClientData();
        handleGoBack();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className='p-5 shadow-lg rounded-lg overflow-auto  mx-auto w-2/6 bg-gray-50'>
      <div className='mb-4'>
        <div className='mt-4'>
          <label className='block mt-4 font-medium text-gray-700'>Name:</label>
          <input
            type='text'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.name}
            onChange={(e) => setAdminData({...adminData, name: e.target.value})}
          />
          <label className='block mt-4 font-medium text-gray-700'>Email:</label>
          <input
            type='text'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.email}
            onChange={(e) =>
              setAdminData({...adminData, email: e.target.value})
            }
          />
          <label className='block mt-4 font-medium text-gray-700'>Phone:</label>
          <input
            type='tel'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.phone}
            onChange={(e) =>
              setAdminData({...adminData, phone: e.target.value})
            }
          />
          <label className='block mt-8 font-medium text-gray-700 border-t-2 pt-4'>
            User Name:
          </label>
          <input
            type='text'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.username}
            onChange={(e) =>
              setAdminData({...adminData, username: e.target.value})
            }
          />
          <label className='block mt-4 font-medium text-gray-700'>
            Access Code:
          </label>
          <input
            type='password'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.accessCode}
            onChange={(e) =>
              setAdminData({...adminData, accessCode: e.target.value})
            }
          />
          <div className='flex justify-between'>
            <button
              className='w-2/5 mr-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4 transition-colors duration-200'
              onClick={handleSaveAdminData}>
              Save
            </button>
            <button
              className='w-2/5 mr-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded mt-4 transition-colors duration-200'
              onClick={handleGoBack}>
              Cancel
            </button>
          </div>
        </div>
        <div>
          {isSnackbarVisible && (
            <Snackbar message={snackbarMessage} messageType={snackbarType} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditClientAdmin;
