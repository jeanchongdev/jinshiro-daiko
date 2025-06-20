"use client"

import { useState } from "react"
import { FaBars, FaTimes, FaMusic, FaBlog, FaSadTear, FaChartBar, FaHome } from "react-icons/fa"
import "./Header.css"

const Header = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
