import { Loader } from "@/components/loader";
import { Sidebar } from "@/components/sidebar";
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
      <div className="flex h-auto flex-1">
        <Outlet />
      </div>
    </main>
  );
};
