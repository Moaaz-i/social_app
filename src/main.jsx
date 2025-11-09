import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App";
import AuthProvider from "./contexts/AuthContext";
import LoadingProvider from "./contexts/LoadingContext";
import LoadingWrapper from "./components/LoadingWrapper/LoadingWrapper";
import { queryClient } from "./lib/queryClient";

const root = createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
      <AuthProvider>
        <LoadingWrapper>
          <App />
        </LoadingWrapper>
      </AuthProvider>
    </LoadingProvider>
  </QueryClientProvider>
);
