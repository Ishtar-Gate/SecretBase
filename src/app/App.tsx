import Suspense from "@ishtar/core/Suspense";
import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import { AppProvider } from "./state/AppProvider";

// pages
const Home = lazy(() => import("./pages/home"));
const NotFount = lazy(() => import("./pages/404"));

const routes = [
  {
    path: "/",
    element: (
      <Suspense>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense>
        <NotFount />
      </Suspense>
    ),
  },
];

const App = () => {
  const elements = useRoutes(routes);

  return <AppProvider>{elements}</AppProvider>;
};

export default App;
