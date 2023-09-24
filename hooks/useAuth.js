import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {decode} from '../utils/cipher';

const useAuth = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const authData = localStorage.getItem('authData');

    if (!authData) {
      router.replace('/');
      return;
    }

    try {
      const {role, token, name, clientId} = JSON.parse(
        decode(authData, process.env.NEXT_PUBLIC_AUTH_KEY)
      );
      setUserDetails({role, token, name, clientId});
    } catch (error) {
      console.error('Failed to parse auth data', error);
      router.replace('/');
    }
  }, []);

  return {userDetails, setUserDetails};
};

export default useAuth;
