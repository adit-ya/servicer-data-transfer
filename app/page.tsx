'use client'

import { useEffect, useState } from 'react'
import FieldMapper from '@/components/FieldMapper'
import { CheckCircle, RefreshCw } from 'lucide-react'

interface Field {
    id: string
    name: string
}

interface GPTMapping {
    sourceId: string
    targetId: string
    confidence: number
}

export default function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [initialMappingsDone, setInitialMappingsDone] = useState(false)
    const [mappings, setMappings] = useState<Record<string, string>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    useEffect(() => {
        const storedSubmission = localStorage.getItem('isSubmitted')
        if (storedSubmission) {
            setIsSubmitted(JSON.parse(storedSubmission))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('isSubmitted', JSON.stringify(isSubmitted))
    }, [isSubmitted])

    const apiFields = [
        { id: '1', name: 'pmt_amount' },
        { id: '2', name: 'current_balance' },
        { id: '3', name: 'purchase_date' },
        { id: '4', name: 'orig_principal' },
        { id: '5', name: 'customer_id' },
        { id: '6', name: 'rate' },
        { id: '7', name: 'borrower_name' },
        { id: '8', name: 'loan_id' },
        { id: '9', name: 'pmt_frequency' },
        { id: '10', name: 'next_due_dt' },
    ]

    const yourFields = [
        { id: 'a', name: 'userId' },
        { id: 'b', name: 'orderDate' },
        { id: 'c', name: 'account_number' },
        { id: 'd', name: 'customer_name' },
        { id: 'e', name: 'initial_balance' },
        { id: 'f', name: 'principal_balance' },
        { id: 'g', name: 'scheduled_payment' },
        { id: 'h', name: 'payment_schedule' },
        { id: 'i', name: 'payment_due_date' },
        { id: 'j', name: 'interest_rate' },
    ]

    const generatePrompt = (sourceFields: Field[], targetFields: Field[]) => {
        return {
            messages: [
                {
                    role: 'system',
                    content:
                        "You are an expert in data mapping and financial terminology. Analyze the field names and suggest mappings between source and target fields. Return only fields where you're reasonably confident (>80%) about the mapping. Format your response as JSON array with objects containing sourceId, targetId, and confidence (0-100).",
                },
                {
                    role: 'user',
                    content: `Source fields: ${JSON.stringify(sourceFields)}
                     Target fields: ${JSON.stringify(targetFields)}
                     Map these fields based on their names and common financial terminology. Only include confident matches.`,
                },
            ],
        }
    }

    const handleAutoMap = async () => {
        if (initialMappingsDone) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/gpt-map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(generatePrompt(apiFields, yourFields)),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to map fields')
            }

            const data = await response.json()

            if (!data.mappings) {
                throw new Error('No mappings received from server')
            }

            const mappings: GPTMapping[] = data.mappings
            console.log('Received mappings:', mappings)

            const newMappings: Record<string, string> = {}

            mappings.forEach((mapping) => {
                if (mapping.confidence >= 80) {
                    newMappings[mapping.sourceId] = mapping.targetId
                }
            })

            setMappings(newMappings)
            setInitialMappingsDone(true)
        } catch (error) {
            console.error('Error mapping fields:', error)
            alert(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while mapping fields'
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleMapFields = (sourceId: string, targetId: string) => {
        setMappings((prev) => ({
            ...prev,
            [sourceId]: targetId,
        }))
    }

    const handleResetMappings = () => {
        setMappings({})
        setInitialMappingsDone(false)
    }

    const handleSubmitMappings = (mappings: Record<string, string>) => {
        console.log('Submitting mappings:', mappings)
        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 mx-6'>
                <div className='max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center'>
                    <div className='mb-6'>
                        <CheckCircle className='w-16 h-16 mx-auto text-green-500' />
                    </div>
                    <h1 className='text-2xl font-heading text-gray-900 dark:text-white mb-4'>
                        Thank you!
                    </h1>
                    <p className='text-gray-600 dark:text-gray-300'>
                        You will receive a notification once your data has been
                        processed and sent to a servicer.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4 py-16'>
            <div className='w-full max-w-6xl mx-auto'>
                <div className='flex flex-col gap-4 md:flex-row justify-between md:items-center p-6'>
                    <div>
                        <h2 className='font-heading text-2xl text-primary mb-2'>
                            Field Mapping
                        </h2>
                        <p className='font-body text-tertiary dark:text-tertiary-dark'>
                            Map your source fields to the corresponding target
                            fields
                        </p>
                    </div>

                    <button
                        onClick={handleAutoMap}
                        disabled={isLoading || initialMappingsDone}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-heading
                        ${
                            isLoading || initialMappingsDone
                                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                                : 'bg-secondary hover:bg-secondary-dark text-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className='w-4 h-4 animate-spin' />
                                <span>Mapping...</span>
                            </>
                        ) : (
                            <>
                                <RefreshCw className='w-4 h-4' />
                                <span>Auto-Map Fields</span>
                            </>
                        )}
                    </button>
                </div>

                <FieldMapper
                    sourceFields={apiFields}
                    targetFields={yourFields}
                    onMapFields={handleMapFields}
                    initialMappings={mappings}
                    onResetMappings={handleResetMappings}
                    onSubmitMappings={handleSubmitMappings}
                />
            </div>
        </div>
    )
}
