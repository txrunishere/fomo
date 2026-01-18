import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { editProfileSchema } from "@/lib/validation";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { PostgrestError } from "@supabase/supabase-js";
import { useUpdateUserProfile } from "@/lib/react-query/mutations";
import { useAuth } from "@/hooks/useAuth";

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export function EditProfileForm({
  defaultValues,
  onSuccess,
}: {
  defaultValues?: Partial<EditProfileFormValues> & {
    imageUrl?: string;
  };
  onSuccess: () => void;
}) {
  const [preview, setPreview] = useState<string | undefined>(
    defaultValues?.imageUrl,
  );

  const { session } = useAuth();
  const userId = session?.user.user_metadata.userId;

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      username: defaultValues?.username ?? "",
      bio: defaultValues?.bio ?? "",
    },
  });

  const { mutateAsync: updateUserProfile, isPending } = useUpdateUserProfile();

  const onSubmit = async (values: EditProfileFormValues) => {
    try {
      const res = await updateUserProfile({ userId, ...values });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error(`an error occurred ${(error as PostgrestError).message}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border-border bg-background/40 mx-auto max-w-xl space-y-6 rounded-2xl border p-6 backdrop-blur-xl"
      >
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>

              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={preview} />
                  <AvatarFallback>PF</AvatarFallback>
                </Avatar>

                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);

                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell something about yourself..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
