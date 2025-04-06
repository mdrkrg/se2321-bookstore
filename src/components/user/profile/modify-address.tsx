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
import { fetchFakeAddress } from '@/lib/utils/dummy'

import { ADDRESS_VALIDATOR, getNameValidator, PHONE_VALIDATOR } from '@/lib/utils/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { mdiInformationOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { AddressSelectFormItem } from '../order/address-select'

const formSchema = z.object({
  receiver: getNameValidator('收件人名称'),
  address: ADDRESS_VALIDATOR,
  tel: PHONE_VALIDATOR,
  selectedAddressId: z.string().optional(),
})

const formItems = {
  receiver: {
    formLabel: '收件人',
    inputPlaceholder: '收件人姓名',
    formDescription: '请填写您的姓名或昵称，若向他人寄送可填写收件人姓名。',
  },
  address: {
    formLabel: '地址',
    inputPlaceholder: '详细收货地址',
    formDescription: '请填写详细的收货地址，若由他人代收可备注。',
  },
  tel: {
    formLabel: '联系电话',
    inputPlaceholder: '联系电话',
    formDescription: '请填写您的联系电话，向他人寄送可填写寄送对象的联系电话。',
  },
}

export function ModifyAddressForm({
  className,
}: React.ComponentProps<'form'>) {
  // is newly create or modify existing?
  const [isModify, setIsModify] = useState(false)

  const addressList = fetchFakeAddress()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedAddressId: undefined,
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    toast(isModify ? '已提交修改：' : '已创建新的收货地址', {
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

  function handleResetSelect() {
    if (!isModify)
      return

    setIsModify(false)
    form.setValue('selectedAddressId', undefined)
  }

  function handleDeleteSelect() {
    if (!isModify)
      return

    toast(`已删除收货地址 ID ${form.getValues('selectedAddressId')}`)
  }

  useEffect(() => {
    const selectedAddressId = form.watch('selectedAddressId')
    const selectedAddress = addressList.find(
      address => address.id.toString() === selectedAddressId,
    )

    if (selectedAddress) {
      form.setValue('receiver', selectedAddress.receiver)
      form.setValue('address', selectedAddress.address)
      form.setValue('tel', selectedAddress.tel)
      setIsModify(true)
    }
    else {
      // clear the fields if no address is selected
      form.setValue('receiver', '')
      form.setValue('address', '')
      form.setValue('tel', '')
      form.setValue('selectedAddressId', undefined)
      setIsModify(false)
    }
  }, [form.watch('selectedAddressId')])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        <FormField
          control={form.control}
          name="selectedAddressId"
          render={({ field }) => {
            const selectedAddress = addressList.find(address =>
              String(address.id) === field.value,
            )
            return (
              <FormItem>
                <FormLabel>选择收货地址进行修改</FormLabel>
                <AddressSelectFormItem
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  addressList={addressList}
                  selectedAddress={selectedAddress}
                />
                <FormMessage />
                <FormDescription>
                  选择一个收货地址以进行修改，若不选择则创建新的地址。
                </FormDescription>
              </FormItem>
            )
          }}
        />
        <fieldset className="md:flex p-2 rounded-md bg-gray-100">
          <div className="flex max-sm:mx-auto">
            <Icon path={mdiInformationOutline} size={1} className="my-auto" />
            <span className="mx-2 my-auto text-sm font-medium">
              您正在
              {isModify ? '修改' : '创建新的'}
              收货地址
            </span>
          </div>
          <div className="flex ml-auto max-sm:mt-2">
            <Button
              type="reset"
              size="sm"
              variant="ghost"
              onClick={handleResetSelect}
              disabled={!isModify}
              className="max-sm:w-full"
            >
              重置选择
            </Button>
            <Button
              className="ml-2 max-sm:w-full"
              type="button"
              size="sm"
              variant="destructive"
              disabled={!isModify}
              onClick={handleDeleteSelect}
            >
              删除
            </Button>
          </div>
        </fieldset>
        {Object.entries(formItems).map(([
          name,
          { formLabel, inputPlaceholder, formDescription },
        ]) => {
          return (
            <FormField
              key={name}
              control={form.control}
              name={name as 'receiver' | 'address' | 'tel'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={inputPlaceholder} {...field} />
                  </FormControl>
                  <FormDescription>
                    {formDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}
        <Button type="submit" className="w-full">提交</Button>
      </form>
    </Form>
  )
}
