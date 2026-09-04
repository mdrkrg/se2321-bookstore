import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProfileNotImplemented } from '../me'

export const Route = createFileRoute('/me/rebalance')({
  loader() {
    throw notFound()
  },
  notFoundComponent: ProfileNotImplemented,
})
