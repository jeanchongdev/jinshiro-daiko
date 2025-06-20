"use client"

import { useState, useEffect } from "react"
import { FaHeart } from "react-icons/fa"
import "./LoadingScreen.css"

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(0)

  const phrases = [
    "Cargando tristeza...",
    "Preparando corazones rotos...",
    "Iniciando melodías melancólicas...",
    "Bienvenido a tu espacio sad...",
  ]

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 2
      })
    }, 60)

    const phraseTimer = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length)
    }, 750)

    return () => {
      clearInterval(progressTimer)
      clearInterval(phraseTimer)
    }
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="broken-heart">
          <FaHeart className="heart-icon animate-heartbeat" />
          <div className="crack"></div>
        </div>

        <h1 className="loading-title animate-fadeIn">Jinshirō Daikō</h1>
        <p className="loading-subtitle animate-fadeIn">神志郎 大晃</p>

        <div className="loading-bar-container">
          <div className="loading-bar">
            <div className="loading-progress" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="loading-percentage">{progress}%</span>
        </div>

        <p className="loading-phrase animate-fadeIn">{phrases[currentPhrase]}</p>
      </div>

      <div className="lightning-effects">
        <div className="lightning lightning-1"></div>
        <div className="lightning lightning-2"></div>
        <div className="lightning lightning-3"></div>
      </div>
    </div>
  )
}

export default LoadingScreen
