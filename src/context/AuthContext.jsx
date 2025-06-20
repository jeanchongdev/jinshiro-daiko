"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import { auth } from "../firebase/config"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Email fijo para tu página privada
  const PRIVATE_EMAIL = "jinshiro@sadpage.com"

  function login(password) {
    return signInWithEmailAndPassword(auth, PRIVATE_EMAIL, password)
  }

  function logout() {
    return signOut(auth)
  }

  function changePassword(currentPassword, newPassword) {
    const user = auth.currentUser
    const credential = EmailAuthProvider.credential(PRIVATE_EMAIL, currentPassword)

    return reauthenticateWithCredential(user, credential).then(() => {
      return updatePassword(user, newPassword)
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    logout,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
