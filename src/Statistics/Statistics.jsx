"use client"

import { useState, useEffect } from "react"
import { FaClock, FaMusic, FaBlog, FaEye, FaHeart } from "react-icons/fa"
import { subscribeToBlogs } from "../../services/blogService"
import "./Statistics.css"

const Statistics = () => {
  const [stats, setStats] = useState({
    timeOnPage: 0,
    musicTime: 0,
    blogPosts: 0,
    visits: 0,
    sadMoments: 0,
  })

  useEffect(() => {
    // Cargar estadísticas guardadas
    const savedStats = localStorage.getItem("sadPageStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    // Incrementar visitas
    const currentStats = savedStats ? JSON.parse(savedStats) : stats
    const updatedStats = {
      ...currentStats,
      visits: currentStats.visits + 1,
    }
    setStats(updatedStats)
    localStorage.setItem("sadPageStats", JSON.stringify(updatedStats))

    // Contador de tiempo en página
    const startTime = Date.now()
    const interval = setInterval(() => {
      const currentTime = Math.floor((Date.now() - startTime) / 1000)
      setStats((prev) => {
        const newStats = {
          ...prev,
          timeOnPage: prev.timeOnPage + 1,
        }
        localStorage.setItem("sadPageStats", JSON.stringify(newStats))
        return newStats
      })
    }, 1000)

    // Suscribirse a los posts del blog para contar en tiempo real
    const unsubscribe = subscribeToBlogs((posts) => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          blogPosts: posts.length,
        }
        localStorage.setItem("sadPageStats", JSON.stringify(newStats))
        return newStats
      })
    })

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const statItems = [
    {
      icon: FaClock,
      label: "Tiempo en la página",
      value: formatTime(stats.timeOnPage),
      color: "#ff4757",
      description: "Tiempo total navegando",
    },
    {
      icon: FaMusic,
      label: "Tiempo escuchando música",
      value: formatTime(stats.musicTime),
      color: "#4834d4",
      description: "Melodías melancólicas",
    },
    {
      icon: FaBlog,
      label: "Posts escritos",
      value: stats.blogPosts,
      color: "#2ed573",
      description: "Pensamientos compartidos",
    },
    {
      icon: FaEye,
      label: "Visitas totales",
      value: stats.visits,
      color: "#ffa502",
      description: "Veces que has estado aquí",
    },
    {
      icon: FaHeart,
      label: "Momentos sad",
      value: Math.floor(stats.timeOnPage / 60) + stats.blogPosts * 5,
      color: "#ff6b7a",
      description: "Intensidad melancólica",
    },
  ]

  return (
    <div className="statistics-container animate-fadeIn">
      <h2 className="stats-title animate-slideIn">Mis Estadísticas Sad</h2>
      <p className="stats-subtitle">Un registro de mi melancolía digital</p>

      <div className="stats-grid">
        {statItems.map((item, index) => {
          const IconComponent = item.icon
          return (
            <div key={index} className="stat-card animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon-wrapper">
                <IconComponent className="stat-icon animate-pulse" style={{ color: item.color }} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value" style={{ color: item.color }}>
                  {item.value}
                </h3>
                <p className="stat-label">{item.label}</p>
                <span className="stat-description">{item.description}</span>
              </div>
              <div className="stat-glow" style={{ backgroundColor: item.color }}></div>
            </div>
          )
        })}
      </div>

      <div className="progress-section">
        <h3 className="progress-title">Progreso de Melancolía</h3>
        <div className="progress-bars">
          <div className="progress-item">
            <label>Nivel de Tristeza</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, (stats.timeOnPage / 3600) * 100)}%`,
                  backgroundColor: "#ff4757",
                }}
              ></div>
            </div>
            <span>{Math.min(100, Math.floor((stats.timeOnPage / 3600) * 100))}%</span>
          </div>

          <div className="progress-item">
            <label>Conexión Musical</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, (stats.musicTime / 1800) * 100)}%`,
                  backgroundColor: "#4834d4",
                }}
              ></div>
            </div>
            <span>{Math.min(100, Math.floor((stats.musicTime / 1800) * 100))}%</span>
          </div>

          <div className="progress-item">
            <label>Expresión Escrita</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, (stats.blogPosts / 10) * 100)}%`,
                  backgroundColor: "#2ed573",
                }}
              ></div>
            </div>
            <span>{Math.min(100, Math.floor((stats.blogPosts / 10) * 100))}%</span>
          </div>
        </div>
      </div>

      <div className="mood-tracker">
        <h3 className="mood-title">Estado de Ánimo Actual</h3>
        <div className="mood-indicator">
          <div className="mood-circle animate-heartbeat">
            <span className="mood-emoji">😔</span>
          </div>
          <p className="mood-text">Melancólicamente contemplativo</p>
        </div>
      </div>
    </div>
  )
}

export default Statistics
