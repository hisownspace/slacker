import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Client from "../components/Client";
import Channel from "../components/Channel";
import MemoizedChannels from "../components/Channels";
import Layout from "./Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LoginFormPage />,
      },
      {
        path: "/client",
        element: <Client />,
        children: [
          {
            path: "/client/channels/:channelId",
            element: <Channel />,
          },
          {
            element: <MemoizedChannels />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginFormPage />,
      },
      {
        path: "/signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
