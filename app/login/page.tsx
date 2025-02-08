'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface LoginForm {
    username: string
    password: string
}

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: '',
    })
    const [error, setError] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn')
        if (isLoggedIn === 'true') {
            router.push('/')
        }
    }, [router])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // HARDCODED CREDS FOR PRODUCT DEMO
        const VALID_USERNAME = 'admin'
        const VALID_PASSWORD = 'swopl'

        if (
            formData.username === VALID_USERNAME &&
            formData.password === VALID_PASSWORD
        ) {
            login()
            sessionStorage.setItem('username', formData.username)
            router.push('/')
        } else {
            setError('Invalid username or password')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('')
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
            <div className='max-w-md w-full'>
                <div className='text-center mb-8'>
                    <h1 className='font-heading text-4xl text-primary mb-2'>
                        Welcome Back
                    </h1>
                    <p className='font-body text-tertiary dark:text-tertiary-dark'>
                        Enter your credentials to access your account
                    </p>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label
                                htmlFor='username'
                                className='font-heading text-sm text-secondary dark:text-secondary-dark mb-2 block'
                            >
                                Username
                            </label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                value={formData.username}
                                onChange={handleChange}
                                className='w-full px-4 py-3 rounded-lg border border-gray-200 
                                dark:border-gray-700 dark:bg-gray-900 dark:text-white
                                focus:border-primary focus:ring-1 focus:ring-primary
                                transition-colors font-body'
                                placeholder='Enter your username'
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='font-heading text-sm text-secondary dark:text-secondary-dark mb-2 block'
                            >
                                Password
                            </label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className='w-full px-4 py-3 rounded-lg border border-gray-200 
                                    dark:border-gray-700 dark:bg-gray-900 dark:text-white
                                    focus:border-primary focus:ring-1 focus:ring-primary
                                    transition-colors font-body pr-12'
                                    placeholder='Enter your password'
                                    required
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 
                                    hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                >
                                    {showPassword ? (
                                        <EyeOff className='w-5 h-5' />
                                    ) : (
                                        <Eye className='w-5 h-5' />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                className='text-red-500 text-sm font-body bg-red-50 dark:bg-red-900/20 
                            rounded-lg p-3 flex items-center'
                            >
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type='submit'
                            className='w-full bg-primary hover:bg-primary-dark text-white font-heading
                            py-3 px-6 rounded-lg transition-colors flex items-center justify-center
                            space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                            dark:focus:ring-offset-gray-800'
                        >
                            <LogIn className='w-5 h-5' />
                            <span>Sign In</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
