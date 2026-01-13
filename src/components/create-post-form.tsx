import { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postSchema } from "@/lib/validation";
import { z } from "zod";
import { useCreatePost } from "@/lib/react-query/mutations";
import { toast } from "sonner";
import type { PostgrestError } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";

export function CreatePostForm() {
  const [openPreview, setOpenPreview] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: "",
      tags: "",
      location: "",
      postImage: undefined,
    },
  });

  const imageFile = useWatch({
    control: form.control,
    name: "postImage",
  });

  const previewUrl = useMemo(() => {
    if (!openPreview || !imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile, openPreview]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { mutateAsync: createPost, isPending: createPostLoading } =
    useCreatePost();

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    const tags = data.tags?.split(",").map((t) => t.trim()) ?? [];

    try {
      const res = await createPost({
        caption: data.caption,
        location: data.location || null,
        image: data.postImage,
        tags,
        userId: session?.user.user_metadata.userId,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      navigate("/");
    } catch (e) {
      toast.error((e as PostgrestError).message);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6">
      <Card className="mx-auto w-full max-w-lg p-4 sm:p-6">
        <div className="mb-2 space-y-1 text-center sm:text-left">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Create a Post
          </h1>
          <p className="text-muted-foreground text-sm">
            Share something with your audience
          </p>
        </div>

        <Form {...form}>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write something..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="friends, joy, vibe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Delhi, India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Image</FormLabel>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <FormControl className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="secondary"
                      disabled={!imageFile}
                      onClick={() => setOpenPreview(true)}
                    >
                      Preview
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={createPostLoading}
              onClick={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              Create Post
            </Button>
          </div>
        </Form>
      </Card>

      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          {previewUrl && (
            <div className="overflow-hidden rounded-lg border">
              <img
                src={previewUrl}
                alt="Post preview"
                className="h-auto w-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
