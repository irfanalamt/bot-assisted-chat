import axios from 'axios';
import {useState} from 'react';

const AdminClientEditor = ({client}) => {
  const [clientData, setClientData] = useState(
    client || {name: '', email: '', clientId: '', admins: []}
  );
  const [activeTab, setActiveTab] = useState('main');
  const [adminData, setAdminData] = useState({
    name: '',
    username: '',
    password: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [isNewAdmin, setIsNewAdmin] = useState(false);

  function saveClientAdminData(e) {
    e.preventDefault();
    // modify the client admins of a client
  }

  async function saveClientMainData(e) {
    e.preventDefault();

    const token = localStorage.getItem('sysAdminToken');
    if (!token) return;

    const data = {
      clientId: clientData.clientId,
      name: clientData.name,
      email: clientData.email,
    };

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/sysAdmin/client`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedTask = response.data;
      console.log('Updated Task:', updatedTask);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className='p-5 shadow-lg rounded-lg overflow-auto  mx-auto w-2/6 bg-gray-50'>
      <div className='mb-4'>
        <div className='flex justify-between gap-4'>
          <button
            onClick={() => {
              setActiveTab('main');
              setEditMode(false);
            }}
            className={`p-2 rounded-full text-white font-semibold ${
              activeTab === 'main' ? 'bg-indigo-500' : 'bg-gray-300'
            }`}>
            Main
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`p-2 rounded-full text-white font-semibold ${
              activeTab === 'admins' ? 'bg-indigo-500' : 'bg-gray-300'
            }`}>
            Client Admins
          </button>
        </div>

        {activeTab === 'main' ? (
          <div className='mt-4'>
            <label className='block font-medium text-gray-700'>
              Client ID:
            </label>
            <input
              type='text'
              className='block w-full p-2 mt-1 border border-gray-300 text-gray-500 bg-white rounded'
              value={clientData.clientId}
              readOnly
            />

            <label className='block mt-4 font-medium text-gray-700'>
              Name:
            </label>
            <input
              type='text'
              className='block w-full p-2 mt-1 border border-gray-300 rounded'
              value={clientData.name}
              onChange={(e) =>
                setClientData({...clientData, name: e.target.value})
              }
            />
            <label className='block mt-4 font-medium text-gray-700'>
              Email:
            </label>
            <input
              type='text'
              className='block w-full p-2 mt-1 border border-gray-300 rounded'
              value={clientData.email}
              onChange={(e) =>
                setClientData({...clientData, email: e.target.value})
              }
            />
            <button
              className='w-1/2 mr-2 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded mt-4 transition-colors duration-200'
              onClick={saveClientMainData}>
              Save
            </button>
          </div>
        ) : (
          <div className='mt-4'>
            {clientData.admins.map((admin, index) => (
              <div
                key={index}
                className='flex justify-between items-center py-4 px-2 my-2 bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
                onClick={() => {
                  setAdminData(admin);
                  setEditMode(true);
                  setIsNewAdmin(false);
                }}>
                <p className='text-gray-700 font-medium'>{admin.name}</p>
                <p className='text-gray-500'>{admin.username}</p>
              </div>
            ))}
            <button
              className='mt-4 w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors duration-200'
              onClick={() => {
                setAdminData({name: '', username: '', password: ''});
                setIsNewAdmin(true);
                setEditMode(true);
              }}>
              Add New Admin
            </button>
          </div>
        )}
      </div>

      {editMode && (
        <div className='mt-4'>
          <label className='block mt-2 font-medium text-gray-700'>
            Username:
          </label>
          <input
            type='text'
            className={`block w-full p-2 mt-1 border border-gray-300 rounded ${
              !isNewAdmin && 'text-gray-500 bg-white'
            }`}
            value={adminData.username}
            readOnly={!isNewAdmin}
            onChange={(e) =>
              setAdminData({...adminData, username: e.target.value})
            }
          />
          <label className='block mt-4 font-medium text-gray-700'>
            Admin Name:
          </label>
          <input
            type='text'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.name}
            onChange={(e) => setAdminData({...adminData, name: e.target.value})}
          />

          <label className='block mt-4 font-medium text-gray-700'>
            Password:
          </label>
          <input
            type='password'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={adminData.password}
            onChange={(e) =>
              setAdminData({...adminData, password: e.target.value})
            }
          />
          <div className='mt-4 flex justify-between'>
            <button
              className='w-1/2 mr-2 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded transition-colors duration-200'
              onClick={() => setEditMode(false)}>
              Save
            </button>
            <button
              className='w-1/2 ml-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors duration-200'
              onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientEditor;
