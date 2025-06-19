import type { FieldErrorResponse } from '@/lib/api/utils'
import type { AddBookRequest } from '@/lib/models/admin'
import type { Book } from '@/lib/models/user'
import type { FormItems } from '../layouts/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addBook, fetchAdminBookListOptions } from '@/lib/api/admin'
import { objectEntries } from '@/lib/utils/typing'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
  title: z.string(),
  author: z.string(),
  description: z.string(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  cover: z.string().url(),
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
}

export function CreateBookForm({
  className,
  onSubmit,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      price: 0,
      stock: 0,
      cover: '',
      available: true,
    },
  })

  const queryClient = useQueryClient()
  const queryKey = fetchAdminBookListOptions().queryKey

  const {
    mutate: addMutateBook,
  } = useMutation<Book, Error | FieldErrorResponse<AddBookRequest>, AddBookRequest>({
    mutationFn: data => addBook(data),
    mutationKey: ['create', 'book'],
    onSuccess(book) {
      toast(`成功创建了书籍 ${book.id}`)
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
    addMutateBook(data)
  }

  return (
    <Form {...form}>
      <form
        className={className}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit && onSubmit(e)
          form.handleSubmit(submit)(e)
        }}
        {...props}
      >
        <div className="flex flex-col gap-6">
          <BulkFormItems form={form} formItems={formItems} />
          <Button type="submit" className="w-full">
            创建
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function CreateBookPopup({
  children,
}: React.ComponentProps<'div'>) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="md:max-w-[75vw] lg:max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>创建书籍</DialogTitle>
          <DialogDescription>
            在此处创建新的书籍
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <CreateBookForm onSubmit={() => setOpen(false)} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
