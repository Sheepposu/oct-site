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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "60px",
              textAlign: "center",
            }}
          >
            OFFLINE CHAT TOURNAMENT
          </p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "30px",
            }}
          >
            Click OCAH on the header to do stuff I guess...
          </p>
          <div onClick={logoutRedirect}>Click to logout</div>
        </div>
      </SessionContext.Provider>
    </AnimatedPage>
  );
}
