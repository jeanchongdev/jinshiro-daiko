"use client"

import { useState } from "react"
import { FaTimes, FaKey, FaSave } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import "./PasswordManager.css"

const PasswordManager = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const { changePassword, logout } = useAuth()

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      setError("")
      setLoading(true)

      await changePassword(currentPassword, newPassword)

      setMessage("¡Contraseña cambiada exitosamente! Cerrando sesión...")

      // Cerrar sesión después de cambiar contraseña
      setTimeout(async () => {
        await logout()
        handleClose()
      }, 2000)
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      setError("Error al cambiar contraseña. Verifica tu contraseña actual.")
    }

    setLoading(false)
  }

  return (
    <div className="password-manager-overlay">
      <div className={`password-manager ${isClosing ? "closing" : ""} animate-fadeIn`}>
        <div className="manager-header">
          <h3>
            <FaKey /> Cambiar Contraseña
          </h3>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="input-group">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            <FaSave /> {loading ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
      </div>
    </div>
  )
}

export default PasswordManager
