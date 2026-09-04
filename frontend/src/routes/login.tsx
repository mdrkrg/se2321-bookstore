import type { FieldError } from '@/lib/api/user'
import type { UserDTO } from '@/lib/models/user'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/user/auth/login'
import { createFileRoute, stripSearchParams, useRouter } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: zodValidator(
    z.object({
      next: z.string().catch(''),
    }),
  ),
  search: {
    middlewares: [stripSearchParams({ next: '' })],
  },
  component: LoginComponent,
})

function LoginComponent() {
  const router = useRouter()
  const { next } = Route.useSearch()

  function handleLoginSuccess(data: UserDTO) {
    toast('登录成功', {
      description: `${data.username}, welcome!`,
    })
    router.navigate({ to: next || '/', replace: true })
  }

  function handleLoginError(data: Error | FieldError[]) {
    if (Array.isArray(data)) {
      toast('登录失败', {
        description: data.map(({ field, message }) => {
          return `${field}: ${message}`
        }).join('\n'),
      })
    }
    else {
      toast('登录失败', {
        description: data.message,
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:w-3/4 lg:w-2/3 m-auto mt-[10vh]">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onLoginError={handleLoginError}
          />
          <div className="relative hidden bg-muted md:flex">
            <span className="text-8xl text-center m-auto">📚🛒</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
