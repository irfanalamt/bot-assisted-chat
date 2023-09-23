import React, {useEffect, useRef, useState} from 'react';
import OnlineStatus from './OnlineStatus';
import useSocket from '@/hooks/useSocket';

const ChatBox = ({socket, userName, messages, setMessages}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const {isOnline} = useSocket(socket);

  useEffect(() => {
    if (!socket.current) {
      return;
    }

    socket.current.on('chat_message', ({name, message}) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: name,
          text: message,
          type: 'server',
        },
      ]);
    });
  }, [socket.current]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    socket.current.emit('chat_message', {name: userName, message: inputValue});
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
    <div className='flex flex-col h-full p-4'>
      <div className='flex justify-end w-full p-2'>
        <OnlineStatus isOnline={isOnline} />
      </div>
      <div className='flex flex-col space-y-4 bg-white shadow-lg rounded-lg p-6 mb-6 flex-grow overflow-y-auto min-h-[60vh] max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
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
                          ? 'bg-gray-300 text-gray-800 rounded-br-none'
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
        className='flex items-center justify-between bg-white rounded-lg shadow-md p-6 w-full'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          className='flex-grow bg-gray-200 rounded-lg px-4 py-2 mr-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400'
          placeholder='Type a message'
        />
        <button
          type='submit'
          className='text-white bg-blue-400 hover:bg-blue-600 px-6 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400'>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
