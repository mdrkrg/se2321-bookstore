import { ModifyAddressForm } from '@/components/user/profile/modify-address'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/address')({
  component: ProfileAddressComponent,
})

function ProfileAddressComponent() {
  return (
    <ModifyAddressForm className="space-y-8 w-1/2 p-10 max-sm:p-0 m-auto max-sm:w-3/4" />
  )
}
