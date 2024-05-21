import { Session } from "./types/SessionType";

export async function getSession() {
  try {
    const data: Session = JSON.parse(
      document.getElementById("data")?.textContent as string
    );
    return data;
  } catch (err) {
    console.log(err);
  }
}
