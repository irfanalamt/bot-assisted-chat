import {useState} from 'react';
import EditClientAdmin from './EditClientAdmin';

const AdminClientEditorAdmin = ({
  client,
  setShowGoBackBtn,
  reloadClientData,
}) => {
  const [step, setStep] = useState(1);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const admins = client.admins;

  function handleEditAdmin(admin) {
    if (!admin.id) {
      admin.id = generateAdminId(client);
    }
    if (!admin.clientId) {
      admin.clientId = client.clientId;
    }
    setCurrentAdmin(admin);
    setStep(2);
    setShowGoBackBtn(false);
  }

  function handleAddNewAdmin() {
    const newAdmin = {
      name: '',
      username: '',
      phone: '',
      email: '',
      accessCode: '',
      id: generateAdminId(client),
      clientId: client.clientId,
    };
    setCurrentAdmin(newAdmin);
    setStep(2);
    setShowGoBackBtn(false);
  }

  function generateAdminId(client) {
    // Get the current client's ID
    const clientId = client.clientId;

    // Find the highest admin ID number
    let maxId = 0;
    for (let i = 0; i < client.admins?.length; i++) {
      const adminId = client.admins[i].id;
      if (adminId && adminId.includes('_')) {
        const idNumber = Number(adminId.split('_')[1]);
        if (!isNaN(idNumber) && idNumber > maxId) {
          maxId = idNumber;
        }
      }
    }

    // generate new unique admin ID
    const newAdminId = `${clientId}_${maxId + 1}`;

    return newAdminId;
  }

  return (
    <div className='w-full flex flex-col p-4'>
      {step === 1 && (
        <>
          <h2 className='text-center text-2xl mb-4'>Client Admin Management</h2>
          <table className='w-full text-left bg-white rounded-lg overflow-hidden shadow-lg'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='py-2 px-4 text-gray-600'>Name</th>
                <th className='py-2 px-4 text-gray-600'>Username</th>
                <th className='py-2 px-4 text-gray-600'>Phone</th>
                <th className='py-2 px-4 text-gray-600'>Email</th>
                <th className='py-2 px-4 text-gray-600'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((admin, i) => (
                <tr key={i} className='border-t border-gray-200'>
                  <td className='py-2 px-4'>{admin.name}</td>
                  <td className='py-2 px-4'>{admin.username}</td>
                  <td className='py-2 px-4'>{admin.phone}</td>
                  <td className='py-2 px-4'>{admin.email}</td>
                  <td className='py-2 px-4'>
                    <button
                      className='px-4 py-2 rounded-md shadow-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-200'
                      onClick={() => handleEditAdmin(admin)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className='px-4 py-2 rounded-md shadow-md text-white bg-stone-500 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-opacity-50 transition-colors duration-200 w-max mx-auto mt-8'
            onClick={handleAddNewAdmin}>
            Add new client admin
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <button
            className='px-4 py-2 rounded-full shadow-md text-white bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 m-2 self-start transition-colors duration-200'
            onClick={() => {
              setStep(1);
              setShowGoBackBtn(true);
            }}>
            Go back
          </button>
          <EditClientAdmin
            admin={currentAdmin}
            handleGoBack={() => {
              setStep(1);
              setShowGoBackBtn(true);
            }}
            reloadClientData={reloadClientData}
          />
        </>
      )}
    </div>
  );
};

export default AdminClientEditorAdmin;
