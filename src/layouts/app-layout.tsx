import { Loader } from "@/components/loader";
import { Sidebar } from "@/components/sidebar";
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
    <main className="h-screen w-full md:flex">
      <Sidebar />
      <div className="relative flex h-auto flex-1">
        <Outlet />
        <div className="absolute inset-0 flex items-center justify-center font-bold opacity-1 md:text-[100px] lg:text-[200px] xl:text-[300px] 2xl:text-[400px]">
          FOMO
        </div>
        <LightRays />
      </div>
    </main>
  );
};
