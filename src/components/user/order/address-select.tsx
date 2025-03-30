import type { Address } from '@/lib/models/user'
import type { SelectProps } from '@radix-ui/react-select'
import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddressSelectFormItemProp extends SelectProps {
  addressList: Address[]
  selectedAddress: Address | undefined
}

function AddressDisplay({ address }: { address: Address }) {
  return (
    <fieldset className="grid grid-rows-3 grid-cols-[5em_1fr]">
      <p className="text-gray-600">收件人</p>
      <p>{address.receiver}</p>
      <p className="text-gray-600">地址</p>
      <p className="overflow-hidden whitespace-nowrap text-ellipsis">{address.address}</p>
      <p className="text-gray-600">电话</p>
      <p>{address.tel}</p>
    </fieldset>
  )
}

export function AddressSelectFormItem({
  onValueChange,
  defaultValue,
  addressList,
  selectedAddress,
}: AddressSelectFormItemProp) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="请选择收货地址">
            {selectedAddress ? selectedAddress.address : '请选择收货地址'}
          </SelectValue>
        </SelectTrigger>
      </FormControl>
      <SelectContent
        className="max-sm:overflow-hidden max-sm:max-w-[95vw]"
      >
        <SelectGroup>
          {addressList.length
            ? addressList.map(address => (
                <SelectItem value={String(address.id)} key={address.id}>
                  <AddressDisplay address={address} />
                </SelectItem>
              ),
              )
            : (
                <SelectLabel>您没有已设置的地址</SelectLabel>
              )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
