import { loginSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
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

export const Login = () => {
  const [isPassword, setIsPassword] = useState<boolean>(true);

  const handleIsPasswordChange = () => setIsPassword((prev) => !prev);

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

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
            onSubmit={form.handleSubmit((data) => console.log(data))}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="sukha@example.com" {...field} />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
