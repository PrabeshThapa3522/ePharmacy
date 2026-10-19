import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  
useEffect(() => {
  const token = localStorage.getItem("access_token")

  if (!token) {
    setIsLoading(false)
    return
  }

  const loadUser = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        localStorage.removeItem("access_token")
        setUser(null)
        return
      }

      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error("Unable to restore user session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  loadUser()
}, [])


    const logout = () => {
  localStorage.removeItem("access_token")
  setUser(null)
}

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}