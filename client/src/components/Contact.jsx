import { Avatar } from './Avatar';

export const Contact = ({ userId, username, onClick, selected, isOnline }) => {
  return (
    <div
      key={userId}
      className={`flex items-center gap-2 border-gray-600 border-b cursor-pointer ${
        selected ? 'bg-slate-400' : ''
      }`}
      onClick={() => onClick(userId)}>
      {selected && <div className="w-1 h-12 bg-white rounded-r-lg" />}
      <div className="flex gap-2 py-3 pl-12 items-center">
        <Avatar userId={userId} username={username} online={isOnline} />
        <span className={`${selected ? 'text-gray-800' : 'text-white'}`}>
          {username}
        </span>
      </div>
    </div>
  );
};
