'use client'

import { useRouter } from 'next/navigation'
import DarkModeToggle from './DarkModeToggle'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
    const router = useRouter()
    const { isLoggedIn, logout } = useAuth()

    const handleSignOut = () => {
        logout()
        router.push('/login')
    }

    return (
        <nav className='fixed top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-20'>
                    <div className='flex-1'>
                        <h1 className='font-heading text-primary'>Your Logo</h1>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <DarkModeToggle />
                        {isLoggedIn && (
                            <button
                                onClick={handleSignOut}
                                className='flex items-center space-x-2 px-4 py-2 rounded-lg 
                                text-gray-700 dark:text-gray-200 
                                hover:bg-gray-100 dark:hover:bg-gray-700 
                                transition-colors font-body'
                            >
                                <LogOut className='w-5 h-5' />
                                <span>Sign Out</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
