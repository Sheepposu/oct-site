import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserSessionProvider from "./UserSessionProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import Header from "./components/Header.tsx";

import AppRouteManager from "./routes/route.tsx";


const router = createBrowserRouter([
  {
    element: <Header />,
    shouldRevalidate: () => false,
    children: (new AppRouteManager()).getRoutes()
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserSessionProvider>
        <RouterProvider router={router} />
      </UserSessionProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
