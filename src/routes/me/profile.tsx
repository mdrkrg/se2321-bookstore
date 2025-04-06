import { ModifyIntroForm } from '@/components/user/profile/modify-intro'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ModifyIntroForm className="space-y-8 w-1/2 p-10 max-sm:p-0 m-auto max-sm:w-3/4" />
}
