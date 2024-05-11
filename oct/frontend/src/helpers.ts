import { Session } from "./types/SessionType";

export async function getSession() {
  try {
    const res = await fetch("http://localhost:8000/api/session/", {
      credentials: "same-origin",
    });

    const data: Session = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
