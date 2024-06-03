import { Link, Outlet } from "react-router-dom";

import "src/assets/css/achievements/header.css";

export default function AchievementHeader() {
  return (
    <>
      <div className="achievement-header">
        <Link to="">
          <div className="achievement-header-link">
            <p className="achievement-header-text">Info</p>
          </div>
        </Link>
        <Link to="teams">
          <div className="achievement-header-link">
            <p className="achievement-header-text">Teams</p>
          </div>
        </Link>
      </div>
      <Outlet />
    </>
  );
}
