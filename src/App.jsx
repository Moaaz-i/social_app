import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import ProtectAuth from "./components/Protect/Protect.Auth";
import ProtectRoute from "./components/Protect/Protect.Route";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectRoute>
              <Home />
            </ProtectRoute>
          ),
        },
        {
          path: "posts",
          element: (
            <ProtectRoute>
              <Posts />
            </ProtectRoute>
          ),
        },
        {
          path: "posts/create",
          element: (
            <ProtectRoute>
              <CreatePost />
            </ProtectRoute>
          ),
        },
        {
          path: "signup",
          element: (
            <ProtectAuth>
              <Signup />
            </ProtectAuth>
          ),
        },
        {
          path: "login",
          element: (
            <ProtectAuth>
              <Login />
            </ProtectAuth>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
