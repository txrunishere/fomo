import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser, logoutUser } from "../supabase/api";
import type { REGISTER_USER_PROPS, LOGIN_USER_PROPS } from "@/types";

const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data: REGISTER_USER_PROPS) => registerUser(data),
  });
};

const useLoginUser = () => {
  return useMutation({
    mutationFn: (data: LOGIN_USER_PROPS) => loginUser(data),
  });
};

const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

export { useLoginUser, useLogoutUser, useRegisterUser };
