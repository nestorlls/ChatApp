import axios from 'axios';
import { UserPrivider } from './context/UserContext';
import { Routes } from './routes/Routes';

function App() {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true;

  return (
    <UserPrivider>
      <Routes />
    </UserPrivider>
  );
}

export default App;
