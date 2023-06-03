import { useEffect, useState } from 'react';
import { FormSendMessage } from '../components/FormSendMessage';
import { Logo } from '../components/Logo';
import { User } from '../components/User';

export const Chat = () => {
  const [wsConecction, setWsConecction] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    setWsConecction(ws);
    ws.addEventListener('message', (event) => {
      const messageData = JSON.parse(event.data);
      console.log(messageData);
    });
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-slate-700">
        <div className="flex">
          <Logo />
          <User />
        </div>
        <div>
          <h2>online</h2>
        </div>
        <div>
          <h2>offline</h2>
        </div>
      </aside>
      <section className="w-3/4 bg-slate-300 flex flex-col p-2">
        <div className="flex-grow">
          <p className="text-2xl text-center text-gray-400">
            &larr;Select a person from the sidebar
          </p>
        </div>
        <FormSendMessage />
      </section>
    </div>
  );
};
