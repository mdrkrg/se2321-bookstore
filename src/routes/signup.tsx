import type { SignupFormData } from '@/components/user/auth/signup'
import type { FieldError, SignupRequest } from '@/lib/api/user'
import type { UserDTO } from '@/lib/models/user'
import { Card, CardContent } from '@/components/ui/card'
import { SignupForm } from '@/components/user/auth/signup'
import { signupFetcher } from '@/lib/api/user'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/signup')({
  component: SignupComponent,
})

function SignupComponent() {
  const router = useRouter()

  const [auth, setAuth] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  })

  const { mutate: signup } = useMutation<UserDTO, Error | FieldError[], SignupRequest>({
    mutationFn: signupFetcher,
    onSuccess: (data) => {
      toast('注册成功', {
        description: `${data.username}, welcome!`,
      })
      router.navigate({ to: '/', replace: true })
    },
    onError: (data) => {
      if (Array.isArray(data)) {
        toast('注册失败', {
          description: data.map(({ field, message }) => {
            return `${field}: ${message}`
          }).join('\n'),
        })
      }
      else {
        toast('注册失败', {
          description: data.message,
        })
      }
    },
  })

  function handleSignup() {
    signup({
      username: auth.username,
      password: auth.password,
      email: auth.email,
    })
  }

  return (
    <div className="flex flex-col gap-6 sm:w-3/4 lg:w-2/3 m-auto mt-[10vh]">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SignupForm
            auth={auth}
            onPasswordChange={password =>
              setAuth({ ...auth, password })}
            onRepeatPasswordChange={repeatPassword =>
              setAuth({ ...auth, repeatPassword })}
            onUsernameChange={username =>
              setAuth({ ...auth, username })}
            onEmailChange={email =>
              setAuth({ ...auth, email })}
            onSubmit={(e) => {
              e.preventDefault()
              handleSignup()
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
