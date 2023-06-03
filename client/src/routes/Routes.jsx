import React from 'react';
import { LoginOrRegisterForm } from '../pages/LoginOrRegisterForm';
import { useUser } from '../context/UserContext';

export const Routes = () => {
  const { user } = useUser();

  if (user) {
    return 'Logged in as ';
  }

  return <LoginOrRegisterForm />;
};
