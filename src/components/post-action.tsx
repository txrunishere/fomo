import { Bookmark, Heart } from "lucide-react";
import { Button } from "./ui/button";
import type { IPOST } from "@/types";

export const PostAction = ({ post }: { post: IPOST }) => {
  return (
    <div className="flex justify-between">
      <Button variant={"ghost"} size={"icon-lg"}>
        <Heart size={18} />
      </Button>
      <Button variant={"ghost"} size={"icon-lg"}>
        <Bookmark size={18} />
      </Button>
    </div>
  );
};
