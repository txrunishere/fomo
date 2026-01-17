import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useGetUser } from "@/lib/react-query/queries";
import { useParams } from "react-router";

export function Profile() {
  const { id } = useParams();
  const { data: user } = useGetUser(Number(id));

  return (
    <div className="flex min-h-screen gap-6 p-4 md:p-6">
      <main className="flex-1 space-y-6">
        <Card className="border-border bg-background/40 rounded-2xl backdrop-blur-xl">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.data.imageUrl} />
              <AvatarFallback>
                {user?.data.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col gap-3">
              <div>
                <h1 className="text-xl font-semibold">{user?.data.fullName}</h1>
                <p className="text-muted-foreground text-sm">
                  @{user?.data.username}
                </p>
              </div>

              <div className="flex gap-6 text-sm">
                <span>
                  <strong>{user?.data.posts.length}</strong> posts
                </span>
                <span>
                  <strong>0</strong> followers
                </span>
                <span>
                  <strong>0</strong> following
                </span>
              </div>

              <p className="text-muted-foreground max-w-xl text-sm">
                {user?.data.bio}
              </p>
            </div>

            <Button variant="secondary">Edit Profile</Button>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Posts</h2>
          <Separator />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
        </section>
      </main>
    </div>
  );
}
