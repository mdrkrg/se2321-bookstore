import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/me/password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/me/password"!</div>
}
