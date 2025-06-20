"use client"

import { useState } from "react"
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import "./PrivateAccess.css"

const PrivateAccess = ({ onAccessGranted }) => {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Hash simple para ofuscar la contraseña (no es 100% seguro pero mejor que texto plano)
  const hashPassword = (pass) => {
    let hash = 0
    for (let i = 0; i < pass.length; i++) {
      const char = pass.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convertir a 32bit integer
    }
    return hash.toString()
  }

  const correctPasswordHash = "-1789986012" // Hash de "sadlife2024"

  const handleSubmit = (e) => {
    e.preventDefault()
    const inputHash = hashPassword(password)

    if (inputHash === correctPasswordHash) {
      onAccessGranted()
    } else {
      setError("Acceso denegado. Solo el propietario puede ver esta página.")
      setTimeout(() => setError(""), 3000)
    }
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
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="access-button animate-pulse">
            Acceder
          </button>
        </form>

        {error && <div className="error-message animate-fadeIn">{error}</div>}
      </div>
    </div>
  )
}

export default PrivateAccess
