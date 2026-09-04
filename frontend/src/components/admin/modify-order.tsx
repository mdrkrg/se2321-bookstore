import type { FieldErrorResponse } from '@/lib/api/utils'
import type { ChangeOrderRequest } from '@/lib/models/admin'
import type { Order } from '@/lib/models/user'
import type { FormItems } from '../layouts/form'
import { changeOrder } from '@/lib/api/admin'
import { objectEntries } from '@/lib/utils/typing'
import { getNameValidator, PHONE_VALIDATOR } from '@/lib/utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { BulkFormItems } from '../layouts/form'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import { Input } from '../ui/input'

const formSchema = z.object({
  receiver: getNameValidator('收件人'),
  tel: PHONE_VALIDATOR,
  address: z.string(),
})

type FormSchema = z.infer<typeof formSchema>

const formItems: FormItems<FormSchema> = {
  receiver: {
    formLabel: '收件人',
    render: ({ field }) => (
      <Input {...field} />
    ),
  },
  tel: {
    formLabel: '电话',
    render: ({ field }) => (
      <Input {...field} />
    ),
  },
  address: {
    formLabel: '地址',
    render: ({ field }) => (
      <Input {...field} />
    ),
  },
}

interface ModifyOrderFormProps extends React.ComponentProps<'form'> {
  order: Order
  onSubmissionSuccess?: () => void
}

export function ModifyOrderForm({
  order,
  onSubmissionSuccess,
  className,
  ...props
}: ModifyOrderFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiver: order.receiver ?? '',
      tel: order.tel ?? '',
      address: order.address ?? '',
    },
  })

  const queryClient = useQueryClient()
  const queryKey = ['admin', 'order', 'list']

  const {
    mutate: mutateOrder,
  } = useMutation<Order, Error | FieldErrorResponse<ChangeOrderRequest>, ChangeOrderRequest>({
    mutationFn: data => changeOrder(order.id, data),
    mutationKey: ['change', 'order', order.id],
    onSuccess(order) {
      toast(`修改订单信息 ${order.id} 成功`)
      queryClient.invalidateQueries({
        queryKey,
      })
      onSubmissionSuccess && onSubmissionSuccess()
    },
    onError(error) {
      if (error instanceof Error) {
        console.error(error)
        toast(error.message)
        return
      }
      if (!(error instanceof Object)) {
        return
      }
      objectEntries(error).forEach(([field, message]) => {
        form.setError(field, { message })
      })
    },
  })

  function submit(data: z.infer<typeof formSchema>) {
    mutateOrder(data)
  }

  return (
    <Form {...form}>
      <form
        className={className}
        onSubmit={form.handleSubmit(submit)}
        {...props}
      >
        <div className="flex flex-col gap-6">
          <BulkFormItems form={form} formItems={formItems} />
          <Button type="submit" className="w-full">
            修改
          </Button>
        </div>
      </form>
    </Form>
  )
}
