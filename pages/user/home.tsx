import ChatBox from '@/components/ChatBox';
import Snackbar from '@/components/Snackbar';
import useSnackbar from '@/hooks/useSnackbar';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {Socket, io} from 'socket.io-client';

interface Message {
  name: string;
  text: string;
  type: string;
}

const Home: React.FC = () => {
  const [userInfo, setUserInfo] = useState({name: '', email: '', clientId: ''});
  const [showChat, setShowChat] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {name: '', text: '', type: ''},
  ]);
  const {isSnackbarVisible, snackbarMessage, snackbarType, showSnackbar} =
    useSnackbar();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setUserInfo((prevState) => ({...prevState, [name]: value}));
  };

  const isFormValid = (): boolean => {
    const {name, email} = userInfo;

    if (!name || !email) {
      showSnackbar('Both name and email fields are required.', 'error');
      return false;
    }

    if (!process.env.NEXT_PUBLIC_SERVER_URL) {
      showSnackbar('Server URL is not defined.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isFormValid()) return;

    try {
      const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
        query: userInfo,
      });

      setSocket(newSocket);
    } catch (error) {
      showSnackbar('Failed to initialize socket connection.', 'error');
      console.error('Socket initialization error:', error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      setShowChat(true);
    });

    socket.on('connect_error', (error) => {
      showSnackbar('Socket connection error occurred.', 'error');
      console.error('Socket connection error:', error);
    });

    socket.on('send_chat_details', (id) => {
      setMessages((currentMessages) => {
        socket.emit('chat_details', {
          agentId: id,
          messages: currentMessages,
          details: userInfo,
        });
        console.log('messages:', JSON.stringify(currentMessages));
        return currentMessages;
      });
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('send_chat_details');
    };
  }, [socket]);

  const {name, email, clientId} = userInfo;

  return showChat ? (
    <div className='flex flex-col h-screen justify-between items-center bg-gray-200 px-6 py-6'>
      <h4 className='text-2xl text-center text-gray-800 font-bold mb-4'>
        BCX Chat
      </h4>
      {socket && (
        <div className='h-full overflow-auto w-2/3 mx-auto flex justify-center'>
          <ChatBox
            socket={socket}
            userName={name}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      )}
    </div>
  ) : (
    <div className='flex flex-col h-screen items-center bg-gray-200 px-2 pt-40'>
      <h1 className='text-3xl text-center text-gray-600 font-bold my-6'>
        BCX Chat
      </h1>
      <div className=''>
        <div className='text-xl text-center text-gray-800 font-bold mb-4'>
          User Info
        </div>
        <form
          onSubmit={handleSubmit}
          className='bg-white rounded-lg shadow-md px-8 py-8 max-w-md space-y-4'>
          <input
            type='text'
            name='clientId'
            value={clientId}
            onChange={handleChange}
            className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500'
            placeholder='ClientID'
          />
          <input
            type='text'
            name='name'
            value={name}
            onChange={handleChange}
            className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500'
            placeholder='Name'
          />
          <input
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
            className='w-full border-2 border-gray-300 p-3 rounded outline-none focus:border-indigo-500'
            placeholder='Email'
          />
          <button
            type='submit'
            className='w-full bg-green-500 text-white font-semibold p-3 rounded hover:bg-green-700 transition ease-in-out duration-200'>
            Start Chat
          </button>
        </form>
      </div>
      {isSnackbarVisible && (
        <Snackbar message={snackbarMessage} messageType={snackbarType} />
      )}
    </div>
  );
};

export default Home;
