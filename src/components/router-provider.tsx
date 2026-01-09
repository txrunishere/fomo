import { Routes, Route } from "react-router";
import { ROUTES } from "@/lib/constants";
import { Create, Home, Login, Profile, Register, Search } from "@/pages";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.SEARCH} element={<Search />} />
      <Route path={ROUTES.CREATE} element={<Create />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
    </Routes>
  );
};
