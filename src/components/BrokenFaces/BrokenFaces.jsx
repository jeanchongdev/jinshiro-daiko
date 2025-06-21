"use client"

import React from "react"
import { useState, useEffect } from "react"
import { FaHeart, FaSadTear, FaHeartBroken, FaCloud, FaMoon, FaSkull } from "react-icons/fa"
import "./BrokenFaces.css"

const BrokenFaces = () => {
  const [currentFace, setCurrentFace] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [activeFaces, setActiveFaces] = useState(new Set())

  const sadFaces = [
    { icon: FaHeartBroken, text: "Corazón fragmentado", color: "#ff4757" },
    { icon: FaSadTear, text: "Lágrimas silenciosas", color: "#4834d4" },
    { icon: FaHeart, text: "Amor perdido", color: "#666", broken: true },
    { icon: FaCloud, text: "Nubes grises del alma", color: "#74b9ff" },
    { icon: FaMoon, text: "Noches solitarias", color: "#a29bfe" },
    { icon: FaSkull, text: "Muerte del sentimiento", color: "#636e72" },
  ]

  const brokenEmojis = [
    "😢",
    "😭",
    "💔",
    "😔",
    "😞",
    "😟",
    "😪",
    "😰",
    "😨",
    "😧",
    "😦",
    "😩",
    "🥺",
    "😿",
    "💀",
    "👻",
    "🌧️",
    "⛈️",
    "🖤",
    "💙",
    "🌙",
    "⭐",
    "🕯️",
    "🥀",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentFace((prev) => (prev + 1) % sadFaces.length)
        setIsVisible(true)
      }, 500)
    }, 4000)

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

  const getRandomEmoji = (index) => {
    // Usar el índice para obtener un emoji consistente pero variado
    return brokenEmojis[index % brokenEmojis.length]
  }

  const getRandomCrackStyle = (index) => {
    const rotations = [15, -20, 25, -15, 30, -25, 10, -30]
    const heights = [35, 40, 45, 38, 42, 36, 44, 39]

    return {
      transform: `translate(-50%, -50%) rotate(${rotations[index % rotations.length]}deg)`,
      height: `${heights[index % heights.length]}px`,
    }
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
          {[...Array(24)].map((_, index) => (
            <div
              key={index}
              className={`gallery-item animate-fadeIn ${activeFaces.has(index) ? "active" : ""}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleFaceClick(index)}
            >
              <div className="gallery-face">
                <div
                  className="face-emoji"
                  style={{
                    filter: activeFaces.has(index) ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.7)",
                    transform: activeFaces.has(index) ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  {getRandomEmoji(index)}
                </div>
                <div className="face-crack" style={getRandomCrackStyle(index)}></div>
                {activeFaces.has(index) && (
                  <div
                    className="face-glow"
                    style={{
                      background: `radial-gradient(circle, ${["#ff4757", "#4834d4", "#74b9ff", "#a29bfe", "#636e72"][index % 5]}33 0%, transparent 70%)`,
                    }}
                  ></div>
                )}
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
