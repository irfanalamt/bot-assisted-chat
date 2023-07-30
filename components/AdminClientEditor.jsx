import axios from 'axios';
import {useState} from 'react';

const AdminClientEditor = ({client, handleGoBack}) => {
  const [clientData, setClientData] = useState(
    client || {name: '', email: '', clientId: '', phone: '', active: false}
  );

  async function saveClientMainData(e) {
    e.preventDefault();

    const token = localStorage.getItem('sysAdminToken');
    if (!token) return;

    const data = {
      clientId: clientData.clientId,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      active: clientData.active,
      description: clientData.description,
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
      setTimeout(() => {
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
          <div className='flex justify-between'>
            <div>
              <label className='block font-medium text-gray-700'>
                Client ID:
              </label>
              <input
                type='text'
                className='block p-2 mt-1 border border-gray-300 text-gray-500 bg-gray-300 rounded w-32'
                value={clientData.clientId}
                readOnly
              />
            </div>
            <div>
              <span className='font-medium text-gray-700'>Active:</span>
              <div className='mt-1 p-2'>
                <label>
                  <input
                    type='radio'
                    name='active'
                    value='true'
                    checked={clientData.active === true}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        active: true,
                      })
                    }
                    className='mr-2'
                  />
                  True
                </label>

                <label className='ml-4'>
                  <input
                    type='radio'
                    name='active'
                    value='false'
                    checked={clientData.active === false}
                    onChange={(e) =>
                      setClientData({
                        ...clientData,
                        active: false,
                      })
                    }
                    className='mr-2'
                  />
                  False
                </label>
              </div>
            </div>
          </div>

          <label className='block mt-4 font-medium text-gray-700'>Name:</label>
          <input
            type='text'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={clientData.name}
            onChange={(e) =>
              setClientData({...clientData, name: e.target.value})
            }
          />

          <label className='block mt-4 font-medium text-gray-700'>Email:</label>
          <input
            type='text'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={clientData.email}
            onChange={(e) =>
              setClientData({...clientData, email: e.target.value})
            }
          />
          <label className='block mt-4 font-medium text-gray-700'>Phone:</label>
          <input
            type='tel'
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={clientData.phone}
            onChange={(e) =>
              setClientData({...clientData, phone: e.target.value})
            }
          />
          <label className='block mt-4 font-medium text-gray-700'>
            Description:
          </label>
          <textarea
            className='block w-full p-2 mt-1 border border-gray-300 rounded'
            value={clientData.description}
            onChange={(e) =>
              setClientData({...clientData, description: e.target.value})
            }
          />
          <div className='flex justify-between'>
            <button
              className='w-2/5 mr-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4 transition-colors duration-200'
              onClick={saveClientMainData}>
              Save
            </button>
            <button
              className='w-2/5 mr-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded mt-4 transition-colors duration-200'
              onClick={handleGoBack}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientEditor;
