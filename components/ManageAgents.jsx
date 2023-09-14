import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

function ManageAgents({userDetails}) {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    role: 'agent',
    clientId: userDetails.clientId,
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteAgentId, setDeleteAgentId] = useState(null);
  const isNewAgent = useRef(false);

  useEffect(() => {
    axios
      .get('/api/clientAdmin/getAllAgents', {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      })
      .then(({data}) => setAgents(data))
      .catch(console.error);
  }, []);

  const validateFormData = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }

    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'A valid phone number is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveNewAgent = () => {
    if (validateFormData()) {
      console.log('formdata', formData);
      axios
        .post('/api/clientAdmin/createAgent', formData, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        })
        .then((response) => {
          setAgents([...agents, response.data]);
          setShowForm(false);
        })
        .catch((error) => {
          console.error('Error creating agent:', error);
          setErrors({server: error.response.data.error});
        });
    }
  };

  const handleSaveExistingAgent = () => {
    if (validateFormData()) {
      axios
        .put(`/api/clientAdmin/modifyAgent/${formData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        })
        .then(() => {
          axios
            .get('/api/clientAdmin/getAllAgents', {
              headers: {
                Authorization: `Bearer ${userDetails.token}`,
              },
            })
            .then((response) => {
              setAgents(response.data);
              setShowForm(false);
            })
            .catch((error) => {
              console.error('Error fetching agents:', error);
              setErrors({server: 'Error updating agent, please try again.'});
            });
        })
        .catch((error) => {
          console.error('Error updating agent:', error);
          setErrors({server: error.response.data.error});
        });
    }
  };

  const handleAddNewAgent = () => {
    isNewAgent.current = true;
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      role: 'agent',
      clientId: userDetails.clientId,
    });
    setShowForm(true);
  };

  const handleEditAgent = (agent) => {
    isNewAgent.current = false;
    setFormData(agent);
    setShowForm(true);
  };

  const handleDeleteAgent = (agentId) => {
    setDeleteAgentId(agentId);
  };

  const confirmDeleteAgent = () => {
    axios
      .delete(`/api/clientAdmin/deleteAgent`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
        data: {_id: deleteAgentId},
      })
      .then(() => {
        setAgents(agents.filter((agent) => agent._id !== deleteAgentId));
        setDeleteAgentId(null);
      })
      .catch((error) => {
        console.error('Error deleting agent:', error);
        setErrors({server: 'Error deleting agent, please try again.'});
        setDeleteAgentId(null);
      });
  };

  return (
    <div className='p-4'>
      {showForm ? (
        <div
          style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '20px',
            borderRadius: '12px',
            backgroundColor: '#f0f0f0',
          }}>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleInputChange}
            placeholder='Username'
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.username && (
            <div style={{color: 'red', fontSize: '12px'}}>
              {errors.username}
            </div>
          )}
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleInputChange}
            placeholder='Password'
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.password && (
            <div style={{color: 'red', fontSize: '12px'}}>
              {errors.password}
            </div>
          )}
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Name'
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.name && (
            <div style={{color: 'red', fontSize: '12px'}}>{errors.name}</div>
          )}
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Email'
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.email && (
            <div style={{color: 'red', fontSize: '12px'}}>{errors.email}</div>
          )}
          <input
            type='text'
            name='phone'
            value={formData.phone}
            onChange={handleInputChange}
            placeholder='Phone'
            style={{
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          {errors.phone && (
            <div style={{color: 'red', fontSize: '12px'}}>{errors.phone}</div>
          )}
          <div className='flex gap-2'>
            <button
              onClick={() => setShowForm(false)}
              className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2  rounded transition duration-300 w-full'>
              Cancel
            </button>
            <button
              onClick={
                isNewAgent.current
                  ? handleSaveNewAgent
                  : handleSaveExistingAgent
              }
              className='bg-green-500 hover:bg-green-600 text-white font-bold py-2  rounded transition duration-300 w-full'>
              Save Agent
            </button>
          </div>
          {errors.server && (
            <div
              style={{
                color: 'red',
                fontSize: '18px',
                textAlign: 'center',
                marginTop: 2,
              }}>
              {errors.server}
            </div>
          )}
        </div>
      ) : (
        <>
          <button
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mb-4 rounded transition duration-300 '
            onClick={handleAddNewAgent}>
            Add New Agent
          </button>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {agents.map((agent) => (
              <div
                key={agent._id}
                className='border p-4 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105'>
                <div className='mb-2 font-semibold text-lg text-gray-800'>
                  {agent.name}
                </div>
                <div className='mb-2 text-gray-600'>
                  Username: {agent.username}
                </div>
                <div className='mb-2 text-gray-600'>Email: {agent.email}</div>
                <div className='mb-2 text-gray-600'>Phone: {agent.phone}</div>
                <div className='flex justify-end space-x-2'>
                  <button
                    onClick={() => handleEditAgent(agent)}
                    className='bg-yellow-500 text-white py-1 px-3 rounded shadow transition-transform transform hover:scale-110'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAgent(agent._id)}
                    className='bg-red-500 text-white py-1 px-3 rounded shadow transition-transform transform hover:scale-110'>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {deleteAgentId && (
            <div className='fixed z-10 inset-0 overflow-y-auto'>
              <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <div className='fixed inset-0 transition-opacity'>
                  <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                </div>

                <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
                  &#8203;
                </span>

                <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                  <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                    <div className='sm:flex sm:items-start'>
                      <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                        <h3 className='text-lg leading-6 font-medium text-gray-900'>
                          Confirm Delete
                        </h3>
                        <div className='mt-2'>
                          <p className='text-sm text-gray-500'>
                            Are you sure you want to delete this agent? This
                            action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                    <button
                      type='button'
                      className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={confirmDeleteAgent}>
                      Delete
                    </button>
                    <button
                      type='button'
                      className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={() => setDeleteAgentId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ManageAgents;
