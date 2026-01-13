import { BottomBar } from "@/components/bottombar";
import { Loader } from "@/components/loader";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { LightRays } from "@/components/ui/light-rays";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export const AppLayout = () => {
  const { session } = useAuth();

  if (session === undefined) {
    return (
      <div className="mt-40 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={"/login"} />;
  }

  return (
    <main className="flex h-screen w-full flex-col md:flex-row">
      <Sidebar />
      <Topbar />
      <div className="relative flex h-auto flex-1">
        <Outlet />
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center font-bold opacity-1 md:flex md:text-[100px] lg:text-[200px] xl:text-[300px] 2xl:text-[400px]">
          FOMO
        </div>
        <LightRays />
      </div>
      <BottomBar />
    </main>
  );
};
