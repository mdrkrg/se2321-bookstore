import { Toaster } from '@/components/ui/sonner'
import UserHeader from '@/components/user/header/view'
import { fetchFakeUser } from '@/lib/utils/dummy'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { useState } from 'react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader() {
    const user = fetchFakeUser()
    return {
      user,
    }
  },
  component: () => {
    const [queryClient] = useState(
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
          },
        },
      }),
    )
    return (
      <>
        <UserHeader />
        <QueryClientProvider client={queryClient}>
          <main>
            <Outlet />
          </main>
        </QueryClientProvider>
        <TanStackRouterDevtools />
        <footer className="w-full text-center py-4em">
          Create with ❤️ by Crvena.
        </footer>
        <Toaster />
      </>
    )
  },
})
