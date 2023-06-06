import { useState } from 'react';
import { useUser } from '../context/UserContext';

export const Form = () => {
  const { setUser, login } = useUser();
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
  const [userData, setUserData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = userData;
    const url = isLoginOrRegister === 'login' ? '/register' : '/login';

    if (username && password) {
      login(url, { ...userData });
    }
  };

  return (
    <form
      className="mx-auto mb-12 flex w-96 flex-col gap-2"
      onSubmit={handleSubmit}>
      <label htmlFor="username">
        Username
        <input
          type="text"
          name="username"
          id="username"
          className="input-form"
          autoComplete="off"
          placeholder="your username"
          value={userData.username}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="password">
        Password
        <input
          type="password"
          name="password"
          id="password"
          className="input-form"
          autoComplete="off"
          placeholder="******"
          value={userData.password}
          onChange={handleChange}
        />
      </label>
      <button type="submit" className="btn-submit bg-blue-600">
        {isLoginOrRegister === 'login' ? 'Register' : 'Login'}
      </button>
      <div className="text-white">
        {isLoginOrRegister === 'login' ? (
          <div className="btn-login__register">
            <span>Already a member? </span>
            <button
              type="button"
              onClick={() => setIsLoginOrRegister('register')}
              className="hover-link">
              Login here
            </button>
          </div>
        ) : (
          <div className="btn-login__register">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={() => setIsLoginOrRegister('login')}
              className="hover-link">
              Register
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
