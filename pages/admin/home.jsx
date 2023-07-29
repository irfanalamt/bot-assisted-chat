import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import AgentManager from '../../components/AgentManager';

const Home = () => {
  const router = useRouter();
  const [selectedOperation, setSelectedOperation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      router.replace('/admin/login');
    }
  }, []);

  return (
    <div className='flex flex-col items-center h-screen bg-gray-100 px-10'>
      <div className='self-start pt-4'>
        <h1 className='text-4xl font-bold mb-4 '>Admin Home</h1>
      </div>
      <div className='self-start pt-1'>
        <h1 className='text-2xl'>Welcome admin_name</h1>
      </div>
      <div className='h-4/5 flex flex-col justify-center'>
        {!selectedOperation && (
          <div className='flex space-x-4 bg-gray-300 p-5 '>
            <button
              className='px-6 py-2 text-lg text-white bg-blue-600 hover:bg-blue-500 rounded-lg focus:outline-none'
              onClick={() => setSelectedOperation('addAgent')}>
              Add Agents
            </button>

            <button
              className='px-6 py-2 text-lg text-white bg-green-600 hover:bg-green-500 rounded-lg focus:outline-none'
              onClick={() => console.log('Add NLP Files and Subflows')}>
              Add NLP Files and Subflows
            </button>
            <button
              className='px-6 py-2 text-lg text-white bg-red-600 hover:bg-red-500 rounded-lg focus:outline-none'
              onClick={() => console.log('Modify Styles')}>
              Modify Styles
            </button>
          </div>
        )}
        {selectedOperation === 'addAgent' && <AgentManager />}
      </div>
      <button
        className='px-6 py-2 text-lg text-white bg-gray-600 hover:bg-blue-500 rounded-lg focus:outline-none'
        onClick={() => setSelectedOperation(null)}>
        Go to admin menu
      </button>
    </div>
  );
};

export default Home;
