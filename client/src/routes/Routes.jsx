import React from 'react';
import { LoginOrRegisterForm } from '../pages/LoginOrRegisterForm';
import { useUser } from '../context/UserContext';
import { Chat } from '../pages/Chat';

export const Routes = () => {
  const { user } = useUser();

  if (user) {
    return <Chat />;
  }

  return <LoginOrRegisterForm />;
};
