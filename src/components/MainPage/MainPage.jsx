"use client"

import { useState } from "react"
import Header from "../Header/Header"
import MusicPlayer from "../MusicPlayer/MusicPlayer"
import Blog from "../Blog/Blog"
import BrokenFaces from "../BrokenFaces/BrokenFaces"
import Statistics from "../Statistics/Statistics"
import "./MainPage.css"

const MainPage = () => {
  const [activeSection, setActiveSection] = useState("home")

  const renderSection = () => {
    switch (activeSection) {
      case "music":
        return <MusicPlayer />
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
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="main-content">{renderSection()}</main>
    </div>
  )
}

export default MainPage
