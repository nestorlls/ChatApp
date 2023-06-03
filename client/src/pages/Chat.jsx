import { Logo } from '../components/Logo';
import { User } from '../components/User';

export const Chat = () => {
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
      <section className="w-3/4 bg-slate-300 ">messages</section>
    </div>
  );
};
