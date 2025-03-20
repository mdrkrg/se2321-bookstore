import type { Book } from '@/lib/models/user'
import CardsWaterfall from '@/components/user/main/cards-waterfall'

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: App,
})

function App() {
  const testbook: Book = {
    id: 0,
    title: 'Test',
    description: 'test test',
    cover: 'https://img3m4.ddimg.cn/96/20/25215594-2_u_11.jpg',
    author: 'me',
    sales: 100,
    price: 0,
    tags: [
      { id: 0, name: 'test' },
    ],
  }

  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen gap-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CardsWaterfall bookList={Array.from({ length: 100 }, () => testbook)} />
      </main>
    </div>
  )
}

export default App
