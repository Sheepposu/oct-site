import { type RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "src/components/Header";
import Index from "./index";
import Login from "./login";
import Logout from "./logout";
import Dashboard from "./dashboard";
import Tournaments from "./tournaments";
import TournamentInfo from "./tournaments/tournament";
import Bracket from "./tournaments/tournament/bracket";
import Mappool from "./tournaments/tournament/mappool";
import AchievementHeader from "../components/achievements/AchievementHeader";
import AchievementsInfoPage from "./achievements";
import TeamsPage from "./achievements/teams";
import AchievementCompletionPage from "./achievements/completion";

export const routes: RouteObject[] = [
  {
    element: <Header />,
    shouldRevalidate: () => false,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "tournaments",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Tournaments />,
          },
          {
            path: "bracket",
            element: <Bracket />,
          },
          {
            path: "mappool",
            element: <Mappool />,
          },
          {
            path: ":tournament",
            element: <Outlet />, // TournamentsHeader
            children: [
              {
                index: true,
                element: <TournamentInfo />,
              },
              {
                path: "mappool",
                element: <></>,
              },
              {
                path: "bracket",
                element: <></>,
              },
            ],
          },
        ],
      },
      {
        path: "achievements",
        element: <AchievementHeader />,
        children: [
          {
            index: true,
            element: <AchievementsInfoPage />,
          },
          {
            path: "teams",
            element: <TeamsPage />,
          },
          {
            path: "completion",
            element: <AchievementCompletionPage />
          }
        ],
      },
    ],
  },
];
