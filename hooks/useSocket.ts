import {useEffect, useState} from 'react';
import {Socket} from 'socket.io-client';

const useSocket = (socket: Socket) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    socket.on('connect', () => setIsOnline(true));
    socket.on('disconnect', () => setIsOnline(false));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  return {isOnline};
};

export default useSocket;
