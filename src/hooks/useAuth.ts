import { AuthContext } from "@/context/auth-context/auth-context";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext);
