import AnimatedPage from "src/AnimatedPage";
import { SessionContext } from "src/contexts/SessionContext";
import { getSessionData } from "src/util/auth";

export default function App() {
  function logoutRedirect() {
    window.location.replace("/logout");
  }

  return (
    <AnimatedPage>
      <SessionContext.Provider value={getSessionData()}>
        <div>
          <div onClick={logoutRedirect}>
            logout thing
          </div>
        </div>
      </SessionContext.Provider>
    </AnimatedPage>
  );
}
