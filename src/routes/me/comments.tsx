import { createFileRoute, notFound } from '@tanstack/react-router'
import { ProfileNotFound } from '../me'

export const Route = createFileRoute('/me/comments')({
  loader() {
    throw notFound()
  },
  notFoundComponent: ProfileNotFound,
})
