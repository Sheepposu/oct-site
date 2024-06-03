import { Link, Outlet } from "react-router-dom";

import "src/assets/css/sub-header.css";

export default function AchievementHeader() {
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
        <div className="mobile-sub-header">
          <p className="sub-header-text">Achievement Info</p>
          <svg id="mobile-header-arrow-down" viewBox="0 0 1 1" className="mobile-sub-header-arrow">
            <polyline points="0.1,0.3 0.5,0.7 0.9,0.3 " fill="none" stroke="black" strokeWidth={0.1} />
          </svg>
          <svg id="mobile-header-arrow-up" viewBox="0 0 1 1" className="mobile-sub-header-arrow" display={"none"}>
              <polyline points="0.1,0.7 0.5,0.3 0.9,0.7 " fill="none" stroke="black" strokeWidth={0.1} />
          </svg>
        </div>
        <div className="header-dropdown">
          <Link to="">
            <div className="mobile-header-dropdown-item">
              <p className="mobile-header-dropdown-text">Info</p>
            </div>
          </Link>
          <Link to="team">
            <div className="mobile-header-dropdown-item">
              <p className="mobile-header-dropdown-text">Team</p>
            </div>
          </Link>
          <Link to="completion">
            <div className="mobile-header-dropdown-item">
              <p className="mobile-header-dropdown-text">Achievements</p>
            </div>
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}
