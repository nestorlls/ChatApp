import { useCallback, useState } from 'react';

export const Form = () => {
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

    if (username && password) {
      setIsLoginOrRegister('login');
      console.log(userData);
    }
  };

  return (
    <form
      className="flex flex-col w-1/2 mx-auto mb-12 gap-2"
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
        Passwrod
        <input
          type="text"
          name="password"
          id="password"
          className="input-form"
          autoComplete="off"
          placeholder="******"
          value={userData.password}
          onChange={handleChange}
        />
      </label>
      <button type="submit" className="btn">
        {isLoginOrRegister === 'login' ? 'Register' : 'Login'}
      </button>
      {isLoginOrRegister === 'login' ? (
        <div className="btn-login__register">
          <span>Already a member? </span>
          <button
            type="button"
            onClick={() => setIsLoginOrRegister('register')}>
            Login here
          </button>
        </div>
      ) : (
        <div className="btn-login__register">
          <span>Don't have an account? </span>
          <button type="button" onClick={() => setIsLoginOrRegister('login')}>
            Register
          </button>
        </div>
      )}
    </form>
  );
};
