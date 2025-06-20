"use client"

import React from "react"
import { useState, useEffect } from "react"
import { FaHeart, FaSadTear, FaHeartBroken } from "react-icons/fa"
import "./BrokenFaces.css"

const BrokenFaces = () => {
  const [currentFace, setCurrentFace] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [activeFaces, setActiveFaces] = useState(new Set())

  const sadFaces = [
    { icon: FaHeartBroken, text: "Corazón fragmentado", color: "#ff4757" },
    { icon: FaSadTear, text: "Lágrimas silenciosas", color: "#4834d4" },
    { icon: FaHeart, text: "Amor perdido", color: "#666", broken: true },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentFace((prev) => (prev + 1) % sadFaces.length)
        setIsVisible(true)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleFaceClick = (index) => {
    setActiveFaces((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="broken-faces-container animate-fadeIn">
      <h2 className="section-title animate-slideIn">Rostros del Alma Rota</h2>

      <div className="faces-display">
        <div className={`face-container ${isVisible ? "visible" : "hidden"}`}>
          <div className="face-icon-wrapper">
            {React.createElement(sadFaces[currentFace].icon, {
              className: "face-icon animate-heartbeat",
              style: { color: sadFaces[currentFace].color },
            })}
            {sadFaces[currentFace].broken && <div className="crack-overlay"></div>}
          </div>
          <p className="face-text">{sadFaces[currentFace].text}</p>
        </div>
      </div>

      <div className="faces-gallery">
        <div className="gallery-grid">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className={`gallery-item animate-fadeIn ${activeFaces.has(index) ? "active" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleFaceClick(index)}
            >
              <div className="gallery-face">
                <div className="face-emoji">😢</div>
                <div className="face-crack"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="melancholy-quotes">
        <div className="quote-container animate-pulse">
          <blockquote>"En la oscuridad del alma, encontramos la verdadera esencia de nuestro ser..."</blockquote>
          <cite>- Jinshirō Daikō</cite>
        </div>
      </div>
    </div>
  )
}

export default BrokenFaces
