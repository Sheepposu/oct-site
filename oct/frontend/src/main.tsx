import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import UserSessionProvider from "./UserSessionProvider.tsx";

import App from "./App.tsx";
import Header from "./components/Header.tsx";
import Login from "./routes/login/page.tsx";
import Logout from "./routes/logout/page.tsx";
import Dashboard from "./routes/dashboard/page.tsx";
import Mappool from "./routes/Mappool/page.tsx";
import Bracket from "./routes/bracket/page.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserSessionProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mappool" element={<Mappool />} />
          <Route path="/bracket" element={<Bracket />} />
        </Routes>
      </BrowserRouter>
    </UserSessionProvider>
  </React.StrictMode>
);
