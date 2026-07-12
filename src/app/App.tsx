import { RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { router } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="bottom-right" />
      </AppProvider>
    </AuthProvider>
  );
}