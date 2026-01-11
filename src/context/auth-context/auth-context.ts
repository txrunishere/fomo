import type { Session } from "@supabase/supabase-js";
import { createContext } from "react";

const INITIAL_VALUES: { session: Session | null | undefined } = {
  session: undefined,
};

export const AuthContext = createContext(INITIAL_VALUES);
