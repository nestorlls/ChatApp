import axios from 'axios';
import { useUser } from '../context/UserContext';

export const LogoutB = ({ setWs }) => {
  const { setUser } = useUser();
  const handleLogout = () => {
    axios.post('/logout').then(() => {
      setUser(null);
      setWs(null);
    });
  };
  return (
    <button onClick={handleLogout} className="btn-logout">
      Logout
    </button>
  );
};
