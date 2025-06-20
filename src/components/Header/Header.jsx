"use client"

import { useState } from "react"
import { FaBars, FaTimes, FaMusic, FaBlog, FaSadTear, FaChartBar, FaHome, FaCog, FaLock } from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import "./Header.css"

const Header = ({ activeSection, setActiveSection, onShowPasswordManager }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { logout } = useAuth()

  const menuItems = [
    { id: "home", label: "Inicio", icon: FaHome },
    { id: "music", label: "Música Sad", icon: FaMusic },
    { id: "blog", label: "Blog Personal", icon: FaBlog },
    { id: "faces", label: "Caras Rotas", icon: FaSadTear },
    { id: "stats", label: "Estadísticas", icon: FaChartBar },
  ]

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId)
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const handleSettings = () => {
    onShowPasswordManager()
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo animate-pulse">
          <h2>Jinshirō Daikō</h2>
          <span>神志郎 大晃</span>
        </div>

        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.id} className="nav-item">
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                  >
                    <IconComponent className="nav-icon" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}

            {/* Separador visual */}
            <li className="nav-separator"></li>

            {/* Botones de configuración y logout */}
            <li className="nav-item">
              <button onClick={handleSettings} className="nav-link settings-link" title="Cambiar Contraseña">
                <FaCog className="nav-icon" />
                <span>Configuración</span>
              </button>
            </li>

            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link logout-link" title="Cerrar Sesión">
                <FaLock className="nav-icon" />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </nav>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  )
}

export default Header
