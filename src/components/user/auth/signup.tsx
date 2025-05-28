import type { SignupRequest } from '@/lib/api/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils/cn'
import { Link } from '@tanstack/react-router'

export interface SignupFormData extends SignupRequest {
  repeatPassword: string
}

interface SignupFormProps extends React.ComponentProps<'form'> {
  auth: SignupFormData
  onUsernameChange: (username: string) => void
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onRepeatPasswordChange: (repeatPassword: string) => void
}

export function SignupForm({
  auth,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onRepeatPasswordChange,
  className,
  ...props
}: SignupFormProps) {
  return (
    <form className={cn('p-6 md:p-8', className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">注册账号</h1>
          <p className="text-balance text-muted-foreground">
            👋
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            placeholder="在此输入用户名"
            value={auth.username}
            onChange={e => onUsernameChange(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">电子邮箱</Label>
          <Input
            id="email"
            type="email"
            placeholder="在此输入电子邮箱"
            value={auth.email}
            onChange={e => onEmailChange(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">密码</Label>
          </div>
          <Input
            id="password"
            type="password"
            required
            onChange={e => onPasswordChange(e.target.value)}
            value={auth.password}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">重复密码</Label>
          </div>
          <Input
            id="repeatPassword"
            type="password"
            required
            onChange={e => onRepeatPasswordChange(e.target.value)}
            value={auth.repeatPassword}
          />
        </div>
        <Button type="submit" className="w-full">
          注册
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          已有账号？
          {' '}
          <Link to="/login" className="underline underline-offset-4">
            登录
          </Link>
        </div>
      </div>
    </form>
  )
}
