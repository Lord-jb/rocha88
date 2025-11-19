// src/components/Providers.tsx
// Import the QueryClient constructor and provider from TanStack Query.
// NOTE: QueryClientProvider expects a QueryClient instance, not a queryClient instance.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

// Maintain a single QueryClient instance on the client side to avoid recreating
// it on every render. On the server we create a new client per request.
let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // On the server we create a fresh QueryClient for each request.
    return new QueryClient({
      defaultOptions: {
        queries: {
          // Keep query results fresh for 1 minute.
          staleTime: 60_000,
          // Disable refetch on window focus to prevent extra network calls.
          refetchOnWindowFocus: false,
          // Retry once on failure.
          retry: 1,
        },
      },
    })
  }

  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  }

  return browserQueryClient
}

export default function Providers({ children }: Props) {
  const queryClient = getQueryClient()

  return (
    // Provide the QueryClient to all descendants. Without this provider React Query
    // will throw "No QueryClient set, use QueryClientProvider to set one."
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}