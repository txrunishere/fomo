import type { IPOST } from "@/types";
import { LikeButton } from "./like-button";
import { SavePostButton } from "./save-post-button";

export const PostAction = ({ post }: { post: IPOST }) => {
  return (
    <div className="flex justify-between">
      <LikeButton post={post} />
      <SavePostButton post={post} />
    </div>
  );
};
