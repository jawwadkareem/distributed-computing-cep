"use client"

import { createContext, useState, useEffect, useCallback } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  // Register a new user
  const register = useCallback(async (name, email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://dc-backend-black.vercel.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Login user
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://dc-backend-black.vercel.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Save to state and localStorage
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout user
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }, [])

  // Get current user
  const getCurrentUser = useCallback(async () => {
    if (!token) return null

    try {
      const response = await fetch("https://dc-backend-black.vercel.app/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to get user data")
      }

      const userData = await response.json()
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))

      return userData
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [token, logout])

  // Check if user is authenticated
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        getCurrentUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
