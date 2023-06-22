import {useEffect, useState} from 'react';
import {io, Socket} from 'socket.io-client';
const SERVER_URL: string = process.env.NEXT_PUBLIC_SERVER_URL || '';

const Home = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(SERVER_URL, {});
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }, [socket]);

  return (
    <div>
      <h1>socket connection has been established!</h1>
      <h2>We're officially connected 🎉</h2>
    </div>
  );
};

export default Home;
