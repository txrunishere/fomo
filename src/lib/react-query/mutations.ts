import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  logoutUser,
  createPost,
  likePost,
  unlikePost,
} from "../supabase/api";
import type {
  REGISTER_USER_PROPS,
  LOGIN_USER_PROPS,
  CREATE_POST_PROPS,
  LIKE_POST_PROPS,
} from "@/types";
import { QUERY_KEYS } from "../constants";

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

const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LIKE_POST_PROPS) => likePost(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS, variables.postId],
      });
    },
    onError: (error) => {
      console.error("Like post error:", error);
    },
  });
};

const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LIKE_POST_PROPS) => unlikePost(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS, variables.postId],
      });
    },
    onError: (error) => {
      console.error("Unlike post error:", error);
    },
  });
};

export {
  useLoginUser,
  useLogoutUser,
  useRegisterUser,
  useCreatePost,
  useLikePost,
  useUnlikePost,
};
