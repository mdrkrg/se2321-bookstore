import { ProfileForm as ModifyAddressForm } from '@/components/user/profile/modify-address'
import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/profile/address')({
  component: RouteComponent,
})

function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-4 max-sm:p-0 max-sm:mx-0">
      <div className="md:flex bg-white shadow-md rounded-lg overflow-hidden max-sm:w-screen max-sm:shadow-none">
        {children}
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <ProfileLayout>
      <ModifyAddressForm className='p-10 m-auto' />
    </ProfileLayout>
  )
}
