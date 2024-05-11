import React, { createContext, useEffect, useState } from "react";
import { getSession } from "./helpers";
import { Session } from "./types/SessionType";

type UserSessionContextProps = {
  session: Session | null;
  loading: boolean;
};

export const UserSessionContext = createContext<UserSessionContextProps>({
  session: null,
  loading: true,
});

export default function UserSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSession();
  }, []);

  async function fetchSession() {
    const session: Session = (await getSession()) as Session;
    setSession(session);
    setLoading(false);
  }
  return (
    <UserSessionContext.Provider value={{ session, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
}
