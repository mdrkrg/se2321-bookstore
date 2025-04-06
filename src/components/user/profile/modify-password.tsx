import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CHANGE_PASSWORD_VALIDATOR } from '@/lib/utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const passwordSchema = CHANGE_PASSWORD_VALIDATOR

export function ModifyPasswordForm({
  className,
}: React.ComponentProps<'form'>) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  })

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    const maskedValues = {
      password: '*'.repeat(values.password.length),
      confirmPassword: '*'.repeat(values.confirmPassword.length),
    }
    toast('已提交修改：', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(maskedValues, null, 2)}
          </code>
        </pre>
      ),
      className: 'w-max!',
      duration: 5000,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>修改密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                在此处修改您的密码
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="请再次输入密码"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                在此处再次输入上方的密码
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="!mt-4">提交</Button>
      </form>
    </Form>
  )
}
