import { loginSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useLoginUser } from "@/lib/react-query/mutations";
import { toast } from "sonner";
import type { AuthApiError } from "@supabase/supabase-js";

export const Login = () => {
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const handleIsPasswordChange = () => setIsPassword((prev) => !prev);
  const navigation = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync: loginUser, isPending: userLoginPending } =
    useLoginUser();

  const handleUserLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginUser(data);

      if (res.success) {
        navigation("/");
        form.reset();
        toast.success(res.message);
        return;
      }
      toast.error(res.message);
      return;
    } catch (error) {
      const e = error as AuthApiError;
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl">Welcome Back</h2>
          <p>
            <span className="text-muted-foreground">
              Don't have an account yet?
            </span>{" "}
            <Link to={"/register"}>Sign up</Link>
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUserLogin)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="sukha@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        type={isPassword ? "password" : "text"}
                        placeholder="········"
                        {...field}
                      />
                      <InputGroupAddon
                        className="cursor-pointer"
                        align={"inline-end"}
                        onClick={handleIsPasswordChange}
                      >
                        {isPassword ? <EyeClosed /> : <Eye />}
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={userLoginPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
