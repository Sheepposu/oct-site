import { RouteManager, RouteObject } from "../routing";
import TournamentRouteManager from "./tournament/route";
import Tournaments from ".";


export default class TournamentsRouteManager extends RouteManager {
    getRoutes(): RouteObject[] {
        return [
            {
                path: "",
                element: <Tournaments />
            }
        ].concat(
            (new TournamentRouteManager()).getRoutesUnder("/:tournament")
        );
    }
}