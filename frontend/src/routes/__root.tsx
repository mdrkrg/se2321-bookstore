import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import UserHeader from '@/components/user/header/view'
import { useUser } from '@/lib/api/user'
import { NO_NEED_AUTH_ROUTES } from '@/lib/models/endpoints'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

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
    const { queryClient } = Route.useRouteContext()
    const { user } = Route.useLoaderData()
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <UserHeader user={user} />
          <main>
            <Outlet />
          </main>
          <ReactQueryDevtools initialIsOpen={false} />
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
