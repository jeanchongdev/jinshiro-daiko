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
  const [isInitialLoad, setIsInitialLoad] = useState(true) // 🎵 NUEVO: Para distinguir carga inicial

  const audioRef = useRef(null)
  const playerRef = useRef(null)
  const musicTimerRef = useRef(null)

  // Lista de canciones sad (URLs de ejemplo - reemplazar con tus archivos)
  const songs = [
    {
      title: "You Can Be King Again",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/you.mp3",
      cover: "https://i.postimg.cc/Y9QT7s35/J.png",
    },
    {
      title: "XXXTENTACION - numb",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/numb.mp3",
      cover: "https://i.postimg.cc/Y9QT7s35/J.png",
    },
    {
      title: "Coyote Theory - This Side of Paradise",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/coyote.mp3",
      cover: "https://i.postimg.cc/Y9QT7s35/J.png",
    },
    // Agrega más canciones aqui------------------------------------------
    {
      title: "everything works out in the end",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/1-everything%20works%20out%20in%20the%20end.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Lonely - Akon",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/2-Lonely%20-%20Akon.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Until I Found You",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/3-Until%20I%20Found%20You.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Yung kai - blue",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/4-yung%20kai%20-%20blue.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "In the back of my mind",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/5-in%20the%20back%20of%20my%20mind.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Fasetya - Someone To You",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/6-Fasetya%20-%20Someone%20To%20You.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Conan Gray - Heather",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/7-Conan%20Gray%20-%20Heather.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "DIE WITH A SMILE",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/8-DIE%20WITH%20A%20SMILE.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Blackbear",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/9-Blackbear.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "YouTube",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/10-YouTube.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },

    // Agrega más canciones aqui------------------------------------------

    {
      title: "Billie Eilish",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/11-Billie%20Eilish.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Here With Me",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/12-d4vd%20-%20Here%20With%20Me.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Christina perri",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/13-christina%20perri%20-%20a%20thousand%20years.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "This is how it feels",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/14-d4vd%20-%20this%20is%20how%20it%20feels.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "You look lonely",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/15-you%20look%20lonely%20i%20can%20fix%20that.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Cry - Cigarettes after sex",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/16-Cry%20-%20Cigarettes%20after%20sex.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Sapientdream - Pastlives",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/17-sapientdream%20-%20Pastlives.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Cardigan - Taylor Swift",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/18-Cardigan%20-%20Taylor%20Swift.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Harry Styles - As It Was",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/19-Harry%20Styles%20-%20As%20It%20Was.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Ozuna - Te Vas",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/20-Ozuna%20-%20Te%20Vas.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },

    // Agrega más canciones aqui------------------------------------------

    {
      title: "Ozuna x Romeo Santos",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/21-Ozuna%20x%20Romeo%20Santos%20-%20El%20Farsante.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "Plan B - Es Un Secreto",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/22-Plan%20B%20-%20Es%20Un%20Secreto.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "Tu Foto",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/23-Tu%20Foto.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "El Amor Que Perdimos",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/24-Prince%20Royce%20-%20El%20Amor%20Que%20Perdimos.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "La Carretera",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/25-Prince%20Royce%20-%20La%20Carretera.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "Aventura - Enseñame A Olvidar",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/26-Aventura%20-%20Ensen%CC%83ame%20A%20Olvidar.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "BAD BUNNY - AMORFODA",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/27-BAD%20BUNNY%20-%20AMORFODA.mp3",
      cover: "https://i.postimg.cc/G2CW8YKs/oie-2021833-Pq-HZoa3k.gif",
    },
    {
      title: "Inolvidable",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/28-Beele%20&%20Ovy%20On%20The%20Drums%20-%20Inolvidable.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "BERET - OJALA",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/29-BERET%20-%20OJALA.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Yo Te Esperare",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/30-Cali%20Y%20El%20Dandee%20-%20Yo%20Te%20Esperare.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },

    // Agrega más canciones aqui------------------------------------------

    {
      title: "El Perdedor",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/31-Enrique%20Iglesias%20-%20El%20Perdedor.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Dile Que Tu Me Quieres",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/32-Ozuna%20-%20Dile%20Que%20Tu%20Me%20Quieres.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Algo Me Gusta De Ti",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/33-Algo%20Me%20Gusta%20De%20Ti.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Vuelve",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/34-Sebastian%20Yatra%20Beret%20-%20Vuelve.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Darte un Beso",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/35-Prince%20Royce%20-%20Darte%20un%20Beso.mp3",
      cover: "https://i.postimg.cc/RhFSv272/Happy.gif",
    },
    {
      title: "Llevame Contigo",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/36-Romeo%20Santos%20-%20Llevame%20Contigo.mp3",
      cover: "https://i.postimg.cc/RhFSv272/Happy.gif",
    },
    {
      title: "Donde Estan Corazon",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/37-Enrique%20Iglesias%20-%20Donde%20Estan%20Corazon.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Estoy Enamorado",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/38-Wisin%20&%20Yandel%20-%20Estoy%20Enamorado.mp3",
      cover: "https://i.postimg.cc/RhFSv272/Happy.gif",
    },
    {
      title: "No te importo",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/39-No%20te%20importo%20-%20Neztor%20MVL.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "Reik - Creo en Ti",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/40-Reik%20-%20Creo%20en%20Ti.mp3",
      cover: "https://i.postimg.cc/RhFSv272/Happy.gif",
    },

    // Agrega más canciones aqui------------------------------------------

    {
      title: "Cosculluela - La Boda",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/41-Cosculluela%20-%20La%20Boda.mp3",
      cover: "https://i.postimg.cc/RhFSv272/Happy.gif",
    },
    {
      title: "Eres Mia",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/42-Romeo%20Santos%20-%20Eres%20Mia.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Enrique Iglesias - Bailando",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/43-Enrique%20Iglesias%20-%20Bailando.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Por Perro",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/44-Por%20Perro.mp3",
      cover: "https://i.postimg.cc/zB69VbPS/cry-menhera.gif",
    },
    {
      title: "Corazon de Seda",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/45-Ozuna%20-%20Corazon%20de%20Seda.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Me enamore de la persona equivocada",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/46-Me%20enamore%20de%20la%20persona%20equivocada.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },
    {
      title: "La Diabla_Mi Santa",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/47-Romeo%20Santos%20-%20La%20Diabla_Mi%20Santa.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "No Tiene La Culpa",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/48-Romeo%20Santos%20-%20No%20Tiene%20La%20Culpa.mp3",
      cover: "https://i.postimg.cc/0NWk7V6J/oie-202131776g7u-Oa.gif",
    },
    {
      title: "Como Estrellas",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/49-LA%20YounG%20-%20Como%20Estrellas.mp3",
      cover: "https://i.postimg.cc/RhFSv272/Happy.gif",
    },
    {
      title: "LLORE.. POR TI",
      artist: "Jinshirō Daikō",
      src: "https://github.com/ryuseishouda/audio/raw/refs/heads/main/50-LLORE..%20POR%20TI.mp3",
      cover: "https://i.postimg.cc/Dwh3rGfx/chibi-yhad.gif",
    },

    // Agrega más canciones aqui------------------------------------------

    

  ]

  // 🎵 CARGA INICIAL: Solo al cargar la página
  useEffect(() => {
    const savedPlayerState = localStorage.getItem("sadMusicPlayerState")
    if (savedPlayerState) {
      const playerState = JSON.parse(savedPlayerState)
      setCurrentSong(playerState.currentSong || 0)
      setVolume(playerState.volume || 0.7)
      setIsShuffling(playerState.isShuffling || false)
      setIsRepeating(playerState.isRepeating || false)
      setPosition(
        playerState.position || {
          x: window.innerWidth / 2 - 200,
          y: window.innerHeight / 2 - 200,
        },
      )
      setIsMinimized(playerState.isMinimized || false)
    }
  }, [])

  // 🎵 RESTAURAR TIEMPO: Solo en la carga inicial
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedData = () => {
      // Solo restaurar tiempo si es la carga inicial de la página
      if (isInitialLoad) {
        const savedPlayerState = localStorage.getItem("sadMusicPlayerState")
        if (savedPlayerState) {
          const playerState = JSON.parse(savedPlayerState)

          // Restaurar tiempo de reproducción solo si es la misma canción
          if (playerState.currentTime && playerState.currentTime > 0 && playerState.currentSong === currentSong) {
            audio.currentTime = playerState.currentTime
            setCurrentTime(playerState.currentTime)
            console.log("🔄 Restaurando desde:", formatTime(playerState.currentTime))
          }

          // Restaurar estado de reproducción
          if (playerState.wasPlaying) {
            const playPromise = audio.play()
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsPlaying(true)
                  console.log("▶️ Música restaurada y reproduciendo")
                })
                .catch((error) => {
                  console.log("Error al restaurar reproducción:", error)
                  setIsPlaying(false)
                })
            }
          }
        }
        // Marcar que ya no es carga inicial
        setIsInitialLoad(false)
      } else {
        // Si no es carga inicial (cambio de canción), empezar desde 0
        audio.currentTime = 0
        setCurrentTime(0)
        console.log("🎵 Nueva canción, empezando desde 0")
      }
    }

    audio.addEventListener("loadeddata", handleLoadedData)

    return () => {
      audio.removeEventListener("loadeddata", handleLoadedData)
    }
  }, [currentSong, isInitialLoad])

  // 🎵 GUARDAR ESTADO: Cada 2 segundos
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const playerState = {
        currentSong,
        currentTime: audioRef.current?.currentTime || 0,
        wasPlaying: isPlaying,
        volume,
        isShuffling,
        isRepeating,
        position,
        isMinimized,
        lastSaved: Date.now(),
      }

      localStorage.setItem("sadMusicPlayerState", JSON.stringify(playerState))
    }, 2000)

    return () => clearInterval(saveInterval)
  }, [currentSong, isPlaying, volume, isShuffling, isRepeating, position, isMinimized])

  // 🎵 GUARDAR AL CERRAR: Antes de cerrar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      const playerState = {
        currentSong,
        currentTime: audioRef.current?.currentTime || 0,
        wasPlaying: isPlaying,
        volume,
        isShuffling,
        isRepeating,
        position,
        isMinimized,
        lastSaved: Date.now(),
      }

      localStorage.setItem("sadMusicPlayerState", JSON.stringify(playerState))
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [currentSong, isPlaying, volume, isShuffling, isRepeating, position, isMinimized])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleNext)

    // Configurar volumen desde el estado
    audio.volume = volume

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleNext)
    }
  }, [currentSong, volume])

  // 🎵 CONTADOR DE MÚSICA: Para estadísticas
  useEffect(() => {
    if (musicTimerRef.current) {
      clearInterval(musicTimerRef.current)
      musicTimerRef.current = null
    }

    if (isPlaying) {
      console.log("🎵 Iniciando contador de música")
      musicTimerRef.current = setInterval(() => {
        const event = new CustomEvent("musicPlaying", {
          detail: {
            isPlaying: true,
            currentTime: audioRef.current?.currentTime || 0,
            song: songs[currentSong]?.title || "Unknown",
          },
        })
        window.dispatchEvent(event)
      }, 1000)
    } else {
      console.log("⏸️ Pausando contador de música")
    }

    return () => {
      if (musicTimerRef.current) {
        clearInterval(musicTimerRef.current)
        musicTimerRef.current = null
      }
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    return () => {
      if (musicTimerRef.current) {
        clearInterval(musicTimerRef.current)
      }
    }
  }, [])

  // 🎵 AUTO-REPRODUCIR: Solo si estaba reproduciendo antes del cambio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isInitialLoad) return

    // Si estaba reproduciendo, continuar reproduciendo la nueva canción
    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Error al reproducir:", error)
          setIsPlaying(false)
        })
      }
    }
  }, [currentSong])

  const togglePlay = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      console.log("⏸️ Música pausada")
    } else {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            console.log("▶️ Música reproduciendo")
          })
          .catch((error) => {
            console.log("Error al reproducir:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  // 🎵 SIGUIENTE CANCIÓN: Cambio normal, empezar desde 0
  const handleNext = () => {
    const wasPlaying = isPlaying

    if (isShuffling) {
      let nextSong
      do {
        nextSong = Math.floor(Math.random() * songs.length)
      } while (nextSong === currentSong && songs.length > 1)
      setCurrentSong(nextSong)
    } else {
      setCurrentSong((prev) => (prev + 1) % songs.length)
    }

    // Mantener el estado de reproducción
    if (wasPlaying) {
      setIsPlaying(true)
    }

    console.log("⏭️ Cambiando a siguiente canción")
  }

  // 🎵 CANCIÓN ANTERIOR: Cambio normal, empezar desde 0
  const handlePrevious = () => {
    const wasPlaying = isPlaying
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length)

    // Mantener el estado de reproducción
    if (wasPlaying) {
      setIsPlaying(true)
    }

    console.log("⏮️ Cambiando a canción anterior")
  }

  // 🎵 SELECCIONAR CANCIÓN: Cambio manual, empezar desde 0
  const handleSongSelect = (index) => {
    const wasPlaying = isPlaying
    setCurrentSong(index)

    // Si estaba reproduciendo, continuar reproduciendo la nueva canción
    if (wasPlaying) {
      setIsPlaying(true)
    }

    console.log("🎯 Canción seleccionada:", songs[index].title)
  }

  const handleSeek = (e) => {
    const audio = audioRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audio.currentTime = percent * duration
  }

  const handleVolumeChange = (e) => {
    e.stopPropagation()
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

  const handleTouchStart = (e) => {
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

            {/* Estado del reproductor */}
            <div style={{ fontSize: "0.7rem", color: "#666", textAlign: "center", marginTop: "0.5rem" }}>
              {isPlaying ? "🎵 Reproduciendo..." : "⏸️ Pausado"}
              {isInitialLoad && <div style={{ color: "#4834d4" }}>🔄 Cargando...</div>}
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
              onClick={() => handleSongSelect(index)}
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
