import { Link, Outlet } from "react-router-dom";

import osuLogo from "src/assets/images/osu.png";
import "src/assets/css/main.css";
import { getSession } from "src/util/auth";

export default function Header() {
  const session = getSession();
  return (
    <>
      <div className="header prevent-select">
        <Link to="/" className="header-link">
          <div className="header-link-container">
            <p className="header-title">OCT</p>
          </div>
        </Link>
        <Link to="/tournaments" className="header-link">
          <div className="header-link-container">
            <p className="header-text">Tournaments</p>
          </div>
        </Link>
        <Link to="/tournaments/mappool" className="header-link">
          <div className="header-link-container">
            <p className="header-text">Mappools</p>
          </div>
        </Link>
        <Link to="/tournaments/bracket" className="header-link">
          <div className="header-link-container">
            <p className="header-text">Bracket</p>
          </div>
        </Link>
        <Link to="/achievements" className="header-link">
          <div className="header-link-container">
            <p className="header-text">Achievements</p>
          </div>
        </Link>
        <div style={{ flex: 1 }}></div>
        <div>
          {session?.isAuthenticated ? (
            <Link to="/dashboard">
              <div className="login-box user-box">
                <img
                  src={session.user?.osu_avatar}
                  alt="avatar"
                  className="login-pic"
                />
                <p className="login-text">{session.user?.osu_username}</p>
              </div>
            </Link>
          ) : (
            <Link to="https://osu.ppy.sh/oauth/authorize/?client_id=22803&redirect_uri=http://localhost:8000/login&response_type=code&scope=public%20identify&state=/">
              <div className="login-box shadow">
                <img src={osuLogo} alt="osu logo" className="login-pic" />
                <p className="login-text">Log In</p>
              </div>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
