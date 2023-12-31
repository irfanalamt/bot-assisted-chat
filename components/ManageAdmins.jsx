import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import ConfirmActionModal from './ConfirmActionModal';

function ManageAdmins({userDetails, goToHome}) {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    clientId: userDetails.clientId,
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleteAdminId, setDeleteAdminId] = useState(null);
  const isNewAdmin = useRef(false);

  useEffect(() => {
    axios
      .get('/api/clientAdmin/getAllAdmins', {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
      })
      .then(({data}) => setAdmins(data))
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

  const handleSaveNewAdmin = () => {
    if (validateFormData()) {
      console.log('formdata', formData);
      axios
        .post('/api/clientAdmin/createAdmin', formData, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        })
        .then((response) => {
          setAdmins([...admins, response.data]);
          setShowForm(false);
        })
        .catch((error) => {
          console.error('Error creating admin:', error);
          setErrors({server: error.response.data.error});
        });
    }
  };

  const handleSaveExistingAdmin = () => {
    if (validateFormData()) {
      axios
        .put(`/api/clientAdmin/modifyAdmin/${formData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        })
        .then(() => {
          // Refresh the admin list after editing an admin
          axios
            .get('/api/clientAdmin/getAllAdmins', {
              headers: {
                Authorization: `Bearer ${userDetails.token}`,
              },
            })
            .then((response) => {
              setAdmins(response.data);
              setShowForm(false);
            })
            .catch((error) => {
              console.error('Error fetching admins:', error);
              setErrors({server: 'Error updating admin, please try again.'});
            });
        })
        .catch((error) => {
          console.error('Error updating admin:', error);
          setErrors({server: error.response.data.error});
        });
    }
  };

  const handleAddNewAdmin = () => {
    isNewAdmin.current = true;
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      clientId: userDetails.clientId,
    });
    setShowForm(true);
  };

  const handleEditAdmin = (admin) => {
    isNewAdmin.current = false;
    setFormData(admin);
    setShowForm(true);
  };

  const handleDeleteAdmin = (adminId) => {
    setDeleteAdminId(adminId);
  };

  const confirmDeleteAdmin = () => {
    axios
      .delete(`/api/clientAdmin/deleteAdmin`, {
        headers: {
          Authorization: `Bearer ${userDetails.token}`,
        },
        data: {_id: deleteAdminId},
      })
      .then(() => {
        setAdmins(admins.filter((admin) => admin._id !== deleteAdminId));
        setDeleteAdminId(null);
      })
      .catch((error) => {
        console.error('Error deleting admin:', error);
        setErrors({server: 'Error deleting admin, please try again.'});
        setDeleteAdminId(null);
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
          <h2 className='text-2xl text-center '>Admin Details</h2>
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
                isNewAdmin.current
                  ? handleSaveNewAdmin
                  : handleSaveExistingAdmin
              }
              className='bg-green-500 hover:bg-green-600 text-white font-bold py-2  rounded transition duration-300 w-full'>
              Save Admin
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
          <div>
            <button
              className='bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300'
              onClick={goToHome}>
              Go Back
            </button>
            <h2 className='text-3xl text-center '>Manage Admins</h2>
          </div>
          <button
            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mb-4 ml-2 rounded transition duration-300 '
            onClick={handleAddNewAdmin}>
            Add New Admin
          </button>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {admins.map((admin) => (
              <div
                key={admin._id}
                className='border p-4 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105'>
                <div className='mb-2 font-semibold text-lg text-gray-800'>
                  {admin.name}
                </div>
                <div className='mb-2 text-gray-600'>
                  Username: {admin.username}
                </div>
                <div className='mb-2 text-gray-600'>Email: {admin.email}</div>
                <div className='mb-2 text-gray-600'>Phone: {admin.phone}</div>
                <div className='flex justify-end space-x-2'>
                  <button
                    onClick={() => handleEditAdmin(admin)}
                    className='bg-yellow-500 text-white py-1 px-3 rounded shadow transition-transform transform hover:scale-110'>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin._id)}
                    className='bg-red-500 text-white py-1 px-3 rounded shadow transition-transform transform hover:scale-110'>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {deleteAdminId && (
            <ConfirmActionModal
              action='delete'
              actionText='Are you sure you want to delete this admin? This action cannot be undone.'
              handleYes={confirmDeleteAdmin}
              handleNo={() => setDeleteAdminId(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ManageAdmins;
