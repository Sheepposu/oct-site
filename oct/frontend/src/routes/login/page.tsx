import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Login() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  function isResponseOk(response: Response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.text().then((text) => {
        return JSON.parse(text);
      });
    } else {
      throw Error(response.statusText);
    }
  }

  useEffect(() => {
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({ code: queryParams.get("code") }),
    })
      .then((resp) => isResponseOk(resp))
      .then(() => {
        window.location.replace("/");
      });
  });
  return <div>Logging in....</div>;
}
