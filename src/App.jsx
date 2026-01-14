import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Evaluations from './components/Evaluations'
import Navbar from './components/Navbar'
import { fetchAprendizes } from './api'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, evaluations
  const [searchQuery, setSearchQuery] = useState('')
  const [aprendizes, setAprendizes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAprendizes()
      setAprendizes(data)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="flex min-h-screen bg-agro-bg">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-agro-green font-bold">
              Carregando dados...
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard aprendizes={aprendizes} />}
              {activeTab === 'evaluations' && <Evaluations aprendizes={aprendizes} searchQuery={searchQuery} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
