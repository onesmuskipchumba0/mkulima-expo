import { useState, useEffect } from 'react'

function App() {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <button onClick={toggleTheme} className="btn btn-primary mb-4">
        Toggle Theme ({theme})
      </button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold">DaisyUI Test</h1>
        
        <div className="space-x-2">
          <button className="btn">Default</button>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
        </div>

        <div className="card w-96 bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Theme Test</h2>
            <p>Current theme: {theme}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
