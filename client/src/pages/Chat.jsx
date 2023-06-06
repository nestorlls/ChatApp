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
import { LogoutB } from '../components/LogoutB';

const showOnlinePeople = (onlineUsersArr) => {
  const people = {};
  onlineUsersArr.forEach(({ _id, username }) => {
    people[_id] = username;
  });
  return people;
};

export const Chat = () => {
  const { user } = useUser();
  const [wsConecction, setWsConecction] = useState(null);
  const [onlinePeople, setOnliPeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState([]);
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

  useEffect(() => {
    axios.get('/people').then((res) => {
      const offlinePeopleArr = res.data
        .filter(({ _id }) => !onlinePeople[_id])
        .filter(({ _id }) => _id !== user._id);
      setOfflinePeople(offlinePeopleArr);
    });
  }, [onlinePeople]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[user._id];

  const messagesWithoutDupes = uniqBy(messages, '_id');

  return (
    <div className="flex h-screen">
      <aside className="w-80 bg-slate-700 flex flex-col justify-evenly">
        <div className="flex-grow">
          <div className="flex">
            <Logo />
            <User />
          </div>
          <div>
            <OnOff
              state="online"
              countPeople={Object.entries(onlinePeopleExclOurUser).length}
            />
            {Object.entries(onlinePeopleExclOurUser).map(
              ([userId, username]) => (
                <Contact
                  key={userId}
                  userId={userId}
                  username={username}
                  onClick={setUserSelected}
                  isOnline={true}
                  selected={userSelected === userId}
                />
              )
            )}
          </div>
          <div>
            <OnOff state="offline" countPeople={offlinePeople.length} />
            {offlinePeople.map(({ _id, username }) => (
              <Contact
                key={_id}
                userId={_id}
                username={username}
                onClick={setUserSelected}
                isOnline={false}
                selected={userSelected === _id}
              />
            ))}
          </div>
        </div>
        <div className="flex pl-2 gap-2 pb-4 items-center">
          <span className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </span>

          <LogoutB setWs={wsConecction} />
        </div>
      </aside>
      <section className="w-full bg-slate-400 flex flex-col">
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
