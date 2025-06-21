"use client"

import { useState } from "react"
import Header from "../Header/Header"
import MusicPlayer from "../MusicPlayer/MusicPlayer"
import Blog from "../Blog/Blog"
import BrokenFaces from "../BrokenFaces/BrokenFaces"
import Statistics from "../Statistics/Statistics"
import PasswordManager from "../PrivateAccess/PasswordManager"
import "./MainPage.css"

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("home")
  const [showPasswordManager, setShowPasswordManager] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case "music":
        return (
          <div className="music-section animate-fadeIn">
            <h2 className="section-title animate-slideIn">Música Sad</h2>
            <p className="section-description">
              Usa el reproductor flotante para controlar tu música melancólica. Puedes arrastrarlo y minimizarlo
              mientras navegas por otras secciones.
            </p>
            <div className="music-info">
              <div className="info-card">
                <h3>🎵 Controles</h3>
                <p>El reproductor flotante te permite controlar la música desde cualquier sección</p>
              </div>
              <div className="info-card">
                <h3>📱 Móvil</h3>
                <p>En dispositivos móviles, puedes tocar y arrastrar el reproductor</p>
              </div>
              <div className="info-card">
                <h3>🔄 Funciones</h3>
                <p>Aleatorio, repetir, control de volumen y más</p>
              </div>
            </div>
          </div>
        )
      case "blog":
        return <Blog />
      case "faces":
        return <BrokenFaces />
      case "stats":
        return <Statistics />
      default:
        return (
          <div className="home-section animate-fadeIn">
            <div className="hero-content">
              <h1 className="hero-title animate-heartbeat">Jinshirō Daikō</h1>
              <p className="hero-subtitle animate-fadeIn">神志郎 大晃</p>
              <div className="hero-description">
                <p>Bienvenido a mi espacio personal...</p>
                <p>Un lugar donde la melancolía encuentra su hogar</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="main-page">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onShowPasswordManager={() => setShowPasswordManager(true)}
      />
      <main className="main-content">{renderSection()}</main>
      {/* Reproductor de música global - siempre visible */}
      <MusicPlayer />

      {showPasswordManager && <PasswordManager onClose={() => setShowPasswordManager(false)} />}
    </div>
  )
}

export default MainPage
