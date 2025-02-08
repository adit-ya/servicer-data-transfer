import type { Metadata } from 'next'
import './globals.css'

import { Cabin, Sometype_Mono } from 'next/font/google'
import Navbar from '@/components/NavBar'

const sometypeMono = Sometype_Mono({
    variable: '--font-sometype-mono',
    weight: '600',
    display: 'swap',
})

const cabin = Cabin({
    subsets: ['latin'],
    variable: '--font-cabin',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'swopl',
    description: 'YC S24',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-32x32.png',
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body
                className={`${sometypeMono.variable} ${cabin.variable} antialiased`}
            >
                <Navbar />
                <main className='min-h-screen dark:bg-gray-900 bg-white'>
                    {children}
                </main>
            </body>
        </html>
    )
}
