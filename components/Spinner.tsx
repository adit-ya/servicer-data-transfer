import React from 'react'
import { Loader2 } from 'lucide-react'

const Spinner = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
                <div className='flex flex-col items-center space-y-4'>
                    <Loader2 className='w-12 h-12 text-primary animate-spin' />
                    <p className='text-secondary dark:text-secondary-dark font-heading text-lg'>
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Spinner
