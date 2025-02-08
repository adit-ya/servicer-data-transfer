'use client'

import { useState, useEffect } from 'react'

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const loginStatus = sessionStorage.getItem('isLoggedIn') === 'true'
            setIsLoggedIn(loginStatus)
        }

        const authChangeEvent = new Event('authChange')

        const dispatchAuthChange = () => {
            window.dispatchEvent(authChangeEvent)
        }

        window.addEventListener('authChange', checkAuth)
        window.addEventListener('storage', checkAuth)

        checkAuth()

        return () => {
            window.removeEventListener('authChange', checkAuth)
            window.removeEventListener('storage', checkAuth)
        }
    }, [])

    const login = () => {
        sessionStorage.setItem('isLoggedIn', 'true')
        window.dispatchEvent(new Event('authChange'))
    }

    const logout = () => {
        sessionStorage.removeItem('isLoggedIn')
        sessionStorage.removeItem('username')
        window.dispatchEvent(new Event('authChange'))
    }

    return { isLoggedIn, login, logout }
}
