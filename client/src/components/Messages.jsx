import { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';

export const Messages = ({ sender, text, file }) => {
  const { user } = useUser();
  const divUnderMessages = useRef(null);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [text, file]);

  const hasFile = (file) => {
    if (file) {
      return true;
    }
    return false;
  };

  return (
    <div className={sender === user._id ? 'text-right' : 'text-left'}>
      <div
        className={`text-white inline-block rounded-lg shadow-2xl ${
          sender === user._id
            ? hasFile(file) || 'bg-blue-600 p-2'
            : hasFile(file) || 'bg-gray-500 p-2'
        }`}>
        {text}
        {file && (
          <div>
            <a target="_blank" href={file}>
              <img
                className="rounded-lg w-80 object-cover "
                src={file}
                alt={file}
              />
            </a>
          </div>
        )}
      </div>
      <div ref={divUnderMessages}></div>
    </div>
  );
};
