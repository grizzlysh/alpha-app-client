import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";

import { store } from "@/store";
import { queryClient } from "@/configs/queryClient";
import { App } from "@/App";
import { hydrateQueryCache, subscribeQueryCache } from "@/utils/queryPersister";
import "./index.css";


// Start persisting successful fetches to IndexedDB immediately
subscribeQueryCache(queryClient);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Hydrate the query cache from IndexedDB before the first render so cached
// data is available instantly — even when offline.
hydrateQueryCache(queryClient)
  .catch(() => {
    // IndexedDB unavailable (e.g. private browsing on some browsers) — proceed without cache
  })
  .finally(() => {
    createRoot(rootElement).render(
      <StrictMode>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Provider>
      </StrictMode>
    );
  });
