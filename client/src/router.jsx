import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import Login from "./pages/login.jsx";
import SignUp from "./pages/signup.jsx";
import Error from "./pages/error.jsx";

import ChatArea from "./pages/chat-area.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/chat-area", element: <ChatArea /> },
      { path: "*", element: <Error /> },
    ],
  },
]);
