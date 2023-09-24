import {useRouter} from 'next/router';
import {useState} from 'react';
import ManageAdmins from '../../components/ManageAdmins';
import ManageAgents from '../../components/ManageAgents';
import SetupNlp from '../../components/SetupNlp';
import TestBot from '../../components/TestBot';
import TopBar from '../../components/TopBar';
import useAuth from '../../hooks/useAuth';

const Home = () => {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState(null);
  const {userDetails} = useAuth();

  function handleLogout() {
    localStorage.clear();
    router.push('/');
  }

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <TopBar userDetails={userDetails} handleLogout={handleLogout} />
      <div className='flex-grow p-6'>
        {!currentMode && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 '>
            {userDetails?.role === 'clientAdmin' && (
              <div
                className='bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition duration-100 hover:bg-sky-100 cursor-pointer'
                onClick={() => setCurrentMode('manageAdmins')}>
                <h2 className='text-xl font-bold text-gray-800'>
                  Manage Admins
                </h2>
              </div>
            )}

            <div
              className='bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition duration-100 hover:bg-sky-100 cursor-pointer'
              onClick={() => setCurrentMode('manageAgents')}>
              <h2 className='text-xl font-bold text-gray-800'>Manage Agents</h2>
            </div>
            <div
              className='bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition duration-100 hover:bg-sky-100 cursor-pointer'
              onClick={() => setCurrentMode('setupNlp')}>
              <h2 className='text-xl font-bold text-gray-800'>
                Setup NLP Files and Subflows
              </h2>
            </div>
            <div
              className='bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition duration-300 hover:bg-sky-100 cursor-pointer'
              onClick={() => setCurrentMode('setupCss')}>
              <h2 className='text-xl font-bold text-gray-800'>
                Setup CSS Files
              </h2>
            </div>
            <div
              className='bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition duration-300 hover:bg-sky-100 cursor-pointer'
              onClick={() => setCurrentMode('testBot')}>
              <h2 className='text-xl font-bold text-gray-800'>Test Chatbot</h2>
            </div>
          </div>
        )}
        {currentMode === 'manageAdmins' && (
          <ManageAdmins
            userDetails={userDetails}
            goToHome={() => setCurrentMode(null)}
          />
        )}
        {currentMode === 'manageAgents' && (
          <ManageAgents
            userDetails={userDetails}
            goToHome={() => setCurrentMode(null)}
          />
        )}
        {currentMode === 'setupNlp' && (
          <SetupNlp
            userDetails={userDetails}
            goToHome={() => setCurrentMode(null)}
          />
        )}
        {currentMode === 'setupCss' && (
          <h2 className='text-3xl text-center'>Setup CSS Files</h2>
        )}
        {currentMode === 'testBot' && (
          <TestBot
            userDetails={userDetails}
            goToHome={() => setCurrentMode(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
