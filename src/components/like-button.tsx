import { useAuth } from "@/hooks/useAuth";
import { useLikePost, useUnlikePost } from "@/lib/react-query/mutations";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import type { IPOST } from "@/types";

export const LikeButton = ({ post }: { post: IPOST }) => {
  const { mutateAsync: likePost, isPending: isLiking } = useLikePost();
  const { mutateAsync: unlikePost, isPending: isUnliking } = useUnlikePost();
  const { session: user } = useAuth();

  const userId = user?.user?.user_metadata?.userId;

  const [isLiked, setIsLiked] = useState<boolean>(() => {
    if (!userId) return false;
    return post.likes.some((like) => like.user_id === userId);
  });

  const likeCount = post.likes.length;

  const isPending = isLiking || isUnliking;

  const handleLikePost = async () => {
    if (!userId) {
      toast.error("Please login to like posts");
      return;
    }

    if (isPending) return;

    const previousIsLiked = isLiked;

    try {
      if (isLiked) {
        setIsLiked(false);

        const res = await unlikePost({
          postId: post.id,
          userId,
        });

        if (!res.success) {
          setIsLiked(previousIsLiked);
          toast.error(res.message || "Failed to unlike post");
        }
      } else {
        setIsLiked(true);

        const res = await likePost({
          postId: post.id,
          userId,
        });

        if (!res.success) {
          setIsLiked(previousIsLiked);
          toast.error(res.message || "Failed to like post");
        }
      }
    } catch (error) {
      setIsLiked(previousIsLiked);

      console.error("Error toggling like:", error);
      toast.error("An error occurred. Please try again");
    }
  };

  return (
    <Button
      onClick={handleLikePost}
      variant="ghost"
      size="icon-lg"
      className="flex items-center gap-1"
      disabled={isPending}
      aria-label={isLiked ? "Unlike post" : "Like post"}
    >
      <Heart
        size={18}
        fill={isLiked ? "currentColor" : "none"}
        className={isLiked ? "text-red-500" : ""}
      />
      <span className="text-sm">{likeCount}</span>
    </Button>
  );
};
