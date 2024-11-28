"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import CalendarEvent from "./CalendarEvent";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" theme="dark" richColors />
      <CalendarEvent />
    </QueryClientProvider>
  );
}
