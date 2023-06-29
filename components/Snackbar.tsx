import React from 'react';

interface SnackbarProps {
  message: string;
  messageType: 'success' | 'error';
}

const styles = {
  base: 'rounded-md p-4 my-4 mx-auto text-center max-w-md text-lg',
  success: 'bg-green-200 text-green-700',
  error: 'bg-red-200 text-red-700',
  container: 'absolute left-0 right-0 max-w-max mx-auto',
};

const Snackbar: React.FC<SnackbarProps> = ({message, messageType}) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.base} ${
          messageType === 'success' ? styles.success : styles.error
        }`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Snackbar;
