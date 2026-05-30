import { useState, useEffect } from 'react'

export default function Test() {
  const [results, setResults] = useState<any[]>([])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (running) {
      fetch('/api/test')
    }
  }, [running])

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <h1 className="text-2xl font-bold text-white mb-4">测试页面</h1>
      <div className="space-y-2">
        {results.map((r, i) => (
          <div key={i} className="bg-dark-card p-4 rounded-2xl text-white">
            {r.name}: {r.passed ? '✅' : '❌'} - {r.message}
          </div>
        ))}
      </div>
    </div>
  )
}
