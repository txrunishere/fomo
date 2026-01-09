import { Sidebar } from "@/components/sidebar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <main className="h-screen w-full md:flex">
      <Sidebar />
      <div className="flex h-auto flex-1">
        <Outlet />
      </div>
    </main>
  );
};
