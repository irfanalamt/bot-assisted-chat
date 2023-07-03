import React, {useEffect, useRef, useState} from 'react';
import {Socket} from 'socket.io-client';
import OnlineStatus from './OnlineStatus';
import useSocket from '@/hooks/useSocket';

interface Message {
  name: string;
  text: string;
  type: string;
}
interface ChatBoxProps {
  socket: Socket;
  userName: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  socket,
  userName,
  messages,
  setMessages,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {isOnline} = useSocket(socket);

  useEffect(() => {
    socket.on('chat_message', ({name, message}) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: name,
          text: message,
          type: 'server',
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

    socket.emit('chat_message', {name: userName, message: inputValue});
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        name: 'user',
        text: inputValue,
        type: 'user',
      },
    ]);
    setInputValue('');
  };

  return (
    <div className='flex flex-col w-full h-full max-w-lg'>
      <div className='flex justify-end w-full  p-1'>
        <OnlineStatus isOnline={isOnline} />
      </div>
      <div className='flex flex-col space-y-4 h-full bg-white shadow-lg rounded-lg p-6 overflow-auto mb-6'>
        {messages.map(
          (message, index) =>
            message.text && (
              <div
                key={index}
                className={`flex items-start ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                <div className='flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2'>
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg inline-block ${
                        message.type === 'user'
                          ? 'bg-gray-200 text-gray-700 rounded-br-none'
                          : 'bg-blue-200 text-gray-700 rounded-bl-none'
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
                    {message.name == 'user' ? userName : message.name}
                  </span>
                </div>
              </div>
            )
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className='flex items-center justify-between bg-white rounded-lg shadow-md p-6  w-full'>
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
    </div>
  );
};

export default ChatBox;
