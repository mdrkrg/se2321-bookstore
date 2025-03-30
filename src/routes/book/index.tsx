import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute('/book/')({
  loader() {
    throw redirect({ to: '/' })
  },
})
