import {useEffect, useState} from 'react';

const useSocket = (socket) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!socket.current) {
      return;
    }
    socket.current.on('connect', () => setIsOnline(true));
    socket.current.on('disconnect', () => setIsOnline(false));
    return () => {
      socket.current.off('connect');
      socket.current.off('disconnect');
    };
  }, [socket.current]);

  return {isOnline};
};

export default useSocket;
