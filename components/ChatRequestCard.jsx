const ChatRequestCard = ({userName = 'UserABC'}) => {
  const handleAccept = () => {};
  const handleDecline = () => {};

  return (
    <div className='flex flex-col max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-4 w-full'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-medium text-gray-700'>
          <span className=' text-blue-600'>{userName}</span> has sent a
          connection request.
        </h2>
      </div>

      <div className='flex'>
        <button
          onClick={handleAccept}
          className='text-white bg-green-500 px-6 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400'>
          Accept
        </button>
        <button
          onClick={handleDecline}
          className='text-white bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ml-2'>
          Decline
        </button>
      </div>
    </div>
  );
};

export default ChatRequestCard;
