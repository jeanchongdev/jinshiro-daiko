"use client"

import { useState, useRef, useEffect } from "react"
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo } from "react-icons/fa"
import "./MusicPlayer.css"

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [currentSong, setCurrentSong] = useState(0)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 200,
    y: window.innerHeight / 2 - 200,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const audioRef = useRef(null)
  const playerRef = useRef(null)

  // Lista de canciones sad (URLs de ejemplo - reemplazar con tus archivos)
  const songs = [
    {
      title: "You Can Be King Again",
      artist: "Jinshirō Daikō",
      src: "/audio/you.mp3", // Reemplazar con tu archivo
      cover: "https://i.postimg.cc/Y9QT7s35/J.png",
    },
    {
      title: "XXXTENTACION - numb",
      artist: "Jinshirō Daikō",
      src: "/audio/numb.mp3", // Reemplazar con tu archivo
      cover: "https://i.postimg.cc/Y9QT7s35/J.png",
    },
    {
      title: "Coyote Theory - This Side of Paradise",
      artist: "Jinshirō Daikō",
      src: "/audio/coyote.mp3", // Reemplazar con tu archivo
      cover: "https://i.postimg.cc/Y9QT7s35/J.png",
    },
  ]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleNext)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleNext)
    }
  }, [currentSong])

  const togglePlay = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (isShuffling) {
      setCurrentSong(Math.floor(Math.random() * songs.length))
    } else {
      setCurrentSong((prev) => (prev + 1) % songs.length)
    }
  }

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length)
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * duration
  }

  const handleVolumeChange = (e) => {
    e.stopPropagation() // Prevenir que se mueva el reproductor
    const newVolume = e.target.value
    setVolume(newVolume)
    audioRef.current.volume = newVolume
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleMouseDown = (e) => {
    // Prevenir drag si se hace clic en controles interactivos
    if (
      e.target.closest(".player-controls") ||
      e.target.closest(".volume-container") ||
      e.target.closest(".progress-bar") ||
      e.target.closest(".minimize-btn")
    ) {
      return
    }

    setIsDragging(true)

    const rect = playerRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    const handleMouseMove = (e) => {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 300, e.clientY - offsetY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Eventos touch para móvil
  const handleTouchStart = (e) => {
    // Prevenir drag si se toca en controles interactivos
    if (
      e.target.closest(".player-controls") ||
      e.target.closest(".volume-container") ||
      e.target.closest(".progress-bar") ||
      e.target.closest(".minimize-btn")
    ) {
      return
    }

    setIsDragging(true)

    const touch = e.touches[0]
    const rect = playerRef.current.getBoundingClientRect()
    const offsetX = touch.clientX - rect.left
    const offsetY = touch.clientY - rect.top

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 400, touch.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 300, touch.clientY - offsetY)),
      })
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)
  }

  return (
    <div className="music-player-container animate-fadeIn">
      <div
        ref={playerRef}
        className={`music-player ${isMinimized ? "minimized" : ""} ${isDragging ? "dragging" : ""}`}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1000,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <audio ref={audioRef} src={songs[currentSong].src} loop={isRepeating} />

        <div className="player-header">
          <h3>Reproductor Sad</h3>
          <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? "□" : "−"}
          </button>
        </div>

        {!isMinimized && (
          <>
            <div className="album-art animate-pulse">
              <img src={songs[currentSong].cover || "/placeholder.svg"} alt="Album Cover" />
              <div className="vinyl-effect"></div>
            </div>

            <div className="song-info">
              <h4 className="song-title">{songs[currentSong].title}</h4>
              <p className="song-artist">{songs[currentSong].artist}</p>
            </div>

            <div className="progress-container">
              <span className="time-display">{formatTime(currentTime)}</span>
              <div className="progress-bar" onClick={handleSeek}>
                <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
              </div>
              <span className="time-display">{formatTime(duration)}</span>
            </div>

            <div className="player-controls">
              <button
                className={`control-btn ${isShuffling ? "active" : ""}`}
                onClick={() => setIsShuffling(!isShuffling)}
              >
                <FaRandom />
              </button>
              <button className="control-btn" onClick={handlePrevious}>
                <FaStepBackward />
              </button>
              <button className="play-btn animate-pulse" onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="control-btn" onClick={handleNext}>
                <FaStepForward />
              </button>
              <button
                className={`control-btn ${isRepeating ? "active" : ""}`}
                onClick={() => setIsRepeating(!isRepeating)}
              >
                <FaRedo />
              </button>
            </div>

            <div className="volume-container">
              <FaVolumeUp className="volume-icon" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="volume-slider"
              />
            </div>
          </>
        )}
      </div>

      <div className="playlist-section">
        <h2 className="section-title animate-slideIn">Mi Playlist Sad</h2>
        <div className="playlist">
          {songs.map((song, index) => (
            <div
              key={index}
              className={`playlist-item ${index === currentSong ? "active" : ""} animate-fadeIn`}
              onClick={() => setCurrentSong(index)}
            >
              <img src={song.cover || "/placeholder.svg"} alt={song.title} className="playlist-cover" />
              <div className="playlist-info">
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
              </div>
              {index === currentSong && isPlaying && (
                <div className="playing-indicator">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer
