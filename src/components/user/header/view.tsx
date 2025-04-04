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
  '/profile': {
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

const focusTransitionStyle = `transition-colors bg-background
hover:bg-accent hover:text-accent-foreground focus:bg-accent
focus:text-accent-foreground focus:outline-none disabled:pointer-events-none
disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50
`

const navigationLinkStyle = `group inline-flex w-max
items-center justify-center rounded-md
font-medium max-sm:text-sm text-md
px-[1em] py-[0.7em] font-medium leading-none ${focusTransitionStyle}
[&.active]:text-pink-700 hover:text-pink-700 focus:text-pink-700
`

const iconStyle = `
ml-auto mx-[2em] mt-[.3em] border-5 border-transparent h-max w-max
rounded-full ${focusTransitionStyle}
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
                  <NavigationMenuLink className={navigationLinkStyle} asChild>
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
// <!--NavigationMenu.Link className={`${navigationMenuTriggerStyle} text-lg font-300 border-80 border-solid border-b-pink-300`} -->
