import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import type { IPOST } from "@/types";
import { useSavePost, useUnsavePost } from "@/lib/react-query/mutations";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const SavePostButton = ({ post }: { post: IPOST }) => {
  const { mutateAsync: savePost, isPending: isSaving } = useSavePost();
  const { mutateAsync: unsavePost, isPending: isUnsaving } = useUnsavePost();
  const { session } = useAuth();
  const userId = session?.user?.user_metadata.userId;

  const getInitialIsSaved = () => {
    if (!userId) return false;
    return post.saved.some((save) => save.user_id === userId);
  };

  const [isSaved, setIsSaved] = useState<boolean>(getInitialIsSaved);
  const [saveCount, setSaveCount] = useState<number>(post.saved.length);

  useEffect(() => {
    setIsSaved(getInitialIsSaved());
    setSaveCount(post.saved.length);
  }, [post.id, post.saved.length, userId]);

  const isPending = isSaving || isUnsaving;

  const handleSavePost = async () => {
    if (!userId) {
      toast.error("Please login to save posts");
      return;
    }

    if (isPending) return;

    const previousIsSaved = isSaved;
    const previoussaveCount = saveCount;

    try {
      if (isSaved) {
        setIsSaved(false);
        setSaveCount((prev) => Math.max(0, prev - 1));

        const res = await unsavePost({
          postId: post.id,
          userId,
        });

        if (!res.success) {
          setIsSaved(previousIsSaved);
          setSaveCount(previoussaveCount);
          toast.error(res.message || "Failed to unsave post");
        }
      } else {
        setIsSaved(true);
        setSaveCount((prev) => prev + 1);

        const res = await savePost({
          postId: post.id,
          userId,
        });

        if (!res.success) {
          setIsSaved(previousIsSaved);
          setSaveCount(previoussaveCount);
          toast.error(res.message || "Failed to save post");
        }
      }
    } catch (error) {
      setIsSaved(previousIsSaved);
      setSaveCount(previoussaveCount);

      console.error("Error toggling save:", error);
      toast.error("An error occurred. Please try again");
    }
  };

  return (
    <Button
      onClick={handleSavePost}
      variant="ghost"
      size="icon-lg"
      aria-label="Bookmark post"
    >
      <Bookmark
        size={18}
        fill={isSaved ? "currentColor" : "none"}
        className={isSaved ? "text-black dark:text-white" : ""}
      />
    </Button>
  );
};
