import AnimatedPage from "src/AnimatedPage";

export default function App() {
  function loginRedirect() {
    window.location.replace(
      "https://osu.ppy.sh/oauth/authorize/?client_id=22803&redirect_uri=http://localhost:8000/login&response_type=code&scope=public%20identify&state=/"
    );
  }

  function logoutRedirect() {
    window.location.replace("/logout");
  }

  return (
    <AnimatedPage>
      <div>
        <div>lmao</div>
        <div onClick={loginRedirect}>Login</div>
        <div onClick={logoutRedirect}>
          literally just so typescript doesn't yell for now
        </div>
      </div>
    </AnimatedPage>
  );
}
