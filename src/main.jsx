import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DetailPage from "./pages/DetailPage.jsx";
import SeatsPage from "./pages/SeatsPage/index.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import { AuthProvider } from "./utils/AuthContext";
import VerificationPage from "./pages/VerificationPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/detail/:id", element: <DetailPage /> },
  {
    path: "/seats",
    element: <PrivateRoutes />,
    children: [{ index: true, element: <SeatsPage /> }],
  },
  { path: "/register", element: <SignUpPage /> },
  { path: "/login", element: <SignInPage /> },
  { path: "/verification", element: <VerificationPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
