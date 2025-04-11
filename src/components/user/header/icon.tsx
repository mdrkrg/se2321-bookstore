import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toCNYString } from '@/lib/utils/price'
import { Route as RootRoute } from '@/routes/__root'
import { mdiAccount } from '@mdi/js'
import Icon from '@mdi/react'
import { Link } from '@tanstack/react-router'

export default function UserIcon() {
  const { user } = RootRoute.useLoaderData()

  const itemStyle = `group relative flex h-[25px] select-none items-center rounded-[3px]
  pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none
  data-[disabled]:pointer-events-none data-[highlighted]:bg-pink-700
  data-[disabled]:text-mauve8 data-[highlighted]:text-white`

  const dropdownContentStyle = `min-w-[220px] rounded-md bg-white p-[5px]
  shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]
  will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade
  data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade
  data-[side=top]:animate-slideDownAndFade`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Icon path={mdiAccount} size={1} />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          className={dropdownContentStyle}
          sideOffset={5}
        >
          <DropdownMenuItem className={itemStyle}>
            用户
            {' '}
            {user.username}
          </DropdownMenuItem>
          <DropdownMenuItem className={itemStyle} asChild>
            <Link to="/me/rebalance">
              账户余额
              {' '}
              <div className="ml-auto pl-5">
                {toCNYString(user.balance)}
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className={itemStyle} asChild>
            <Link to="/me/password">
              修改密码
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className={itemStyle}>
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
