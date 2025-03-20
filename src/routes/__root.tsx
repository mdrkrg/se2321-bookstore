import UserHeader from '@/components/user/header/view'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { useState } from 'react'

export const Route = createRootRoute({
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
          <div className="mt-32">
            <Outlet />
          </div>
        </QueryClientProvider>
        <TanStackRouterDevtools />
      </>
    )
  },
})
