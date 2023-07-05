import ChatBox from '@/components/ChatBox';
import ChatRequestCard from '@/components/ChatRequestCard';
import MessageListSmall from '@/components/MessageListSmall';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {Socket, io} from 'socket.io-client';

interface Message {
  name: string;
  text: string;
  type: string;
}

interface UserDetails {
  id: string;
  details: {
    name: string;
    email: string;
  };
  messages: Message[];
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
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

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

    socket.on('agent_name', (agentname: string) => {
      setAgentName(agentname);
      console.log('Received agentname:', agentname);
    });

    socket.on('chat_request', ({name, id}) => {
      setChatRequest({name, id});
      console.log({name, id});
    });

    socket.on('chat_details', (details) => {
      setUserDetails(details);
    });

    socket.on('user_disconnected', () => {
      setUserDetails(null);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('agent_name');
      socket.off('chat_request');
      socket.off('chat_details');
      socket.off('user_disconnected');
    };
  }, [socket]);

  const handleDecline = () => {
    if (!socket || !chatRequest) return;

    socket.emit('chat_request_decline', chatRequest.id);
    setChatRequest(null);
  };
  const handleAccept = () => {
    if (!socket || !chatRequest) return;

    socket.emit('chat_request_accept', chatRequest.id);

    setChatRequest(null);
  };
  const handleEndChat = () => {
    if (!socket || !userDetails) return;

    socket.emit('end_chat', userDetails.id);

    setUserDetails(null);
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
            {userDetails && (
              <>
                <div className='flex flex-col pl-5 pt-5'>
                  <span className='text-xl mb-1 text-gray-800 font-medium'>
                    User Info
                  </span>
                  <div className='text-xl mt-1 flex items-center'>
                    <span className='text-gray-700 mr-3'>
                      {userDetails.details.name}
                    </span>
                  </div>
                  <span className='text-lg text-gray-600 mt-1'>
                    {userDetails.details.email}
                  </span>
                </div>
                <div className='border-t-2 border-b-2 border-gray-200 mt-6 mb-6 py-6 px-6'>
                  <MessageListSmall messages={userDetails.messages} />
                </div>
                <button
                  onClick={handleEndChat}
                  className='text-white bg-red-600 px-6 py-2 ml-4 rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400'>
                  End Chat
                </button>
              </>
            )}

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
