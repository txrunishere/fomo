import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { findUsername } from "../supabase/api";

const useFindUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FIND_USERNAME, username],
    queryFn: () => findUsername(username),
    enabled: !!username && username.length >= 3,
  });
};

export { useFindUsername };
