import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext({});

function UserPrivider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/profile').then((res) => {
      setUser(res.data);
    });
  }, []);

  function login(url, data) {
    axios.post(url, data).then((res) => {
      setUser(res.data);
    });
  }

  return (
    <UserContext.Provider value={{ user, setUser, login }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  return useContext(UserContext);
}

export { UserPrivider, useUser };
