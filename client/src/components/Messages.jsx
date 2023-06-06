import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';

export const Messages = ({ sender, text }) => {
  const { user } = useUser();
  const divUnderMessages = useRef(null);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [text]);

  return (
    <div className={sender === user._id ? 'text-right' : 'text-left'}>
      <div
        className={`text-white inline-block rounded-lg shadow-2xl ${
          sender === user._id ? 'bg-blue-600 p-2' : 'bg-gray-500 p-2'
        }`}>
        {text}
      </div>
      <div ref={divUnderMessages}></div>
    </div>
  );
};
