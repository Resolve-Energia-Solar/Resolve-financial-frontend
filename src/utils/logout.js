import { useState } from 'react';
import Cookies from 'js-cookie'; 
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/user/userSlice';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      dispatch(clearUser());

      Cookies.remove('access_token');
      Cookies.remove('user_id');
      Cookies.remove('username');

      router.push('/auth/login');
      setLoading(false); 
    }, 1000); 
  };

  const requestLogout = () => {
    setConfirmLogout(true);
  };

  const cancelLogout = () => {
    setConfirmLogout(false);
  };

  return { handleLogout, requestLogout, cancelLogout, loading, confirmLogout };
};
