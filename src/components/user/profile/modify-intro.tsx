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
import { Textarea } from '@/components/ui/textarea'
import { MAX_DESCRIPTION } from '@/lib/utils/validate'
import { Route as MeRootRoute } from '@/routes/me'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const descriptionSchema = z.object({
  introduction: z.string().max(MAX_DESCRIPTION, {
    message: `个人简介不得超过 ${MAX_DESCRIPTION} 字`,
  }),
})

export function ModifyIntroForm({
  className,
}: React.ComponentProps<'form'>) {
  const { introduction: previousDescription } = MeRootRoute.useLoaderData()

  const form = useForm<z.infer<typeof descriptionSchema>>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      introduction: previousDescription,
    },
  })

  function onSubmit(values: z.infer<typeof descriptionSchema>) {
    toast('已提交修改：', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(values, null, 2)}
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
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>个人简介</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`输入不超过 ${MAX_DESCRIPTION} 字的个人简介`}
                  className="min-h-30"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                在此处修改您的个人简介
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
