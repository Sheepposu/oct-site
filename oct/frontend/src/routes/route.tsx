import { RouteManager, RouteObject } from "./routing";
import TournamentsRouteManager from "./tournament/route";
import AchievementsRouteManager from "./achievements/route";
import Index from "./index";
import Login from "./login";
import Logout from "./logout";
import Dashboard from "./dashboard";


export default class AppRouteManager extends RouteManager {
    get_routes(): RouteObject[] {
        return [
            {
                path: "",
                element: <Index />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/logout",
                element: <Logout />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            }
        ].concat(
            (new TournamentsRouteManager()).get_routes_under("/tournaments"),
            (new AchievementsRouteManager()).get_routes_under("/achievements")
        );
    }
}