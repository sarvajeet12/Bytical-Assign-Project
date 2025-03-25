import { createRoot } from "react-dom/client";
import "./index.css";

// router
import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";

// toast notify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context api
import ContextProvider from "./context/common-store.jsx";

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-center"
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClickrtl={true}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="colored"
      bodyClassName="toastBody"
    />
  </ContextProvider>
);
