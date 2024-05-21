import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserSessionProvider from "./UserSessionProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import App from "./App.tsx";
import Header from "./components/Header.tsx";
import Login from "./routes/login/page.tsx";
import Logout from "./routes/logout/page.tsx";
import Dashboard from "./routes/dashboard/page.tsx";
import Mappool from "./routes/Mappool/page.tsx";
import Bracket from "./routes/bracket/page.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Header />,
    children: [
      {
        path: "/",
        element: <App />,
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
        path: "/mappools",
        element: <Mappool />,
      },
      {
        path: "/bracket",
        element: <Bracket />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserSessionProvider>
        <RouterProvider router={router} />
      </UserSessionProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
