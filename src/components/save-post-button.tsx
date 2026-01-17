import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import type { IPOST } from "@/types";

export const SavePostButton = ({ post }: { post: IPOST }) => {
  return (
    <Button variant="ghost" size="icon-lg" aria-label="Bookmark post">
      <Bookmark size={18} />
    </Button>
  );
};
