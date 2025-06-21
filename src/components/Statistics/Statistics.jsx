"use client"

import { useState, useEffect } from "react"
import { FaClock, FaMusic, FaBlog, FaEye, FaHeart, FaTrophy, FaStar, FaRocket } from "react-icons/fa"
import { subscribeToBlogs } from "../../services/blogService"
import "./Statistics.css"

const Statistics = () => {
  const [stats, setStats] = useState({
    timeOnPage: 0,
    musicTime: 0,
    blogPosts: 0,
    visits: 0,
    sadMoments: 0,
    // Niveles completados
    sadnessLevel: 0,
    musicLevel: 0,
    writingLevel: 0,
  })
  const [achievements, setAchievements] = useState([])
  const [showAchievement, setShowAchievement] = useState(null)

  // Niveles de logros para Expresión Escrita
  const writingMilestones = [10, 25, 50, 100, 130, 160, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]

  // Logros para cada nivel
  const writingAchievements = {
    10: { title: "Primer Escritor", description: "Has escrito tus primeros 10 posts", icon: "✍️", color: "#2ed573" },
    25: { title: "Cronista Novato", description: "25 posts de pura melancolía", icon: "📝", color: "#3742fa" },
    50: { title: "Narrador Triste", description: "50 historias del alma", icon: "📖", color: "#f368e0" },
    100: {
      title: "Escritor del Corazón",
      description: "100 posts de sentimientos profundos",
      icon: "💙",
      color: "#00d2d3",
    },
    130: { title: "Poeta de Sombras", description: "130 versos melancólicos", icon: "🌙", color: "#5f27cd" },
    160: { title: "Maestro de Palabras", description: "160 posts llenos de emoción", icon: "🎭", color: "#ff6b6b" },
    200: { title: "Guardián de Memorias", description: "200 recuerdos plasmados", icon: "🕯️", color: "#feca57" },
    250: { title: "Arquitecto de Emociones", description: "250 construcciones del alma", icon: "🏗️", color: "#48dbfb" },
    300: { title: "Alquimista de Letras", description: "300 transformaciones poéticas", icon: "⚗️", color: "#ff9ff3" },
    400: { title: "Señor de las Palabras", description: "400 dominios literarios", icon: "👑", color: "#54a0ff" },
    500: { title: "Emperador Melancólico", description: "500 imperios de tristeza", icon: "🏰", color: "#5f27cd" },
    600: { title: "Dios de la Escritura", description: "600 creaciones divinas", icon: "⚡", color: "#ff6348" },
    700: { title: "Titán Literario", description: "700 obras titánicas", icon: "🌟", color: "#2ed573" },
    800: { title: "Leyenda Viviente", description: "800 leyendas escritas", icon: "🔥", color: "#ff4757" },
    900: { title: "Inmortal de Palabras", description: "900 inmortalizaciones", icon: "💎", color: "#3742fa" },
    1000: {
      title: "MAESTRO SUPREMO",
      description: "¡1000 POSTS! ¡ERES UNA LEYENDA ABSOLUTA!",
      icon: "🚀",
      color: "#ffd700",
    },
  }

  // Función para obtener color del progreso de escritura
  const getWritingProgressColor = (current, next) => {
    const colors = [
      "#2ed573", // Verde
      "#3742fa", // Azul
      "#f368e0", // Rosa
      "#00d2d3", // Cyan
      "#5f27cd", // Morado
      "#ff6b6b", // Rojo claro
      "#feca57", // Amarillo
      "#48dbfb", // Azul claro
      "#ff9ff3", // Rosa claro
      "#54a0ff", // Azul medio
    ]

    const progressIndex = Math.floor((current / (next || 100)) * colors.length)
    return colors[Math.min(progressIndex, colors.length - 1)]
  }

  // Función para obtener color del nivel
  const getLevelColor = (level, type) => {
    if (level === 0) return "#666"

    const colors = {
      sadness: [
        "#ff4757", // 1-5: rojo
        "#ff4757",
        "#ff4757",
        "#ff4757",
        "#ff4757",
        "#ff6b7a", // 6: rosa
        "#4834d4", // 7: morado
        "#00d2d3", // 8: cyan
        "#2ed573", // 9: verde
        "#feca57", // 10: amarillo
        "#ff9ff3", // 11: rosa claro
        "#54a0ff", // 12: azul
        "#5f27cd", // 13: morado oscuro
        "#ff6348", // 14: naranja
        "#48dbfb", // 15: azul claro
      ],
      music: [
        "#ff4757", // 1-5: rojo
        "#ff4757",
        "#ff4757",
        "#ff4757",
        "#ff4757",
        "#4834d4", // 6: morado
        "#00d2d3", // 7: cyan
        "#2ed573", // 8: verde
        "#feca57", // 9: amarillo
        "#ff9ff3", // 10: rosa claro
        "#54a0ff", // 11: azul
        "#5f27cd", // 12: morado oscuro
        "#ff6348", // 13: naranja
        "#48dbfb", // 14: azul claro
        "#a29bfe", // 15: lavanda
      ],
    }

    const colorArray = colors[type] || colors.sadness
    return colorArray[Math.min(level - 1, colorArray.length - 1)] || "#ff4757"
  }

  useEffect(() => {
    // Cargar estadísticas guardadas
    const savedStats = localStorage.getItem("sadPageStats")
    if (savedStats) {
      const currentStats = JSON.parse(savedStats)

      // Calcular niveles actuales basados en el tiempo
      const currentSadnessLevel = Math.floor(currentStats.timeOnPage / 3600)
      const currentMusicLevel = Math.floor(currentStats.musicTime / 1800)

      const updatedStats = {
        ...currentStats,
        visits: currentStats.visits + 1,
        sadnessLevel: Math.max(currentStats.sadnessLevel || 0, currentSadnessLevel),
        musicLevel: Math.max(currentStats.musicLevel || 0, currentMusicLevel),
      }

      setStats(updatedStats)
      localStorage.setItem("sadPageStats", JSON.stringify(updatedStats))
    } else {
      // Incrementar visitas
      const currentStats = savedStats ? JSON.parse(savedStats) : stats
      const updatedStats = {
        ...currentStats,
        visits: currentStats.visits + 1,
      }
      setStats(updatedStats)
      localStorage.setItem("sadPageStats", JSON.stringify(updatedStats))
    }

    // Contador de tiempo en página
    const startTime = Date.now()
    const interval = setInterval(() => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          timeOnPage: prev.timeOnPage + 1,
        }
        localStorage.setItem("sadPageStats", JSON.stringify(newStats))

        // Verificar logros
        checkAchievements(newStats)

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

        // Verificar logros cuando cambian los posts
        checkAchievements(newStats)

        return newStats
      })
    })

    // Escuchar eventos de música - MEJORADO
    const handleMusicTime = () => {
      setStats((prev) => {
        const newStats = {
          ...prev,
          musicTime: prev.musicTime + 1,
        }
        localStorage.setItem("sadPageStats", JSON.stringify(newStats))
        checkAchievements(newStats)
        return newStats
      })
    }

    // Agregar listener personalizado para tiempo de música
    window.addEventListener("musicPlaying", handleMusicTime)

    return () => {
      clearInterval(interval)
      unsubscribe()
      window.removeEventListener("musicPlaying", handleMusicTime)
    }
  }, [])

  const checkAchievements = (currentStats) => {
    const newAchievements = []

    // Verificar logros de Expresión Escrita
    const currentWritingMilestone = getCurrentMilestone(currentStats.blogPosts, writingMilestones)
    if (currentWritingMilestone && currentStats.blogPosts >= currentWritingMilestone) {
      const achievementKey = `writing_${currentWritingMilestone}`
      if (!achievements.find((a) => a.id === achievementKey)) {
        const achievement = {
          id: achievementKey,
          ...writingAchievements[currentWritingMilestone],
          isSpecial: currentWritingMilestone === 1000,
        }
        newAchievements.push(achievement)

        // Actualizar nivel de escritura
        setStats((prev) => ({
          ...prev,
          writingLevel: prev.writingLevel + 1,
        }))
      }
    }

    // Verificar logros de Nivel de Tristeza (cada 1 hora = 100%)
    const sadnessHours = Math.floor(currentStats.timeOnPage / 3600)
    if (sadnessHours > currentStats.sadnessLevel) {
      const achievementKey = `sadness_${sadnessHours}`
      if (!achievements.find((a) => a.id === achievementKey)) {
        newAchievements.push({
          id: achievementKey,
          title: `Maestro de la Melancolía Nivel ${sadnessHours}`,
          description: `Has completado ${sadnessHours} hora${sadnessHours > 1 ? "s" : ""} de tristeza profunda`,
          icon: "😭",
          color: getLevelColor(sadnessHours, "sadness"),
        })
      }

      // Actualizar nivel de tristeza INMEDIATAMENTE
      setStats((prev) => {
        const updatedStats = {
          ...prev,
          sadnessLevel: sadnessHours,
        }
        localStorage.setItem("sadPageStats", JSON.stringify(updatedStats))
        return updatedStats
      })
    }

    // Verificar logros de Conexión Musical (cada 30 min = 100%)
    const musicSessions = Math.floor(currentStats.musicTime / 1800)
    if (musicSessions > currentStats.musicLevel) {
      const achievementKey = `music_${musicSessions}`
      if (!achievements.find((a) => a.id === achievementKey)) {
        newAchievements.push({
          id: achievementKey,
          title: `Alma Musical Nivel ${musicSessions}`,
          description: `Has completado ${musicSessions} sesión${musicSessions > 1 ? "es" : ""} de música melancólica`,
          icon: "🎵",
          color: getLevelColor(musicSessions, "music"),
        })
      }

      // Actualizar nivel de música INMEDIATAMENTE
      setStats((prev) => {
        const updatedStats = {
          ...prev,
          musicLevel: musicSessions,
        }
        localStorage.setItem("sadPageStats", JSON.stringify(updatedStats))
        return updatedStats
      })
    }

    // Mostrar logros nuevos
    newAchievements.forEach((achievement) => {
      showAchievementModal(achievement)
      setAchievements((prev) => [...prev, achievement])
    })
  }

  const getCurrentMilestone = (current, milestones) => {
    return milestones.find(
      (milestone) =>
        current >= milestone && current < (milestones[milestones.indexOf(milestone) + 1] || Number.POSITIVE_INFINITY),
    )
  }

  const getNextMilestone = (current, milestones) => {
    return milestones.find((milestone) => current < milestone)
  }

  const showAchievementModal = (achievement) => {
    setShowAchievement(achievement)
    setTimeout(
      () => {
        setShowAchievement(null)
      },
      achievement.isSpecial ? 8000 : 4000,
    ) // 8 segundos para el logro de 1000
  }

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

  const getMoodByProgress = () => {
    // Calcular progreso actual de cada barra (con reinicio)
    const sadnessProgress = Math.min(100, ((stats.timeOnPage % 3600) / 3600) * 100)
    const musicProgress = Math.min(100, ((stats.musicTime % 1800) / 1800) * 100)

    // Para escritura, calcular progreso hacia el siguiente milestone
    const nextWritingMilestone = getNextMilestone(stats.blogPosts, writingMilestones)
    const prevWritingMilestone = getCurrentMilestone(stats.blogPosts, writingMilestones) || 0
    const writingProgress = nextWritingMilestone
      ? Math.min(100, ((stats.blogPosts - prevWritingMilestone) / (nextWritingMilestone - prevWritingMilestone)) * 100)
      : 100

    const averageProgress = (sadnessProgress + musicProgress + writingProgress) / 3

    if (averageProgress >= 90) return { emoji: "🖤", text: "Profundamente melancólico", color: "#000" }
    if (averageProgress >= 70) return { emoji: "😔", text: "Intensamente contemplativo", color: "#4834d4" }
    if (averageProgress >= 50) return { emoji: "😢", text: "Melancólicamente reflexivo", color: "#ff4757" }
    if (averageProgress >= 30) return { emoji: "🥺", text: "Suavemente nostálgico", color: "#ffa502" }
    return { emoji: "😌", text: "Comenzando el viaje sad", color: "#2ed573" }
  }

  const currentMood = getMoodByProgress()

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

  // Calcular progreso con reinicio
  const sadnessProgress = Math.min(100, ((stats.timeOnPage % 3600) / 3600) * 100)
  const musicProgress = Math.min(100, ((stats.musicTime % 1800) / 1800) * 100)

  const nextWritingMilestone = getNextMilestone(stats.blogPosts, writingMilestones)
  const prevWritingMilestone = getCurrentMilestone(stats.blogPosts, writingMilestones) || 0
  const writingProgress = nextWritingMilestone
    ? Math.min(100, ((stats.blogPosts - prevWritingMilestone) / (nextWritingMilestone - prevWritingMilestone)) * 100)
    : 100

  return (
    <div className="statistics-container animate-fadeIn">
      <h2 className="stats-title animate-slideIn">Mis Estadísticas Sad</h2>
      <p className="stats-subtitle">Un registro de mi melancolía digital</p>

      {/* Modal de logro */}
      {showAchievement && (
        <div className={`achievement-modal animate-fadeIn ${showAchievement.isSpecial ? "special-achievement" : ""}`}>
          <div className="achievement-content" style={{ borderColor: showAchievement.color }}>
            <div className="achievement-icon" style={{ color: showAchievement.color }}>
              <FaTrophy />
            </div>
            <div className="achievement-emoji">{showAchievement.icon}</div>
            <h3 style={{ color: showAchievement.color }}>{showAchievement.title}</h3>
            <p>{showAchievement.description}</p>
            {showAchievement.isSpecial && (
              <div className="fireworks">
                <FaRocket className="rocket rocket-1" />
                <FaRocket className="rocket rocket-2" />
                <FaRocket className="rocket rocket-3" />
                <FaStar className="star star-1" />
                <FaStar className="star star-2" />
                <FaStar className="star star-3" />
                <FaStar className="star star-4" />
                <FaStar className="star star-5" />
              </div>
            )}
            <div className="achievement-sparkles">
              <FaStar className="sparkle sparkle-1" />
              <FaStar className="sparkle sparkle-2" />
              <FaStar className="sparkle sparkle-3" />
            </div>
          </div>
        </div>
      )}

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
            <label>
              Nivel de Tristeza{" "}
              <span className="level-badge" style={{ color: getLevelColor(stats.sadnessLevel, "sadness") }}>
                (Nivel {stats.sadnessLevel})
              </span>
            </label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${sadnessProgress}%`,
                  backgroundColor: getLevelColor(stats.sadnessLevel, "sadness"),
                }}
              ></div>
            </div>
            <span>{Math.floor(sadnessProgress)}%</span>
          </div>

          <div className="progress-item">
            <label>
              Conexión Musical{" "}
              <span className="level-badge" style={{ color: getLevelColor(stats.musicLevel, "music") }}>
                (Nivel {stats.musicLevel})
              </span>
            </label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${musicProgress}%`,
                  backgroundColor: getLevelColor(stats.musicLevel, "music"),
                }}
              ></div>
            </div>
            <span>{Math.floor(musicProgress)}%</span>
          </div>

          <div className="progress-item">
            <label>
              Expresión Escrita{" "}
              <span
                className="progress-badge"
                style={{
                  color: getWritingProgressColor(stats.blogPosts, nextWritingMilestone),
                  textShadow: `0 0 10px ${getWritingProgressColor(stats.blogPosts, nextWritingMilestone)}`,
                }}
              >
                ({stats.blogPosts}/{nextWritingMilestone || "∞"})
              </span>
            </label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${writingProgress}%`,
                  backgroundColor: getWritingProgressColor(stats.blogPosts, nextWritingMilestone),
                }}
              ></div>
            </div>
            <span>{Math.floor(writingProgress)}%</span>
          </div>
        </div>
      </div>

      <div className="mood-tracker">
        <h3 className="mood-title">Estado de Ánimo Actual</h3>
        <div className="mood-indicator">
          <div className="mood-circle animate-heartbeat" style={{ borderColor: currentMood.color }}>
            <span className="mood-emoji">{currentMood.emoji}</span>
          </div>
          <p className="mood-text" style={{ color: currentMood.color }}>
            {currentMood.text}
          </p>
        </div>
      </div>

      {/* Debug info - temporal para verificar que funciona */}
      <div
        className="debug-info"
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "10px",
          fontSize: "0.8rem",
          color: "#666",
        }}
      >
        <p>
          🎵 Tiempo música: {stats.musicTime}s | Nivel música: {stats.musicLevel}
        </p>
        <p>
          😢 Tiempo página: {stats.timeOnPage}s | Nivel tristeza: {stats.sadnessLevel}
        </p>
        <p>
          📝 Posts: {stats.blogPosts} | Nivel escritura: {stats.writingLevel}
        </p>
      </div>
    </div>
  )
}

export default Statistics
