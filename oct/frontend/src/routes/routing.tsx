export interface RouteObject {
    path: string;
    element: JSX.Element;
}

export abstract class RouteManager {
    abstract getRoutes(): RouteObject[];

    getRoutesUnder(path: string): RouteObject[] {
        const routes = this.getRoutes();
        for (const route of routes) {
            route.path = path + route.path;
        }
        return routes;
    }
}