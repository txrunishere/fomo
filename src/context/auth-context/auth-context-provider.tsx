import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { AuthContext } from "./auth-context";
import supabase from "@/lib/supabase/config";

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then((res) => setSession(res.data.session));

    const { data } = supabase.auth.onAuthStateChange((_, session) =>
      setSession(session),
    );

    return () => data.subscription.unsubscribe();
  }, []);

  const values = {
    session,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
