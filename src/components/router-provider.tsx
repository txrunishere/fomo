import { Routes, Route } from "react-router";
import { ROUTES } from "@/lib/constants";
import {
  Create,
  Home,
  Login,
  Messages,
  Profile,
  Register,
  Search,
} from "@/pages";
import { AppLayout, AuthLayout } from "@/layouts";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.SEARCH} element={<Search />} />
        <Route path={ROUTES.CREATE} element={<Create />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.MESSAGES} element={<Messages />} />
      </Route>
    </Routes>
  );
};
