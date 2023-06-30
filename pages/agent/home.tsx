import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {io, Socket} from 'socket.io-client';
import ChatBox from '@/components/ChatBox';
import ChatRequestCard from '@/components/ChatRequestCard';

const Home = (): JSX.Element => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [agentName, setAgentName] = useState<string>('');
  const [chatRequest, setChatRequest] = useState<{name: string} | null>(null);

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

    socket.on('chat_request', (name: string) => {
      setChatRequest({name});
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('username');
      socket.off('chat_request');
    };
  }, [socket]);

  return (
    <div className='h-screen bg-gray-200 px-6 py-6 flex flex-col'>
      <h4 className='text-2xl text-center text-gray-700 font-bold mb-4'>
        BCX Agent Chat
      </h4>
      {agentName && (
        <p className='text-gray-800 font-medium'>Welcome {agentName}</p>
      )}

      {socket && (
        <div id='chat area' className='flex flex-grow '>
          <ChatBox socket={socket} userName={agentName} agentName={'Bot 1'} />
          {chatRequest && (
            <div className='pt-10 pl-10'>
              <ChatRequestCard userName={chatRequest.name} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
