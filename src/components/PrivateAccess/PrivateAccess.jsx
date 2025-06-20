"use client"

import { useState } from "react"
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import MainPage from "../MainPage/MainPage"
import "./PrivateAccess.css"

const PrivateAccess = () => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { currentUser, login } = useAuth()

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

  // Si el usuario está autenticado, mostrar la página principal
  if (currentUser) {
    return <MainPage />
  }

  return (
    <div className="private-access">
      <div className="access-content animate-fadeIn">
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
