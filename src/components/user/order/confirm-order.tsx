import type { Address, OrderItem } from '@/lib/models/user'
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
import { cn } from '@/lib/utils/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
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
      required_error: 'Please select an address to display.',
    }),
  itemIds: z.array(
    z.object({
      id: z.number(),
      number: z.number().min(1, 'Quantity must be at least 1'),
    }),
  ),
})

const fakeAddressList: Address[] = [
  {
    id: 0,
    receiver: 'Brandy DuBuque',
    address: 'North Carolina Hickory 2250 N Center St',
    tel: '(828) 328-6080',
  },
  {
    id: 1,
    receiver: 'Brandy DuBuque',
    address: 'Alaska Fairbanks 3260 College Rd',
    tel: '(828) 328-6080',
  },
  {
    id: 2,
    receiver: 'Mr. Kris Beatty IV',
    address: 'Pennsylvania Mechanicsburg 5250 Simpson Ferry Rd',
    tel: '(717) 458-0430',
  },
]

export function ConfirmOrder({ className, orderList }: ConfirmOrderProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // initialize orderList
    defaultValues: {
      itemIds: orderList.map(item => ({ id: item.id, number: item.number })),
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const address = fakeAddressList.find(addr =>
      String(addr.id) === data.addressId) as Address
    const { id: _, ...addressData } = address
    const submittedData = {
      itemIds: data.itemIds,
      ...addressData,
    }
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
  }

  function updateQuantity(orderItemId: number, newQuantity: number) {
    form.setValue(
      'itemIds',
      form.getValues().itemIds.map(item => (
        item.id === orderItemId ? { ...item, number: newQuantity } : item
      )),
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('w-full space-y-6', className)}
      >
        <FormField
          control={form.control}
          name="itemIds"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>订单物品</FormLabel>
                {field.value.map(({ id: bookId }, index) => {
                  const orderItem = orderList.at(index) as OrderItem
                  return (
                    <OrderPreview
                      orderItem={orderItem}
                      onQuantityChange={(newQuantity) => {
                        updateQuantity(bookId, newQuantity)
                      }}
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
            const selectedAddress = fakeAddressList.find(address =>
              String(address.id) === field.value,
            )

            return (
              <FormItem>
                <FormLabel>收货地址</FormLabel>
                <AddressSelectFormItem
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  addressList={fakeAddressList}
                  selectedAddress={selectedAddress}
                />
                <FormMessage />
                <FormDescription>
                  您可以在
                  <Link to="/profile/address" target="_blank" className="text-pink-900">
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
  onQuantityChange: (newQuantity: number) => void
}

function OrderPreview({ orderItem, onQuantityChange }: OrderPreviewProps) {
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
        value={orderItem.number}
        onValueChange={newCount =>
          typeof newCount === 'number' ? onQuantityChange(newCount) : null}
      />
    </div>
  )
}
