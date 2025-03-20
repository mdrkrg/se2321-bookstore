import { Button } from '@/components/ui/button'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createLazyFileRoute('/')({
  component: App,
})

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>React Tanning 🌴</h1>
      <p className="font-bold mt-2">
        React + Vite + TypeScript + TanStack + Tailwind
      </p>
      <div className="card">
        <Button onClick={() => setCount(count => count + 1)} className="mb-6">
          count is
          {' '}
          {count}
        </Button>
        <p>
          Edit
          {' '}
          <code>src/routes/index.lazy.tsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
