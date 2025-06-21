"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import MainPage from "../MainPage/MainPage"
import "./PrivateAccess.css"

const PrivateAccess = () => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const { currentUser, login } = useAuth()
  const modalRef = useRef(null)
  const animationFrameRef = useRef(null)

  // Centrar el modal al cargar
  useEffect(() => {
    const centerModal = () => {
      const modalWidth = 400
      const modalHeight = 500
      setPosition({
        x: (window.innerWidth - modalWidth) / 2,
        y: (window.innerHeight - modalHeight) / 2,
      })
    }

    centerModal()
    window.addEventListener("resize", centerModal)
    return () => window.removeEventListener("resize", centerModal)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(password)
    } catch (error) {
      console.error("Error de login:", error)
      setError("Contraseña incorrecta. Acceso denegado.")
      setTimeout(() => setError(""), 3000)
    }

    setLoading(false)
  }

  // Función optimizada para actualizar posición
  const updatePosition = useCallback(
    (clientX, clientY) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const newX = Math.max(0, Math.min(window.innerWidth - 400, clientX - dragOffset.x))
        const newY = Math.max(0, Math.min(window.innerHeight - 500, clientY - dragOffset.y))
        setPosition({ x: newX, y: newY })
      })
    },
    [dragOffset],
  )

  const handleMouseDown = (e) => {
    // Solo permitir drag desde el header, no desde los inputs
    if (
      e.target.closest(".password-input-container") ||
      e.target.closest(".access-button") ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON"
    ) {
      return
    }

    e.preventDefault()
    setIsDragging(true)

    const rect = modalRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return
      e.preventDefault()
      updatePosition(e.clientX, e.clientY)
    },
    [isDragging, updatePosition],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Touch events para móvil
  const handleTouchStart = (e) => {
    if (
      e.target.closest(".password-input-container") ||
      e.target.closest(".access-button") ||
      e.target.tagName === "INPUT" ||
      e.target.tagName === "BUTTON"
    ) {
      return
    }

    e.preventDefault()
    setIsDragging(true)

    const touch = e.touches[0]
    const rect = modalRef.current.getBoundingClientRect()
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    })
  }

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      updatePosition(touch.clientX, touch.clientY)
    },
    [isDragging, updatePosition],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Event listeners globales optimizados
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      // Prevenir selección de texto durante el drag
      document.body.style.userSelect = "none"
      document.body.style.webkitUserSelect = "none"
    } else {
      // Restaurar selección de texto
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.body.style.userSelect = ""
      document.body.style.webkitUserSelect = ""
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Si el usuario está autenticado, mostrar la página principal
  if (currentUser) {
    return <MainPage />
  }

  return (
    <div className="private-access">
      <div className="access-background"></div>

      <div
        ref={modalRef}
        className={`access-content animate-fadeIn ${isDragging ? "dragging" : ""}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Header arrastrable */}
        <div className="access-header">
          <div className="drag-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="drag-hint">Arrastra para mover</p>
        </div>

        <div className="lock-icon animate-pulse">
          <FaLock />
        </div>

        <h1 className="access-title">Acceso Restringido</h1>
        <p className="access-message">Esta página es privada y solo visible para su propietario.</p>

        <form onSubmit={handleSubmit} className="access-form">
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de acceso"
              className="password-input"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="access-button animate-pulse" disabled={loading}>
            {loading ? "Verificando..." : "Acceder"}
          </button>
        </form>

        {error && <div className="error-message animate-fadeIn">{error}</div>}
      </div>
    </div>
  )
}

export default PrivateAccess
