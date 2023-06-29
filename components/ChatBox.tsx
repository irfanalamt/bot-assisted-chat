import React, {useEffect, useRef, useState} from 'react';
import {Socket} from 'socket.io-client';
import OnlineStatus from './OnlineStatus';
import useSocket from '@/hooks/useSocket';

interface Message {
  type: string;
  text: string;
}
interface ChatBoxProps {
  socket: Socket;
  userName: string;
  agentName: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({socket, userName, agentName}) => {
  const [messages, setMessages] = useState<Message[]>([{type: '', text: ''}]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {isOnline} = useSocket(socket);

  useEffect(() => {
    socket.on('chat_message', (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'server',
          text: message,
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    socket.emit('chatMessage', inputValue);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'user',
        text: inputValue,
      },
    ]);
    setInputValue('');
  };

  return (
    <>
      <div className='flex justify-end w-full max-w-lg pb-1 pr-1'>
        <OnlineStatus isOnline={isOnline} />
      </div>

      <div className='flex flex-col space-y-4 max-w-lg w-full h-full bg-white shadow-lg rounded-lg p-6 overflow-auto mb-6'>
        {messages.map(
          (message, index) =>
            message.text && (
              <div
                key={index}
                className={`flex items-start ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                <div className='flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 '>
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg inline-block  ${
                        message.type === 'user'
                          ? 'bg-gray-200 text-gray-700 rounded-br-none'
                          : ' bg-blue-200 text-gray-700 rounded-bl-none'
                      }`}>
                      {message.text}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${
                      message.type === 'user'
                        ? 'text-gray-500 self-end'
                        : 'text-blue-600'
                    }`}>
                    {message.type === 'server' ? agentName : userName}
                  </span>
                </div>
              </div>
            )
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex items-center justify-between bg-white rounded-lg shadow-md px-6 py-3 max-w-lg w-full'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          className='flex-grow bg-gray-200 rounded-md px-4 py-2 mr-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'
          placeholder='Type a message'
        />
        <button
          type='submit'
          className='text-white bg-indigo-600 px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400'>
          Send
        </button>
      </form>
    </>
  );
};

export default ChatBox;
