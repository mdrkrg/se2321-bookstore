import CardsWaterfall from '@/components/user/main/cards-waterfall'

import { testBookList } from '@/lib/utils/dummy'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen gap-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CardsWaterfall bookList={testBookList} />
      </main>
    </div>
  )
}

export default App
