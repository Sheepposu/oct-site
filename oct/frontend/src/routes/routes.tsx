import { type RouteObject } from "react-router-dom";
import Header from "src/components/Header";
import Index from "./index";
import Login from "./login";
import Logout from "./logout";
import Dashboard from "./dashboard";
import Tournaments from "./tournament";
import TournamentInfo from "./tournament/tournament";
import Bracket from "./tournament/tournament/bracket";
import Mappool from "./tournament/tournament/mappool";
import AchievementHeader from "./achievements/components/AchievementHeader";
import AchievementsInfoPage from "./achievements";
import TeamsPage from "./achievements/teams";

export const routes: RouteObject[] = [
  {
    element: <Header />,
    shouldRevalidate: () => false,
    children: [
      {
        path: "",
        element: <Index />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/tournaments",
        element: <Tournaments />,
        children: [
          {
            path: "/bracket",
            element: <Bracket />
          },
          {
            path: "/mappool",
            element: <Mappool />
          },
          {
            path: "/:tournament",
            element: <TournamentInfo />,
            children: [
              path: "/mappool",
              element: <></>
            ]
          }
        ]
      },
      {
        path: "/achievements",
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
        ],
      },
    ],
  },
];
