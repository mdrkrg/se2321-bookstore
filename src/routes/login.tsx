import type { LoginRequest } from '@/lib/api/user'
import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/user/login/view'
import { createFileRoute, stripSearchParams, useRouter } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { useState } from 'react'
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

  // useEffect(() => {
  //   if (isAuthorized)
  //     router.navigate({ to: next || '/', replace: true })
  // }, [isAuthorized])

  const [auth, setAuth] = useState<LoginRequest>({
    username: '',
    password: '',
  })

  function handleLogin() {
    // eslint-disable-next-line no-console
    console.log(auth)
    toast('登录成功')
    router.navigate({ to: next || '/', replace: true })
  }

  return (
    <div className="flex flex-col gap-6 sm:w-3/4 lg:w-2/3 m-auto mt-[10vh]">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <LoginForm
            auth={auth}
            onPasswordChange={password =>
              setAuth({ username: auth.username, password })}
            onUsernameChange={username =>
              setAuth({ username, password: auth.password })}
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
          />
          <div className="relative hidden bg-muted md:flex">
            <span className="text-8xl text-center m-auto">📚🛒</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
