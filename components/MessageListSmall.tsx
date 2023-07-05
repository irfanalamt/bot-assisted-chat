import React from 'react';

interface Message {
  type: string;
  name: string;
  text: string;
}

interface Props {
  messages: Message[];
}

const MessageListSmall: React.FC<Props> = ({messages}) => {
  return (
    <div className='w-64 h-96 overflow-auto bg-gray-100 p-4'>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 p-2 rounded-md ${
            message.type === 'user' ? 'bg-blue-200' : 'bg-green-200'
          }`}>
          <h2 className='font-bold'>{message.name}</h2>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageListSmall;
