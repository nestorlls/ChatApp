import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export const FormSendMessage = ({ ws, userSelected, addMessages }) => {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim().length > 0) {
      ws.send(
        JSON.stringify({
          recipient: userSelected,
          text: newMessage,
        })
      );
      setNewMessage('');
      addMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          sender: user.userId,
          recipient: userSelected,
          text: newMessage,
        },
      ]);
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-form"
        placeholder="Type your message"
        value={newMessage}
        onChange={handleChange}
      />
      <button type="submit" className="py-2 px-3 bg-blue-500 rounded-md">
        <span className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </span>
      </button>
    </form>
  );
};
