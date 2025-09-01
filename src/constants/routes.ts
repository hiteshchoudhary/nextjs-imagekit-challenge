import type {Route} from "next";

const ROUTES = {
  HOME: "/" as Route,
  STUDIO: (id: string) => `/studio/${id}` as Route,
  PROFILE: "/profile" as Route,
};

export default ROUTES;
