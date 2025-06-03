import type { Address, OrderItem, OutOfStockErrorResponse } from '@/lib/models/user'
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
import { changeCartItem, placeOrder } from '@/lib/api/order'
import { cn } from '@/lib/utils/cn'
import { fetchFakeAddress } from '@/lib/utils/dummy'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@tanstack/react-router'
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

export function ConfirmOrder({ className, orderList }: ConfirmOrderProps) {
  const addressList = fetchFakeAddress()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // initialize orderList
    defaultValues: {
      items: orderList.map(({ id, paidPrice }) => ({ itemId: id, paidPrice })),
    },
  })
  const router = useRouter()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const address = addressList.find(addr =>
      String(addr.id) === data.addressId) as Address
    const { id: _, ...addressData } = address
    const submittedData = {
      items: data.items,
      ...addressData,
    }
    placeOrder(submittedData).then(() => {
      toast('已创建订单：', {
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(submittedData, null, 2)}
            </code>
          </pre>
        ),
        className: 'w-max!',
        duration: 5000,
      })
      setTimeout(() => {
        router.navigate({ to: '/order' })
      }, 200)
    }).catch((err) => {
      return err.json()
    }).then((errRsp: OutOfStockErrorResponse) => {
      toast('出错：', {
        description: `${errRsp.message}:`,
      })
      errRsp.outOfStockItems.forEach((detail) => {
        form.setError(`items`, {
          message: `“${detail.title}”的库存不足。可用：${detail.available}，请求：${detail.requested}`
        })
      })
    })
  }

  function updateQuantity(orderItemId: number, newQuantity: number) {
    // TODO: the outer won't change
    changeCartItem(orderItemId, newQuantity).then(() => router.invalidate())
  }

  return (
    <Form {...form}>
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
