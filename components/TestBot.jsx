import {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client';
import ChatBox from './ChatBox';

const TestBot = ({userDetails, goToHome}) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      query: {clientId: userDetails.clientId},
    });
    socketRef.current = socket;

    // socket.on('connect', () => {
    //   console.log('connected');
    // });

    // clean up the socket
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='flex flex-col h-full p-4 max-w-xl mx-auto'>
      <div className='relative flex items-center w-full'>
        <button
          className='bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 z-10'
          onClick={goToHome}>
          Go Back
        </button>
        <div className='absolute inset-x-0 text-center'>
          <h2 className='text-3xl'>Test Chatbot</h2>
        </div>
      </div>

      <ChatBox
        socket={socketRef}
        userName={userDetails.name}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
};

export default TestBot;
