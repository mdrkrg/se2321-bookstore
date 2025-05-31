import type { UseLinkPropsOptions } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { ProfileInfo } from '@/components/user/profile/info'
import { cn } from '@/lib/utils/cn'
import { fetchFakeUser } from '@/lib/utils/dummy'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import React from 'react'

interface ListItemProps extends UseLinkPropsOptions {
  title: string
  children: React.ReactNode
}

const ListItem = React.forwardRef<
  React.ComponentRef<'a'>,
  ListItemProps
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          {...props}
          to={to}
          ref={ref}
          className={cn(
            'block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent nav-link',
            className,
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

export const Route = createFileRoute('/me')({
  loader() {
    return fetchFakeUser()
  },
  component: ProfileComponent,
  notFoundComponent: ProfileNotFound,
})

function ProfileNavigation() {
  return (
    <NavigationMenu className="w-full mx-auto mt-4">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>我的</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[100px] md:w-[200px] lg:w-[300px] lg:grid-cols-1">
              <ListItem to="/me/stars" title="收藏">
                查看我收藏的书籍
              </ListItem>
              <ListItem to="/me/comments" title="评论">
                查看我发布的书籍评论
              </ListItem>
              <ListItem to="/me/stats" title="统计信息">
                查看我的购书统计信息
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>个人资料变更</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[100px] md:w-[200px] md:grid-cols-1 lg:w-[300px] ">
              <ListItem to="/me/profile" title="修改个人资料">
                修改姓名、昵称、头像与简介
              </ListItem>
              <ListItem to="/me/password" title="修改密码">
                修改密码
              </ListItem>
              <ListItem to="/me/address" title="修改收货地址">
                修改或新增收货地址
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="nav-link text-sm" asChild>
            <Link to="/me/rebalance">
              账户充值
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-4 max-sm:p-0 max-sm:mx-0">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-sm:w-screen max-sm:shadow-none min-h-[60vh]">
        {children}
      </div>
    </div>
  )
}

function ProfileComponent() {
  return (
    <ProfileLayout>
      <ProfileInfo className="sm:w-full md:w-3/4 lg:w-1/2 mx-auto" />
      <Separator className="sm:w-[80%] md:w-3/4 lg:w-1/2 m-auto" />
      <ProfileNavigation />
      <Outlet />
    </ProfileLayout>
  )
}

export function ProfileNotImplemented() {
  return (
    <ProfileLayout>
      <div className="text-center p-4">施工中</div>
    </ProfileLayout>
  )
}

export function ProfileNotFound() {
  return (
    <ProfileLayout>
      <div className="text-center p-4">未找到页面</div>
    </ProfileLayout>
  )
}
