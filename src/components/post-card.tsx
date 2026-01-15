import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IPOST } from "@/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router";
import { Bookmark, Heart } from "lucide-react";
import { Button } from "./ui/button";

dayjs.extend(relativeTime);

export const PostCard = ({ post }: { post: IPOST }) => {
  return (
    <Card className="border-border bg-background/40 mx-auto w-full max-w-xl overflow-hidden rounded-xl backdrop-blur-xl">
      <CardHeader className="flex items-center gap-3">
        <Link to={"/profile"}>
          <Avatar>
            <AvatarImage src={post.users.imageUrl} />
            <AvatarFallback>
              {post.users.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{post.users.username}</span>
          {post.location && (
            <span className="text-muted-foreground text-xs">
              {post.location}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <p>{post.caption}</p>
            {post.tags.length > 0 && (
              <ul className="flex gap-2">
                {post.tags.map((tag) => (
                  <li className="text-muted-foreground text-sm" key={tag}>
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <img
              src={post.postImageUrl}
              alt="post"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </CardContent>

      <CardContent className="space-y-2">
        {/*LIKE AND SAVE BUTTONS - PENDING*/}
        <div className="flex justify-between">
          <Button variant={"ghost"} size={"icon-lg"}>
            <Heart size={18} />
          </Button>
          <Button variant={"ghost"} size={"icon-lg"}>
            <Bookmark size={18} />
          </Button>
        </div>

        <span className="text-muted-foreground text-xs">
          {dayjs(post.created_at).fromNow()}
        </span>
      </CardContent>
    </Card>
  );
};
