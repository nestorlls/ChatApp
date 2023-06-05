import { colors } from '../constants/colors';

export const Avatar = ({ userId, username, online }) => {
  const userIdBase10 = parseInt(userId, 16);
  const colosAvalar = colors.bg[userIdBase10 % colors.bg.length];

  const classOnline = online ? 'bg-green-500' : 'bg-gray-500';

  return (
    <div
      className={`w-8 h-8 relative rounded-full flex items-center justify-center ${colosAvalar}`}>
      <span className="font-bold w-full text-center opacity-50">
        <p>{username[0].toUpperCase()}</p>
      </span>
      <div
        className={`absolute w-2.5 h-2.5 rounded-full  bottom-0 right-0 border border-white ${classOnline}`}></div>
    </div>
  );
};
