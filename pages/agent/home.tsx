import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {io, Socket} from 'socket.io-client';
import ChatBox from '@/components/ChatBox';
import ChatRequestCard from '@/components/ChatRequestCard';

interface Message {
  name: string;
  text: string;
  type: string;
}
const Home = (): JSX.Element => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {name: '', text: '', type: ''},
  ]);
  const [agentName, setAgentName] = useState<string>('');
  const [chatRequest, setChatRequest] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/agent/login');
    } else {
      const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/agents`, {
        query: {token},
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('agent connected');
    });

    socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    socket.on('username', (username: string) => {
      setAgentName(username);
      console.log('Received username:', username);
    });

    socket.on('chat_request', ({name, id}) => {
      setChatRequest({name, id});
      console.log({name, id});
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('username');
      socket.off('chat_request');
    };
  }, [socket]);

  const handleDecline = () => {
    setChatRequest(null);
  };
  const handleAccept = () => {
    if (!socket || !chatRequest) return;

    // send accept_request event
    socket.emit('accept_request', chatRequest.id);

    setChatRequest(null);
  };

  return (
    <div className='h-screen bg-gray-200 px-6 py-6 flex flex-col'>
      <h4 className='text-2xl text-center text-gray-700 font-bold mb-4'>
        BCX Agent Chat
      </h4>
      {agentName && (
        <p className='text-gray-800 font-medium'>Welcome {agentName}</p>
      )}

      {socket && (
        <div className='flex flex-grow justify-between overflow-auto'>
          <div className='w-5/12 flex'>
            <ChatBox
              socket={socket}
              userName={agentName}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
          <div className='w-6/12 bg-gray-100'>
            <div className='flex flex-col pl-5 pt-5'>
              <div className='text-2xl mt-1 flex items-center'>
                <span className='text-gray-700 mr-3'>User Name</span>
              </div>
              <span className='text-lg text-gray-600 mt-1'>User Details</span>
            </div>

            <div className='border-t-2 border-b-2 border-gray-200 mt-6 mb-6 py-6 px-6'>
              // user chat history here
            </div>
            {chatRequest && (
              <div className='pt-10 pl-5'>
                <ChatRequestCard
                  userName={chatRequest.name}
                  handleDecline={handleDecline}
                  handleAccept={handleAccept}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
