'use client'
import { useState, useEffect } from 'react'

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('isLoggedIn') === 'true'
        }
        return false
    })

    useEffect(() => {
        const checkAuth = () => {
            const loginStatus = sessionStorage.getItem('isLoggedIn') === 'true'
            setIsLoggedIn(loginStatus)
        }

        checkAuth()

        window.addEventListener('authChange', checkAuth)
        window.addEventListener('storage', checkAuth)

        return () => {
            window.removeEventListener('authChange', checkAuth)
            window.removeEventListener('storage', checkAuth)
        }
    }, [])

    const login = () => {
        sessionStorage.setItem('isLoggedIn', 'true')
        setIsLoggedIn(true)
        window.dispatchEvent(new Event('authChange'))
    }

    const logout = () => {
        sessionStorage.removeItem('isLoggedIn')
        sessionStorage.removeItem('username')
        localStorage.removeItem('isSubmitted')
        setIsLoggedIn(false)
        window.dispatchEvent(new Event('authChange'))
    }

    return { isLoggedIn, login, logout }
}
