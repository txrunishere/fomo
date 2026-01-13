import { Sun, Moon, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-proivder";
import { useLogoutUser } from "@/lib/react-query/mutations";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { session } = useAuth();
  const userData = session?.user.user_metadata;

  const { mutateAsync: logoutUser, isPending } = useLogoutUser();

  const handleLogout = async () => {
    const res = await logoutUser();
    if (!res?.success) {
      toast.error(res?.message);
    }
  };

  return (
    <header className="border-border bg-background/40 sticky top-0 z-50 flex min-h-16 items-center justify-between border-b px-6 backdrop-blur-xl md:hidden">
      <div
        onClick={() => navigate("/")}
        className="flex cursor-pointer items-center gap-3"
      >
        <div className="size-9 rounded-full bg-black dark:bg-white" />
        <span className="pixel text-2xl font-semibold tracking-wide">FOMO</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Avatar onClick={() => navigate("/profile")} className="cursor-pointer">
          <AvatarImage src={userData?.imageUrl} />
          <AvatarFallback>
            {userData?.fullName?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          onClick={handleLogout}
          className="text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
