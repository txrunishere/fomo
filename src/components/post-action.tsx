import { Bookmark, Heart } from "lucide-react";
import { Button } from "./ui/button";
import type { IPOST } from "@/types";
import { useLikePost, useUnlikePost } from "@/lib/react-query/mutations";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const PostAction = ({ post }: { post: IPOST }) => {
  const { mutateAsync: likePost, isPending: isLiking } = useLikePost();
  const { mutateAsync: unlikePost, isPending: isUnliking } = useUnlikePost();
  const { session: user } = useAuth();

  const userId = user?.user?.user_metadata?.userId;

  const getInitialIsLiked = () => {
    if (!userId) return false;
    return post.likes.some((like) => like.user_id === userId);
  };

  const [isLiked, setIsLiked] = useState<boolean>(getInitialIsLiked);
  const [likeCount, setLikeCount] = useState<number>(post.likes.length);

  useEffect(() => {
    setIsLiked(getInitialIsLiked());
    setLikeCount(post.likes.length);
  }, [post.id, post.likes.length, userId]);

  const isPending = isLiking || isUnliking;

  const handleLikePost = async () => {
    if (!userId) {
      toast.error("Please login to like posts");
      return;
    }

    if (isPending) return;

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    try {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));

        const res = await unlikePost({
          postId: post.id,
          userId,
        });

        if (!res.success) {
          setIsLiked(previousIsLiked);
          setLikeCount(previousLikeCount);
          toast.error(res.message || "Failed to unlike post");
        }
      } else {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);

        const res = await likePost({
          postId: post.id,
          userId,
        });

        if (!res.success) {
          setIsLiked(previousIsLiked);
          setLikeCount(previousLikeCount);
          toast.error(res.message || "Failed to like post");
        }
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);

      console.error("Error toggling like:", error);
      toast.error("An error occurred. Please try again");
    }
  };

  return (
    <div className="flex justify-between">
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
      <Button variant="ghost" size="icon-lg" aria-label="Bookmark post">
        <Bookmark size={18} />
      </Button>
    </div>
  );
};
