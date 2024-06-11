import { Link, Outlet } from "react-router-dom";

import UpArrow from "./UpArrow";
import DownArrow from "./DownArrow";
import { useContext, useReducer, useState } from "react";
import Backdrop from "./Backdrop";

import osuLogo from "src/assets/images/osu.png";

import "src/assets/css/main.css";
import { SessionContext } from "src/contexts/SessionContext";
import ErrorContainer from "./EventContainer";
import {
  EventContext,
  EventState,
  EventStateType,
} from "src/contexts/EventContext";

function errorReducer(
  events: EventState[],
  { type, msg, id }: { type: EventStateType; msg?: string, id?: number }
) {
  if (type === "expired") {
    for (const [i, event] of events.entries()) {
      if (event.id === id) {
        // TODO: add to some log where it can be accessed by the user to view past events
        return events.slice(0, i).concat(events.slice(i+1))
      }
    }
    return events;
  }

  const now = Date.now();
  if (id === undefined) {
    id = events.length === 0 ? 1 : events[events.length - 1].id + 1;
  }
  return events.concat([
    {
      id,
      type,
      msg: msg ?? "",
      createdAt: now,
      expiresAt: now + 10000,
    },
  ]);
}

export default function Header() {
  const session = useContext(SessionContext);
  const [useUpArrow, setUseUpArrow] = useState(false);
  const [errors, dispatchEventMsg] = useReducer(errorReducer, []);

  const arrow = (useUpArrow ? UpArrow : DownArrow)("mobile-header-arrow");
  const backdrop = Backdrop(useUpArrow, setUseUpArrow);

  function onClick() {
    setUseUpArrow(!useUpArrow);
  }

  return (
    <>
      <div className="header prevent-select">
        <Link to="/" className="header-link">
          <div className="header-link-container">
            <p className="header-title">OCT</p>
          </div>
        </Link>
        <Link to="/achievements" className="header-link">
          <div className="header-link-container">
            <p className="header-text">OCAH</p>
          </div>
        </Link>
        {/*<Link to="/tournaments" className="header-link">
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
        </Link>*/}
        <div style={{ flexGrow: 1 }}></div>
        <div>
          {session.isAuthenticated ? (
            /*<Link to="/dashboard">*/
              <div className="login-box user-box">
                <img
                  src={session.user?.osu_avatar}
                  alt="avatar"
                  className="login-pic"
                />
                <p className="login-text">{session.user?.osu_username}</p>
              </div>
            /*</Link>*/
          ) : (
            <Link to={session.authUrl}>
              <div className="login-box shadow">
                <img src={osuLogo} alt="osu logo" className="login-pic" />
                <p className="login-text">Log In</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile header */}
      <div className="mobile-header-container">
        <div className="mobile-header header" onClick={onClick}>
          <Link className="header-link" to="/">
            <div className="header-link-container">
              <h1 className="header-title">OCT</h1>
            </div>
          </Link>
          {arrow}
        </div>
        <div
          className="mobile-header-dropdown header-dropdown"
          style={{ display: useUpArrow ? "flex" : "none" }}
        >
          <div className="dropdown-user-container">
            {session.isAuthenticated ? (
              /*<Link to="/dashboard">*/
                <div className="login-box user-box">
                  <img
                    src={session.user?.osu_avatar}
                    alt="avatar"
                    className="login-pic"
                  />
                  <p className="login-text">{session.user?.osu_username}</p>
                </div>
              /*</Link>*/
            ) : (
              <Link to={session.authUrl}>
                <div className="login-box shadow">
                  <img src={osuLogo} alt="osu logo" className="login-pic" />
                  <p className="login-text">Log In</p>
                </div>
              </Link>
            )}
          </div>
          <Link to="/achievements">
            <div className="header-dropdown-item" onClick={onClick}>
              <p className="header-text dropdown">OCAH</p>
            </div>
          </Link>
          {/*<Link to="/tournaments">
            <div className="header-dropdown-item" onClick={onClick}>
              <p className="header-text dropdown">Tournaments</p>
            </div>
          </Link>
          <Link to="/tournaments/mappool">
            <div className="header-dropdown-item" onClick={onClick}>
              <p className="header-text dropdown">Mappool</p>
            </div>
          </Link>
          <Link to="/tournaments/bracket">
            <div className="header-dropdown-item" onClick={onClick}>
              <p className="header-text dropdown">Bracket</p>
            </div>
          </Link>*/}
        </div>
      </div>

      {backdrop}

      <EventContext.Provider value={dispatchEventMsg}>
        <ErrorContainer events={errors} />
        <Outlet />
      </EventContext.Provider>
    </>
  );
}
