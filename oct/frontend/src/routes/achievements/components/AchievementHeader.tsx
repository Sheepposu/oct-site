import { Link, Outlet } from "react-router-dom";

import "src/assets/css/achievements/header.css";

export default function AchievementHeader() {
  return (
    <>
      <div className="achievement-header">
        <Link to="teams">
          <p>e</p>
        </Link>
      </div>
      <Outlet />
    </>
  );
}
