import { useUser } from '../context/UserContext';
import { colors } from '../constants/colors';

export const User = () => {
  const { user } = useUser();

  const userIdBase10 = parseInt(user?._id, 16);
  const color = colors.text[userIdBase10 % colors.text.length];

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-white flex justify-center items-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={'w-8 h-8 shadow-xl ' + color}>
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-white">{user?.username}</span>
    </div>
  );
};
