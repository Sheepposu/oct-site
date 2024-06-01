import { RouteManager, RouteObject } from "../routing";
import TournamentRouteManager from "./tournament/route";
import Tournaments from ".";


export default class TournamentsRouteManager extends RouteManager {
    get_routes(): RouteObject[] {
        return [
            {
                path: "",
                element: <Tournaments />
            }
        ].concat(
            (new TournamentRouteManager()).get_routes_under("/:tournament")
        );
    }
}