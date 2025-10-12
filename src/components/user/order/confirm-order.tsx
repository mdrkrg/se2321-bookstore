import type { OrderRequest } from '@/lib/api/order'
import type { Address, OrderAccepted, OrderItem, OutOfStockErrorResponse } from '@/lib/models/user'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { NumberInput } from '@/components/ui/number-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  changeCartItem,
  placeOrderAsync,
  waitForOrderResultEvent,
  waitForOrderResultWs,
} from '@/lib/api/order'
import { cn } from '@/lib/utils/cn'
import { fetchFakeAddress } from '@/lib/utils/dummy'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AddressSelectFormItem } from './address-select'

interface ConfirmOrderProps extends React.ComponentProps<'form'> {
  orderList: OrderItem[]
}

const FormSchema = z.object({
  addressId: z
    .string({
      required_error: '请选择收货地址',
    }),
  items: z.array(z.object({
    paidPrice: z.number().min(0),
    itemId: z.number(),
  })),
})

function getOrderResultFn(protocol: 'ws' | 'sse') {
  switch (protocol) {
    case 'sse':
      return waitForOrderResultEvent
    case 'ws':
    default:
      return waitForOrderResultWs
  }
}

export function ConfirmOrder({ className, orderList }: ConfirmOrderProps) {
  const [messageProtocol, setMessageProtocol] = useState<'ws' | 'sse'>('ws')
  const addressList = fetchFakeAddress()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // initialize orderList
    defaultValues: {
      items: orderList.map(({ id, paidPrice }) => ({ itemId: id, paidPrice })),
    },
  })
  const router = useRouter()

  const {
    mutate: mutatePlaceOrder,
  } = useMutation<OrderAccepted, OutOfStockErrorResponse, OrderRequest>({
    mutationFn: data => placeOrderAsync(data, messageProtocol),
    async onSuccess(rsp) {
      toast(rsp.message)
      try {
        const result = await (getOrderResultFn(messageProtocol))(rsp.messageId)
        if (result.success) {
          toast(`已创建订单 ID ${result.order?.id}`)
          setTimeout(() => {
            router.navigate({ to: '/order' })
          }, 200)
        }
        else {
          toast('创建订单出错', {
            description: result.error,
          })
        }
      }
      catch {
        toast('获取订单消息出错')
      }
    },
    onError(error) {
      toast('出错：', {
        description: `${error.message}:`,
      })
      error.outOfStockItems.forEach((detail) => {
        form.setError(`items`, {
          message: `“${detail.title}”的库存不足。可用：${detail.available}，请求：${detail.requested}`,
        })
      })
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const address = addressList.find(addr =>
      String(addr.id) === data.addressId) as Address
    const { id: _, ...addressData } = address
    const submittedData = {
      items: data.items,
      ...addressData,
    }
    mutatePlaceOrder(submittedData)
  }

  function updateQuantity(orderItemId: number, newQuantity: number) {
    // TODO: the outer won't change
    changeCartItem(orderItemId, newQuantity).then(() => router.invalidate())
  }

  return (
    <Form {...form}>
      <div className="flex pb-4">
        <span className="mr-8 my-auto">通信方式</span>
        <Select
          value={messageProtocol}
          onValueChange={value => setMessageProtocol(value as 'ws' | 'sse')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="通信方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sse">SSE</SelectItem>
            <SelectItem value="ws">Web Socket</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('w-full space-y-6', className)}
      >
        <FormField
          control={form.control}
          name="items"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>订单物品</FormLabel>
                {field.value.map((item, index) => {
                  const orderItem = orderList.at(index) as OrderItem
                  return (
                    <OrderPreview
                      orderItem={orderItem}
                      handleQuantityChange={(newQuantity) => {
                        updateQuantity(item.itemId, newQuantity)
                        item.paidPrice = newQuantity * orderItem.unitPrice
                      }}
                      key={index}
                    />
                  )
                })}
                <FormMessage />
                <FormDescription>
                  您可以在此处修改您的订单。
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="addressId"
          render={({ field }) => {
            const selectedAddress = addressList.find(address =>
              String(address.id) === field.value,
            )

            return (
              <FormItem>
                <FormLabel>收货地址</FormLabel>
                <AddressSelectFormItem
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  addressList={addressList}
                  selectedAddress={selectedAddress}
                />
                <FormMessage />
                <FormDescription>
                  您可以在
                  <Link to="/me/address" target="_blank" className="text-pink-900">
                    个人资料
                  </Link>
                  中管理收货地址。
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <Button
          type="submit"
          variant="destructive"
          className="w-full bg-pink-500 hover:bg-pink-700"
        >
          确认
        </Button>
      </form>
    </Form>
  )
}

interface OrderPreviewProps extends React.ComponentProps<'div'> {
  orderItem: OrderItem
  handleQuantityChange: (newQuantity: number) => void
}

function OrderPreview({
  orderItem,
  handleQuantityChange,
}: OrderPreviewProps) {
  return (
    <div className="flex rounded-md shadow-md hover:shadow-lg">
      <img
        src={orderItem.book.cover}
        alt={orderItem.book.title}
        width={80}
      />
      <p className="p-4 mr-auto my-auto">{orderItem.book.title}</p>
      <NumberInput
        defaultValue={orderItem.number}
        className="mr-1"
        inputStyle="w-10"
        min={1}
        max={orderItem.book.stock}
        value={orderItem.number}
        onValueChange={(newCount) => {
          if (newCount)
            handleQuantityChange(newCount)
        }}
      />
    </div>
  )
}
