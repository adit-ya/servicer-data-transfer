'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode')

        if (storedDarkMode !== null) {
            setIsDark(storedDarkMode === 'true')
            if (storedDarkMode === 'true') {
                document.documentElement.classList.add('dark')
            }
        } else {
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
            setIsDark(prefersDark)
            if (prefersDark) {
                document.documentElement.classList.add('dark')
                localStorage.setItem('darkMode', 'true')
            }
        }
    }, [])

    const toggleDarkMode = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('darkMode', 'false')
            setIsDark(false)
        } else {
            document.documentElement.classList.add('dark')
            localStorage.setItem('darkMode', 'true')
            setIsDark(true)
        }
    }

    return (
        <button
            onClick={toggleDarkMode}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className='w-5 h-5 text-yellow-400 transition-colors hover:text-yellow-500' />
            ) : (
                <Moon className='w-5 h-5 transition-colors' />
            )}
        </button>
    )
}
