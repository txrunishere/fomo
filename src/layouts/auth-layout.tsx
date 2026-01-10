import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <main className="mt-20 flex w-full items-center justify-center px-4 md:mt-0 md:h-screen">
      <Outlet />
    </main>
  );
};
