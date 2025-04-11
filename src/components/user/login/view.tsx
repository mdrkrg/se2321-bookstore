import type { LoginRequest } from '@/lib/api/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/cn'

interface LoginFormProps extends React.ComponentProps<'form'> {
  auth: LoginRequest
  onUsernameChange: (username: string) => void
  onPasswordChange: (password: string) => void
}

export function LoginForm({
  auth,
  onUsernameChange,
  onPasswordChange,
  className,
  ...props
}: LoginFormProps) {
  return (
    <form className={cn('p-6 md:p-8', className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">用户登录</h1>
          <p className="text-balance text-muted-foreground">
            👋
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">账号</Label>
          <Input
            id="username"
            placeholder="在此输入账号"
            value={auth.username}
            onChange={e => onUsernameChange(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">密码</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              找回密码
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            onChange={e => onPasswordChange(e.target.value)}
            value={auth.password}
          />
        </div>
        <Button type="submit" className="w-full">
          登录
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        </div>
        <div className="text-center text-sm">
          没有账号？
          {' '}
          <a href="#" className="underline underline-offset-4">
            注册
          </a>
        </div>
      </div>
    </form>
  )
}
