import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { findUsername, getPosts, getUser } from "../supabase/api";

const useFindUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FIND_USERNAME, username],
    queryFn: () => findUsername(username),
    enabled: !!username && username.length >= 3,
  });
};

const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: getPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor,
  });
};

const useGetUser = (userId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

export { useFindUsername, useGetPosts, useGetUser };
