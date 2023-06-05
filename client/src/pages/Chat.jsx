import { useEffect, useState } from 'react';
import { FormSendMessage } from '../components/FormSendMessage';
import { Logo } from '../components/Logo';
import { User } from '../components/User';
import { Contact } from '../components/Contact';
import { OnOff } from '../components/OnOff';
import { useUser } from '../context/UserContext';

import { uniqBy } from 'lodash';
import { Messages } from '../components/Messages';
import axios from 'axios';

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

      if ('online' in messageData) {
        const onlinePeople = showOnlinePeople(messageData.online);
        setOnliPeople(onlinePeople);
      } else if ('text' in messageData) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    });
  }, []);

  useEffect(() => {
    if (userSelected) {
      axios.get(`/messages/${userSelected}`).then((res) => {
        setMessages(res.data);
      });
    }
  }, [userSelected]);

  const onlinePeopleExclOurUser = { ...onliPeople };
  delete onlinePeopleExclOurUser[user.userId];

  const messagesWithoutDupes = uniqBy(messages, '_id');

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
      <section className="w-3/4 bg-slate-400 flex flex-col">
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
              <div className="relative h-full">
                <div className="overflow-y-scroll absolute top-0 right-0 left-0 bottom-2 flex flex-col gap-2 px-4">
                  {messagesWithoutDupes.map((message) => (
                    <Messages key={message._id} {...message} />
                  ))}
                </div>
              </div>
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
