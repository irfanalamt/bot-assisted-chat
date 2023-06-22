import React, {useEffect, useRef, useState} from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || '');

interface Message {
  type: string;
  text: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{type: '', text: ''}]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('chat message', (message: string) => {
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
  }, []);

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

    socket.emit('chat message', inputValue);
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
    <div className='flex flex-col h-screen justify-between items-center bg-gray-200 px-6 py-6'>
      <h4 className='text-2xl text-center text-gray-800 font-bold mb-4'>
        RFN Chat
      </h4>
      <ul className='flex-grow overflow-auto mb-6 bg-white rounded-lg shadow-inner p-6 max-w-lg w-full'>
        {messages.map(
          (message, index) =>
            message.text && (
              <li
                key={index}
                className={`my-4 p-4 rounded-lg max-w-xs transition-all duration-200 ease-in-out ${
                  message.type === 'user'
                    ? 'bg-blue-200 text-gray-700 ml-auto rounded-br-none'
                    : 'bg-gray-200 text-gray-700 mr-auto rounded-bl-none'
                } `}>
                {message.text}
              </li>
            )
        )}
        <div ref={messagesEndRef} />
      </ul>

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
    </div>
  );
};

export default ChatPage;
