"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "./context/AuthContext"
import LoadingScreen from "./components/LoadingScreen/LoadingScreen"
import PrivateAccess from "./components/PrivateAccess/PrivateAccess"
import ParticleBackground from "./components/ParticleBackground/ParticleBackground"
import "./App.css"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AuthProvider>
      <div className="App">
        <ParticleBackground />
        <PrivateAccess />
      </div>
    </AuthProvider>
  )
}

export default App
