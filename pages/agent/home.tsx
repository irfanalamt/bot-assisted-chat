import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {io, Socket} from 'socket.io-client';

const Home = (): JSX.Element => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/agent/login');
    } else {
      const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/agents`, {
        query: {token},
      });
      setSocket(newSocket);
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

    return () => {
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [socket]);

  return <>Welcome agent Home</>;
};

export default Home;
