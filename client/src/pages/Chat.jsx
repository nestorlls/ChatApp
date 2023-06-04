import { useEffect, useState } from 'react';
import { FormSendMessage } from '../components/FormSendMessage';
import { Logo } from '../components/Logo';
import { User } from '../components/User';
import { Contact } from '../components/Contact';
import { OnOff } from '../components/OnOff';
import { useUser } from '../context/UserContext';

const showOnlinePeople = (onlineUsersArr) => {
  const people = {};
  onlineUsersArr.forEach(({ userId, username }) => {
    people[userId] = username;
  });
  return people;
};

export const Chat = () => {
  const { user } = useUser();
  const [wsConecction, setWsConecction] = useState(null);
  const [onliPeople, setOnliPeople] = useState({});
  const [userSelected, setUserSelected] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setWsConecction(ws);
    ws.addEventListener('message', (event) => {
      const messageData = JSON.parse(event.data);

      console.log({ event, messageData });
      if ('online' in messageData) {
        const onlinePeople = showOnlinePeople(messageData.online);
        setOnliPeople(onlinePeople);
      } else {
        setMessages((prev) => [...prev, { text: messageData.text }]);
      }
    });
  }, []);

  const onlinePeopleExclOurUser = { ...onliPeople };
  delete onlinePeopleExclOurUser[user.userId];

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-slate-700">
        <div className="flex">
          <Logo />
          <User />
        </div>
        <div>
          <OnOff state="online" />
          {Object.entries(onlinePeopleExclOurUser).map(([userId, username]) => (
            <Contact
              key={userId}
              userId={userId}
              username={username}
              onClick={setUserSelected}
              selected={userSelected === userId}
            />
          ))}
        </div>
        <div>
          <OnOff state="offline" />
        </div>
      </aside>
      <section className="w-3/4 bg-slate-400 flex flex-col p-2">
        <div className="flex-grow">
          {!userSelected && (
            <>
              <div className="flex justify-center items-center h-full">
                <p className="text-2xl text-center text-gray-600">
                  &larr;Select a person from the sidebar
                </p>
              </div>
            </>
          )}
          {userSelected && (
            <>
              {messages.map((message, i) => (
                <p key={i}>{message.text}</p>
              ))}
            </>
          )}
        </div>
        {userSelected && (
          <FormSendMessage
            ws={wsConecction}
            userSelected={userSelected}
            addMessages={setMessages}
          />
        )}
      </section>
    </div>
  );
};
