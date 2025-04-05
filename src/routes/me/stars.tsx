import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProfileNotFound } from '../me'

export const Route = createFileRoute('/me/stars')({
  loader() {
    throw notFound()
  },
  notFoundComponent: ProfileNotFound,
})
