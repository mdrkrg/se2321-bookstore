'use client'
import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

interface AuthContextType {
  isAuthorized: boolean
  login: (token: string, next: URL) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = async ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()
  const sessionKey = 'JSESSIONID'
  const [session, setSession, removeSession] = useCookies([sessionKey])

  useEffect(() => {
    // Check for the token in cookies on component mount
    const token = session.JSESSIONID
    setIsAuthorized(!!token)
  }, [])

  const login = (token: string, next: URL, params?: URLSearchParams) => {
    setSession(sessionKey, token, {
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      secure: true, // using HTTPS
      httpOnly: true, // Prevent client-side JavaScript access
    })
    setIsAuthorized(true)
    navigate({ to: next.toString(), params }) // Redirect after login
  }

  const logout = () => {
    removeSession(sessionKey, { path: '/' })
    setIsAuthorized(false)
    navigate({ to: '/login' }) // Redirect after logout
  }

  const value: AuthContextType = {
    isAuthorized,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
