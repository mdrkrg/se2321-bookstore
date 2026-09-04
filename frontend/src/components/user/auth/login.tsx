import type { InputFormItems } from '@/components/layouts/form-inputs'
import type { FieldError, LoginRequest } from '@/lib/api/user'
import type { UserDTO } from '@/lib/models/user'
import { BulkInputFormItems } from '@/components/layouts/form-inputs'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { loginFetcher } from '@/lib/api/user'
import { cn } from '@/lib/utils/cn'
import { getNameValidator, PASSWORD_VALIDATOR } from '@/lib/utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formItems = {
  username: {
    formLabel: '用户名',
    formDescription: '',
    placeholder: '请输入用户名',
    type: 'text',
  },
  password: {
    formLabel: (
      <>
        密码
        <a
          href="#"
          className="ml-auto text-sm underline-offset-2 hover:underline"
          tabIndex={2}
        >
          找回密码
        </a>
      </>
    ),
    formDescription: '',
    placeholder: '请输入密码',
    type: 'password',
  },
} satisfies InputFormItems

const formSchema = z.object({
  username: getNameValidator('用户名'),
  password: PASSWORD_VALIDATOR,
})

interface LoginFormProps extends React.ComponentProps<'form'> {
  onLoginSuccess: (data: UserDTO) => void
  onLoginError: (data: Error | FieldError[]) => void
}

export function LoginForm({
  onLoginSuccess,
  onLoginError,
  className,
  ...props
}: LoginFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: login } = useMutation<UserDTO, Error | FieldError[], LoginRequest>({
    mutationFn: loginFetcher,
    onSuccess: onLoginSuccess,
    onError(err) {
      if (!(err instanceof Error)) {
        err.forEach((value) => {
          form.setError(value.field as 'username' | 'password', {
            message: value.message,
          })
        })
      }
      else {
        form.setError('root', {
          message: err.message,
        })
      }
      onLoginError(err)
    },
  })

  function submit(values: z.infer<typeof formSchema>) {
    login(values)
  }

  return (
    <Form {...form}>
      <form
        className={cn('p-6 md:p-8', className)}
        onSubmit={form.handleSubmit(submit)}
        {...props}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-bold">用户登录</h1>
            <p className="text-balance text-muted-foreground">
              👋
            </p>
          </div>
          <BulkInputFormItems form={form} formItems={formItems} />
          <Button type="submit" className="w-full">
            登录
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          </div>
          <div className="text-center text-sm">
            没有账号？
            {' '}
            <Link to="/signup" className="underline underline-offset-4" tabIndex={2}>
              注册
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
