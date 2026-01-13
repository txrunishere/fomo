import { registerSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { Eye, EyeClosed, CheckCircle2, XCircle } from "lucide-react";
import { useRegisterUser } from "@/lib/react-query/mutations";
import { toast } from "sonner";
import type { AuthError } from "@supabase/supabase-js";
import { useFindUsername } from "@/lib/react-query/queries";

export const Register = () => {
  const navigation = useNavigate();
  const [isPassword, setIsPassword] = useState<boolean>(true);
  const [debouncedUsername, setDebouncedUsername] = useState<string>("");
  const handleIsPasswordChange = () => setIsPassword((prev) => !prev);

  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      username: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const username = useWatch({
    control: form.control,
    name: "username",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => clearTimeout(timeout);
  }, [username]);

  const { mutateAsync: registerUser, isPending: userRegisterPending } =
    useRegisterUser();

  const { data: usernameData, isLoading: usernameLoading } =
    useFindUsername(debouncedUsername);

  const handleUserRegister = async (data: z.infer<typeof registerSchema>) => {
    try {
      if (!usernameLoading && usernameData?.exists) {
        toast.error("Username already exists");
        return;
      }

      const res = await registerUser(data);

      if (res.success) {
        toast.success(res.message);
        navigation("/");
        return;
      }
      toast.error(res.message);
      return;
    } catch (error) {
      const e = error as AuthError;
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl">Welcome</h2>
          <p>
            <span className="text-muted-foreground">
              Already have an account?
            </span>{" "}
            <Link to={"/login"}>Sign in</Link>
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUserRegister)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Sukha Singh" {...field} />
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
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        placeholder="sukha.here"
                        {...field}
                      />
                      <InputGroupAddon align={"inline-end"}>
                        {usernameLoading ? null : username &&
                          username.length >= 3 ? (
                          usernameData?.exists ? (
                            <XCircle />
                          ) : (
                            <CheckCircle2 />
                          )
                        ) : null}
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button disabled={userRegisterPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
