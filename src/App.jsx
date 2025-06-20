"use client"

import { useState, useEffect } from "react"
import LoadingScreen from "./components/LoadingScreen/LoadingScreen"
import PrivateAccess from "./components/PrivateAccess/PrivateAccess"
import MainPage from "./components/MainPage/MainPage"
import ParticleBackground from "./components/ParticleBackground/ParticleBackground"
import "./App.css"

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    // Verificar acceso privado (simulado con localStorage)
    const userAccess = localStorage.getItem("sadPageAccess")
    if (userAccess === "granted") {
      setHasAccess(true)
    }

    return () => clearTimeout(timer)
  }, [])

  const grantAccess = () => {
    localStorage.setItem("sadPageAccess", "granted")
    setHasAccess(true)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!hasAccess) {
    return <PrivateAccess onAccessGranted={grantAccess} />
  }

  return (
    <div className="App">
      <ParticleBackground />
      <MainPage />
    </div>
  )
}

export default App
