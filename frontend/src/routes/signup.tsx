import type { FieldError } from '@/lib/api/user'
import type { UserDTO } from '@/lib/models/user'
import { Card, CardContent } from '@/components/ui/card'
import { SignupForm } from '@/components/user/auth/signup'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/signup')({
  component: SignupComponent,
})

function SignupComponent() {
  const router = useRouter()

  function handleSignupSuccess(data: UserDTO) {
    toast('注册成功', {
      description: `${data.username}, welcome!`,
    })
    router.navigate({ to: '/', replace: true })
  }

  function handleSignupError(data: Error | FieldError[]) {
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
  }

  return (
    <div className="flex flex-col gap-6 sm:w-3/4 lg:w-2/3 m-auto mt-[10vh]">
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <SignupForm
            onSignupSuccess={handleSignupSuccess}
            onSignupError={handleSignupError}
          />
          <div className="relative hidden bg-muted md:flex">
            <span className="text-8xl text-center m-auto">📚🛒</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
