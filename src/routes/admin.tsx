import type { ReactNode } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { useUser } from '@/lib/api/user'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin')({
  async loader({ context: { queryClient } }) {
    const user = await queryClient.fetchQuery(useUser().fetchUserOptions())
    if (user.role !== 'ADMIN') {
      toast('您没有访问此页面的权限')
      throw redirect({ to: '/', replace: true })
    }
  },
  component: RouteComponent,
})

const routes = {
  '/admin/books': {
    display: '书籍管理',
  },
  '/admin/users': {
    display: '用户管理',
  },
  '/admin/orders': {
    display: '订单管理',
  },
}

function AdminNavigation() {
  return (
    <NavigationMenu className="w-full mx-auto mt-4">
      <NavigationMenuList>
        {Object.entries(routes).map(([link, prop]) => {
          return (
            <NavigationMenuItem>
              <NavigationMenuLink className="nav-link text-sm" asChild>
                <Link to={link}>
                  {prop.display}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-4 max-sm:p-0 max-sm:mx-0">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-sm:w-screen max-sm:shadow-none min-h-[60vh]">
        {children}
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <AdminLayout>
      <div className="m-auto p-4 text-xl">
        <h2 className="text-2xl my-2">管理界面</h2>
        <h4>欢迎您，管理员</h4>
      </div>
      <Separator className="sm:w-[80%] md:w-3/4 lg:w-1/2 m-auto" />
      <AdminNavigation />
      <Outlet />
    </AdminLayout>
  )
}
