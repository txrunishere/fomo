import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  logoutUser,
  createPost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  updateUserProfile,
} from "../supabase/api";
import type {
  REGISTER_USER_PROPS,
  LOGIN_USER_PROPS,
  CREATE_POST_PROPS,
  LIKE_POST_PROPS,
  SAVE_POST_PROPS,
  UPDATE_PROFILE_PROPS,
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

const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SAVE_POST_PROPS) => savePost(data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS, vars.postId],
      });
    },
    onError: (error) => {
      console.error("Save post error: ", error);
    },
  });
};

const useUnsavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SAVE_POST_PROPS) => unsavePost(data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS, vars.postId],
      });
    },
    onError: (error) => {
      console.error("Unsave post error: ", error);
    },
  });
};

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UPDATE_PROFILE_PROPS) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER],
      });
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
  useSavePost,
  useUnsavePost,
  useUpdateUserProfile,
};
