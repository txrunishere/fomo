import { registerSchema } from "@/lib/validation";
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
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export const Register = () => {
  const [isPassword, setIsPassword] = useState<boolean>(true);

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
            onSubmit={form.handleSubmit((data) => console.log(data))}
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
                    <Input type="text" placeholder="sukha.here" {...field} />
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
