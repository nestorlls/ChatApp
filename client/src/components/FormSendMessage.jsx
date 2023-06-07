import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export const FormSendMessage = ({ ws, userSelected, addMessages }) => {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = async (e, file = null) => {
    if (e) e.preventDefault();

    ws.send(
      JSON.stringify({
        recipient: userSelected,
        text: newMessage,
        file,
      })
    );

    if (newMessage.trim().length > 0) {
      setNewMessage('');
      addMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          sender: user._id,
          recipient: userSelected,
          text: newMessage,
        },
      ]);
    }
  };

  const uploadFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onload = () => {
      handleSubmit(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  return (
    <form className="flex gap-2 p-2" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-form"
        placeholder="Type your message"
        value={newMessage}
        onChange={handleChange}
      />
      <label
        htmlFor="file"
        typeof="button"
        className="rounded-md bg-gray-200 p-2 text-gray-500 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6">
          <path
            fillRule="evenodd"
            d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="file"
          name="file"
          id="file"
          className="hidden"
          onChange={uploadFile}
        />
      </label>
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
