import React from 'react';

interface SnackbarProps {
  message: string;
  messageType: 'success' | 'error';
}

const Snackbar: React.FC<SnackbarProps> = ({message, messageType}) => {
  const baseStyle = 'rounded-md p-4 my-4 mx-auto text-center max-w-md text-lg';
  const successStyle = 'bg-green-200 text-green-700';
  const errorStyle = 'bg-red-200 text-red-700';

  return (
    <div
      className={`${baseStyle} ${
        messageType === 'success' ? successStyle : errorStyle
      }`}>
      <p>{message}</p>
    </div>
  );
};

export default Snackbar;
