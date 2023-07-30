import {useState} from 'react';
import EditClientAdmin from './EditClientAdmin';

const AdminClientEditorAdmin = ({client}) => {
  const [step, setStep] = useState(1);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const admins = client.admins;

  function handleEditAdmin(admin) {
    setCurrentAdmin(admin);
    setStep(2);
  }

  return (
    <div className='w-full flex flex-col p-4'>
      {step === 1 && (
        <>
          <h5 className='text-center text-2xl mb-4'>Client Admin Management</h5>
          {admins?.map((admin, i) => (
            <div
              key={i}
              className='w-full flex justify-between items-center border-b border-gray-200 py-4'>
              <p className='font-semibold'>{admin.clientId}</p>
              <div className='w-4/5 flex items-center justify-between ml-2'>
                <p className='font-semibold text-lg'>{admin.name}</p>
                <p className='text-sm text-gray-600'>{admin.username}</p>
                <p className='text-gray-600'>{admin.phone}</p>{' '}
                <p className='text-gray-600'>{admin.email}</p>
              </div>
              <div className='w-1/5 flex items-center justify-end ml-2'>
                <button
                  className='px-4 py-2 mx-2 rounded-md shadow-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200'
                  onClick={() => handleEditAdmin(admin)}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </>
      )}
      {step === 2 && <EditClientAdmin admin={currentAdmin} />}
      <button className='px-4 py-2 rounded-md shadow-md text-white bg-stone-500 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-opacity-50 transition-colors duration-200 w-max mx-auto mt-8'>
        Add new client admin
      </button>
    </div>
  );
};

export default AdminClientEditorAdmin;
