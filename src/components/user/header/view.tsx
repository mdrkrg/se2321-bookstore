import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { mdiStore } from '@mdi/js'
import Icon from '@mdi/react'
import { Link } from '@tanstack/react-router'

import UserIcon from './icon'

const routes = {
  '/': {
    display: '首页',
  },
  '/me': {
    display: '个人主页',
  },
  '/rank': {
    display: '排行',
  },
  '/cart': {
    display: '购物车',
  },
  '/order': {
    display: '订单',
  },
}

const iconStyle = `
ml-auto mx-[2em] mt-[.3em] border-5 border-transparent h-max w-max
rounded-full nav-transition
`

// TODO: responsive design:
// - When in sm, the header will be a trigger dropdown menu

export default function UserHeader() {
  return (
    <header className="min-w-full flex space-around rounded-b-md bg-white py-[0.5em] border-solid border-b-[4px] border-b-gray-300">
      <NavigationMenu className="z-10 w-full">
        <NavigationMenuList className="center m-0 flex list-none">
          <NavigationMenuItem className="px-[1.5em]" key="icon">
            <Icon path={mdiStore} size={1.5} className="text-pink-700" />
          </NavigationMenuItem>
          {
            Object.entries(routes).map(([link, prop]) => {
              return (
                <NavigationMenuItem key={link}>
                  <NavigationMenuLink
                    className="nav-link text-md max-sm:text-sm"
                    asChild
                  >
                    <Link to={link}>
                      {prop.display}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })
          }
        </NavigationMenuList>
      </NavigationMenu>
      <span className={iconStyle} key="user">
        <UserIcon />
      </span>
    </header>
  )
}
