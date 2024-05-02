import { useEffect, useState } from "react";
import { getSession } from "./helpers";
import { redirect } from "react-router-dom";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const isAuthenticated = async () => {
      const data = await getSession();
      console.log(data);
      setAuthenticated(data);
    };

    isAuthenticated();
  }, []);

  function loginRedirect() {
    window.location.href =
      "https://osu.ppy.sh/oauth/authorize/?client_id=22803&redirect_uri=http://localhost:8000/login&response_type=code&scope=public%20identify&state=/";
  }

  function logoutRedirect() {
    redirect("/api/logout/");
  }

  if (authenticated) {
    return (
      <div>
        <div>Authenticated</div>
        <div onClick={logoutRedirect}>Log out</div>
      </div>
    );
  }

  return (
    <div>
      <div>testiongggggg</div>
      <div onClick={loginRedirect}>Login</div>
    </div>
  );
}
