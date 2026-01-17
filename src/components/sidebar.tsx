import {
  Home,
  MessageCircle,
  Sun,
  Moon,
  User,
  LogOut,
  Search,
  PlusCircle,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTheme } from "../hooks/use-theme";
import { useLogoutUser } from "@/lib/react-query/mutations";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { buttonVariants } from "./ui/button-variants";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Messages", icon: MessageCircle, href: "/messages" },
  { label: "Create", icon: PlusCircle, href: "/create" },
];

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { session } = useAuth();
  const userData = session?.user.user_metadata;

  const { mutateAsync: logoutUser, isPending } = useLogoutUser();

  const handleUserLogout = async () => {
    const res = await logoutUser();

    if (!res?.success) {
      toast.error(res?.message);
      return;
    }
  };

  const redirectUserToProfile = () => navigate(`/profile/${userData?.userId}`);

  return (
    <aside className="border-border bg-background/40 hidden h-screen w-72 flex-col rounded-r-2xl border p-4 backdrop-blur-xl md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="bg-muted/40 hover:bg-muted flex w-full items-center gap-3 rounded-xl p-3 text-left transition">
            <Avatar>
              <AvatarImage src={userData?.imageUrl} />
              <AvatarFallback>
                {userData?.fullName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">
                {userData?.fullName}
              </span>
              <span className="text-muted-foreground text-xs">
                {session?.user.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={redirectUserToProfile} className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className="gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={isPending}
            onClick={handleUserLogout}
            className="text-destructive focus:text-destructive gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {navItems.map(({ label, icon: Icon, href }) => (
          <NavLink
            to={href}
            key={label}
            className={({ isActive }) =>
              `group relative justify-start gap-3 ${buttonVariants({ variant: isActive ? "secondary" : "ghost" })}`
            }
          >
            <Icon className="text-muted-foreground group-hover:text-foreground h-5 w-5" />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div>
        <div className="mb-4 flex items-center gap-5">
          <div className="size-14 rounded-full bg-black"></div>
          <p className="pixel text-4xl dark:font-semibold">FOMO</p>
        </div>
        <Separator />
      </div>
    </aside>
  );
}
