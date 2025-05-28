import type { InputFormItems } from '@/components/layouts/form'
import type { FieldError, SignupRequest } from '@/lib/api/user'
import type { UserDTO } from '@/lib/models/user'
import { BulkInputFormItems } from '@/components/layouts/form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { signupFetcher } from '@/lib/api/user'
import { cn } from '@/lib/utils/cn'
import {
  confirmPasswordRefinement,
  EMAIL_VALIDATOR,
  getNameValidator,
  PASSWORD_VALIDATOR,
} from '@/lib/utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formItems = {
  username: {
    formLabel: '用户名',
    placeholder: '请输入用户名',
  },
  email: {
    formLabel: '电子邮箱',
    placeholder: '请输入电子邮箱',
    type: 'email',
  },
  password: {
    formLabel: '密码',
    placeholder: '请输入密码',
    type: 'password',
  },
  confirmPassword: {
    formLabel: '重复密码',
    placeholder: '请再次输入密码',
    type: 'password',
  },
} satisfies InputFormItems

export interface SignupFormData extends SignupRequest {
  repeatPassword: string
}

const formSchema = z.object({
  username: getNameValidator('用户名'),
  email: EMAIL_VALIDATOR,
  password: PASSWORD_VALIDATOR,
  confirmPassword: PASSWORD_VALIDATOR,
}).superRefine(confirmPasswordRefinement)

interface SignupFormProps extends React.ComponentProps<'form'> {
  onSignupSuccess: (data: UserDTO) => void
  onSignupError: (data: Error | FieldError[]) => void
}

export function SignupForm({
  onSignupSuccess,
  onSignupError,
  className,
  ...props
}: SignupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: signup } = useMutation<UserDTO, Error | FieldError[], SignupRequest>({
    mutationFn: signupFetcher,
    onSuccess: onSignupSuccess,
    onError(err) {
      if (!(err instanceof Error)) {
        err.forEach((value) => {
          form.setError(
            value.field as 'username' | 'email' | 'password',
            {
              message: value.message,
            },
          )
        })
      }
      else {
        form.setError('root', {
          message: err.message,
        })
      }
      onSignupError(err)
    },
  })

  function submit(values: z.infer<typeof formSchema>) {
    const { confirmPassword, ...data } = values
    signup(data)
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
            <h1 className="text-2xl font-bold">注册账号</h1>
            <p className="text-balance text-muted-foreground">
              👋
            </p>
          </div>
          <BulkInputFormItems form={form} formItems={formItems} />
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
    </Form>
  )
}
