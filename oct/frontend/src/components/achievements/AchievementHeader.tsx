import { Link, Outlet } from "react-router-dom";
import UpArrow from "../UpArrow";
import DownArrow from "../DownArrow";

import "src/assets/css/sub-header.css";
import "src/assets/css/main.css";
import { useState } from "react";

export default function AchievementHeader() {
  const [useUpArrow, setUseUpArrow] = useState(false);

  const arrow = (useUpArrow ? UpArrow : DownArrow)("mobile-sub-header-arrow");

  function onClick() {
    setUseUpArrow(!useUpArrow);
  }

  return (
    <>
      <div className="sub-header">
        <Link to="">
          <div className="sub-header-link">
            <p className="sub-header-text">Info</p>
          </div>
        </Link>
        <Link to="team">
          <div className="sub-header-link">
            <p className="sub-header-text">Team</p>
          </div>
        </Link>
        <Link to="completion">
          <div className="sub-header-link">
            <p className="sub-header-text">Achievements</p>
          </div>
        </Link>
      </div>

      {/* Mobile header */}
      <div className="mobile-sub-header-container prevent-select">
        <div className="mobile-sub-header" onClick={onClick}>
          <p className="sub-header-text">Achievement Info</p>
          { arrow }
        </div>
        <div className="header-dropdown mobile-sub-header-dropdown" style={{display: useUpArrow ? "flex" : "none"}}>
          <Link to="">
            <div className="mobile-header-dropdown-item" onClick={onClick}>
              <p className="mobile-header-dropdown-text">Info</p>
            </div>
          </Link>
          <Link to="team">
            <div className="mobile-header-dropdown-item" onClick={onClick}>
              <p className="mobile-header-dropdown-text">Team</p>
            </div>
          </Link>
          <Link to="completion">
            <div className="mobile-header-dropdown-item" onClick={onClick}>
              <p className="mobile-header-dropdown-text">Achievements</p>
            </div>
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}
