import { RouteManager, RouteObject } from "../routing";
import Page from ".";
import TeamPage from "./team";


export default class AchievementsRouteManager extends RouteManager {
    public get_routes(): RouteObject[] {
        return [
            {
                path: "",
                element: <Page/>
            },
            {
                path: "/team",
                element: <TeamPage />
            }
        ]
    } 
}
