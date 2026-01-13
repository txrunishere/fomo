import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  logoutUser,
  createPost,
} from "../supabase/api";
import type {
  REGISTER_USER_PROPS,
  LOGIN_USER_PROPS,
  CREATE_POST_PROPS,
} from "@/types";

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

const useCreatePost = () => {
  return useMutation({
    mutationFn: (data: CREATE_POST_PROPS) => createPost(data),
  });
};

export { useLoginUser, useLogoutUser, useRegisterUser, useCreatePost };
