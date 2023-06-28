import {useState, useEffect} from 'react';

type SnackbarType = 'success' | 'error';

const useSnackbar = () => {
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>('success');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSnackbarVisible) {
      timer = setTimeout(() => {
        setSnackbarVisible(false);
      }, 2500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isSnackbarVisible]);

  function showSnackbar(message: string, type: SnackbarType = 'success') {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  }

  return {isSnackbarVisible, snackbarMessage, snackbarType, showSnackbar};
};

export default useSnackbar;
