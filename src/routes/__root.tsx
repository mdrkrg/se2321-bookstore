import { Toaster } from '@/components/ui/sonner'
import UserHeader from '@/components/user/header/view'
import { useUser } from '@/lib/api/user'
import { NO_NEED_AUTH_ROUTES } from '@/lib/models/endpoints'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'

import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { useState } from 'react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  async loader({ context: { queryClient }, location }) {
    const user = await queryClient.fetchQuery(useUser().fetchUserOptions())
    // if not in login or signup route, redirect
    if (user.username === null && !NO_NEED_AUTH_ROUTES.includes(location.pathname)) {
      throw redirect({ to: '/login', replace: true })
    }
    // if already logged in, redirect to root if go to login or signup
    if (user.username !== null && NO_NEED_AUTH_ROUTES.includes(location.pathname)) {
      throw redirect({ to: '/' })
    }
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
    const { user } = Route.useLoaderData()
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <UserHeader user={user} />
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
