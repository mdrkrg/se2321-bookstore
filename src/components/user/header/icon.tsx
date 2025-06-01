import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logoutFetcher } from '@/lib/api/user'
import { toCNYString } from '@/lib/utils/price'
import { Route as RootRoute } from '@/routes/__root'
import { mdiAccount } from '@mdi/js'
import Icon from '@mdi/react'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'

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

  const router = useRouter()

  const { mutate: logout } = useMutation({
    mutationFn: logoutFetcher,
    mutationKey: ['logout'],
    onSuccess() {
      router.navigate({ to: '/login', replace: true })
    },
  })

  function handleLogout() {
    logout()
  }

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
            {user.username || '未登入'}
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
          {user.username && (
            <DropdownMenuItem className={itemStyle} onClick={handleLogout}>
              登出
            </DropdownMenuItem>
          ) }
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
