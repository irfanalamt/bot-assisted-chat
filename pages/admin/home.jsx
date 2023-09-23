import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import TopBar from '../../components/TopBar';
import {decode} from '../../utils/cipher';
import ManageAdmins from '../../components/ManageAdmins';
import ManageAgents from '../../components/ManageAgents';
import SetupNlp from '../../components/SetupNlp';
import TestBot from '../../components/TestBot';

const Home = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [currentMode, setCurrentMode] = useState(null);

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      router.replace('/');
      return;
    }

    try {
      const {role, token, name, clientId} = JSON.parse(
        decode(authData, process.env.NEXT_PUBLIC_AUTH_KEY)
      );
      setUserDetails({role, token, name, clientId});
    } catch (error) {
      console.error('Failed to parse auth data', error);
      router.replace('/');
    }
  }, []);

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
