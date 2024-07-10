export default function Logout() {
  function isResponseOk(response: Response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.text().then((text) => {
        console.log(text);
        return JSON.parse(text);
      });
    } else {
      throw Error(response.statusText);
    }
  }
  fetch("/api/logout", {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => isResponseOk(resp))
    .then(() => {
      window.location.replace("/");
    });
  return <div>Logging out</div>;
}
