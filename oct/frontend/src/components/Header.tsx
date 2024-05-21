import { useContext } from "react";
import { UserSessionContext } from "../UserSessionProvider";
import { Link, Outlet } from "react-router-dom";

import osuLogo from "src/assets/images/osu.png";

export default function Header() {
  const { session, loading } = useContext(UserSessionContext);
  return (
    <>
      <div className="h-24 w-full z-10 bg-[#438efd] relative flex items-center pl-2 pr-5 no-underline text-center">
        <Link
          to="/"
          className="w-40 h-24 flex justify-center items-center text-white"
        >
          <div className="w-40 h-24 flex justify-center items-center text-white">
            <p className="text-center font-extrabold italic text-6xl">OCT</p>
          </div>
        </Link>
        <Link
          to="/mappools"
          className="w-40 h-24 flex justify-center items-center text-white"
        >
          <div className="w-40 h-24 flex justify-center items-center text-white">
            <p className="text-3xl italic text-inherit">Mappools</p>
          </div>
        </Link>
        <Link
          to="/bracket"
          className="w-40 h-24 flex justify-center items-center text-white"
        >
          <div className="w-40 h-24 flex justify-center items-center text-white">
            <p className="text-3xl italic text-inherit">Bracket</p>
          </div>
        </Link>
        <div className="flex-1"></div>
        <div>
          {loading ? (
            <div className="w-40 h-12 flex items-center justify-center text-white rounded-full bg-[#9f9f9f] shadow-xl select-none hover:cursor-not-allowed">
              <p className="pr-1 text-center whitespace-nowrap w-[calc(100%-5px)] text-black flex items-center justify-center italic">
                Loading...
              </p>
            </div>
          ) : session?.isAuthenticated ? (
            <Link to="/dashboard" className="select-none">
              <div className="w-40 h-12 flex itemds-center text-white rounded-full bg-[#e7e7e7] shadow-xl">
                <img
                  src={session.user?.osu_avatar}
                  alt="avatar"
                  className="h-full rounded-full"
                />
                <p className="pr-1 text-center whitespace-nowrap w-[calc(100%-5px)] text-black flex items-center justify-center">
                  {session.user?.osu_username}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              to="https://osu.ppy.sh/oauth/authorize/?client_id=22803&redirect_uri=http://localhost:8000/login&response_type=code&scope=public%20identify&state=/"
              className="select-none"
            >
              <div className="w-40 h-12 flex items-center text-white rounded-full bg-[#e866a0] shadow-xl">
                <img
                  src={osuLogo}
                  alt="osu logo"
                  className="h-full rounded-full"
                />
                <p className="pr-1 text-center whitespace-nowrap w-[calc(100%-5px)]">
                  Log In
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
