import axios from 'axios';
import {useEffect} from 'react';

const Home = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/home`
        );

        console.log('success');
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return <>This is Home</>;
};

export default Home;
