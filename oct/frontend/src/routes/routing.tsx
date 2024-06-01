export interface RouteObject {
    path: string;
    element: JSX.Element;
}

export abstract class RouteManager {
    abstract get_routes(): RouteObject[];

    get_routes_under(path: string): RouteObject[] {
        const routes = this.get_routes();
        for (const route of routes) {
            route.path = path + route.path;
        }
        return routes;
    }
}