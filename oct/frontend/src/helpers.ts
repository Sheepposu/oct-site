export async function getSession() {
  try {
    const res = await fetch("/api/session", {
      credentials: "same-origin",
    });
    const data = await res.json();
    console.log(data);
    if (data.isAuthenticated) {
      console.log("hi");
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}
