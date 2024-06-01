import { RouteManager, RouteObject } from "src/routes/routing";
import Bracket from "./bracket";
import TournamentInfo from ".";
import Mappool from "./mappool";

export default class TournamentRouteManager extends RouteManager {
    getRoutes(): RouteObject[] {
        return [
            {
                path: "",
                element: <TournamentInfo />
            },
            {
                path: "/bracket",
                element: <Bracket />
            },
            {
                path: "/mappool",
                element: <Mappool />
            }
        ];
    }
}