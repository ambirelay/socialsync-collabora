import React from 'react'
import { TestComponent } from './TestComponent'
import { Toaster } from 'sonner'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <TestComponent />
      <Toaster />
    </div>
  )
}

export default App