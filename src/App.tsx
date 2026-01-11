import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "./components/router-provider";
import { Toaster } from "./components/ui/sonner";
import { AuthContextProvider } from "./context/auth-context/auth-context-provider";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <RouterProvider />
        </AuthContextProvider>
        <Toaster richColors position="top-center" closeButton theme="system" />
      </QueryClientProvider>
    </>
  );
}
