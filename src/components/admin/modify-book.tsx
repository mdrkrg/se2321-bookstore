import type { FieldErrorResponse } from '@/lib/api/utils'
import type { ChangeBookRequest } from '@/lib/models/admin'
import type { Book } from '@/lib/models/user'
import type { FormItems } from '../layouts/form'
import { changeBook, fetchAdminBookListOptions } from '@/lib/api/admin'
import { objectEntries } from '@/lib/utils/typing'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { BulkFormItems } from '../layouts/form'
import { Button } from '../ui/button'
import { Form } from '../ui/form'
import { Input } from '../ui/input'
import { NumberInput } from '../ui/number-input'
import { Textarea } from '../ui/textarea'

const formSchema = z.object({
  title: z.string().nonempty(),
  author: z.string().nonempty(),
  description: z.string(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  cover: z.string().url(),
  sales: z.coerce.number().min(0),
  available: z.boolean(),
})

type FormSchema = z.infer<typeof formSchema>

const formItems: FormItems<FormSchema> = {
  title: {
    formLabel: '标题',
    render: ({ field }) => (
      <Input {...field} />
    ),
  },
  author: {
    formLabel: '作者',
    render: ({ field }) => (
      <Input {...field} />
    ),
  },
  description: {
    formLabel: '简介',
    render: ({ field }) => (
      <Textarea {...field} />
    ),
  },
  price: {
    formLabel: '价格',
    render: ({ field }) => (
      <NumberInput
        min={0}
        fixedDecimalScale={true}
        decimalScale={2}
        {...field}
      />
    ),
  },
  stock: {
    formLabel: '库存',
    render: ({ field }) => (
      <NumberInput {...field} min={0} />
    ),
  },
  cover: {
    formLabel: '封面',
    render: ({ field }) => (
      <Input type="url" placeholder="请输入封面链接" {...field} />
    ),
  },
  sales: {
    formLabel: '销量',
    render: ({ field }) => (
      <NumberInput min={0} {...field} />
    ),
  },
}

interface ModifyBookFormProps extends React.ComponentProps<'form'> {
  book: Book
}

export function ModifyBookForm({
  book,
  className,
  ...props
}: ModifyBookFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: book.price ?? undefined,
      stock: book.stock ?? undefined,
      sales: book.sales ?? undefined,
      cover: book.cover ?? undefined,
      available: book.available ?? false,
    },
  })

  const queryClient = useQueryClient()
  const queryKey = ['admin', 'book', 'list']

  const {
    mutate: mutateBook,
  } = useMutation<Book, Error | FieldErrorResponse<ChangeBookRequest>, ChangeBookRequest>({
    mutationFn: data => changeBook(book.id, data),
    mutationKey: ['change', 'book', book.id],
    onSuccess(book) {
      toast(`修改书籍信息 ${book.id} 成功`)
      queryClient.invalidateQueries({
        queryKey,
      })
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
    mutateBook(data)
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
