import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mdiAccount } from '@mdi/js'
import Icon from '@mdi/react'

const balance = 100000

const username = 'test'

export default function UserIcon() {
  const itemStyle = `group relative flex h-[25px] select-none items-center rounded-[3px]
  pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none
  data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9
  data-[disabled]:text-mauve8 data-[highlighted]:text-violet1`

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
            {username}
          </DropdownMenuItem>
          <DropdownMenuItem className={itemStyle}>
            账户余额
            {' '}
            <div className="ml-auto pl-5">
              {balance}
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className={itemStyle}>
            修改密码
          </DropdownMenuItem>
          <DropdownMenuItem className={itemStyle}>
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
