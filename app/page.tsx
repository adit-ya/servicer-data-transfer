'use client'

import { useEffect, useState } from 'react'
import FieldMapper from '@/components/FieldMapper'
import { CheckCircle, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'

interface Field {
    id: string
    name: string
}

interface GPTMapping {
    sourceId: string
    targetId: string
    confidence: number
}

interface ColumnsResponse {
    tables: string[]
}

export default function Home() {
    const router = useRouter()
    const { isLoggedIn } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [initialMappingsDone, setInitialMappingsDone] = useState(false)
    const [mappings, setMappings] = useState<Record<string, string>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const [sourceFields, setSourceFields] = useState<Field[]>([])
    const [isLoadingFields, setIsLoadingFields] = useState(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/login')
        } else {
            setIsChecking(false)
        }
    }, [isLoggedIn, router])

    useEffect(() => {
        const fetchSourceFields = async () => {
            try {
                const response = await fetch(
                    'http://127.0.0.1:8000/api/columns/',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch source fields')
                }

                const data: ColumnsResponse = await response.json()

                // Transform the array of strings into the Field interface format
                const transformedFields: Field[] = data.tables.map(
                    (fieldName, index) => ({
                        id: (index + 1).toString(), // Generate sequential IDs
                        name: fieldName,
                    })
                )

                setSourceFields(transformedFields)
                setError('')
            } catch (err) {
                setError(
                    'Failed to load source fields. Please try again later.'
                )
                console.error('Error fetching source fields:', err)
            } finally {
                setIsLoadingFields(false)
            }
        }

        fetchSourceFields()
    }, [])

    useEffect(() => {
        const storedSubmission = localStorage.getItem('isSubmitted')
        if (storedSubmission) {
            setIsSubmitted(JSON.parse(storedSubmission))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('isSubmitted', JSON.stringify(isSubmitted))
    }, [isSubmitted])

    if (isChecking) {
        return <Spinner />
    }

    if (!isLoggedIn) {
        return null
    }

    // const targetFields = [
    //     { id: 'a', name: 'collateral_value' },
    //     { id: 'b', name: 'rate_of_interest' },
    //     { id: 'c', name: 'loan_id' },
    //     { id: 'd', name: 'contact_number' },
    //     { id: 'e', name: 'orig_date' },
    //     { id: 'f', name: 'social_security_number' },
    //     { id: 'g', name: 'doc_type' },
    //     { id: 'h', name: 'pmt_frequency' },
    //     { id: 'i', name: 'secondary_borrower_id' },
    //     { id: 'j', name: 'email_address' },
    //     { id: 'k', name: 'collateral_type' },
    //     { id: 'l', name: 'principal_amount' },
    //     { id: 'm', name: 'next_payment_date' },
    //     { id: 'n', name: 'loan_condition' },
    //     { id: 'o', name: 'pmt_amount' },
    //     { id: 'p', name: 'current_balance' },
    //     { id: 'q', name: 'document_url' },
    //     { id: 'r', name: 'last_name' },
    //     { id: 's', name: 'report_date' },
    //     { id: 't', name: 'borrower_relationship' },
    //     { id: 'u', name: 'first_name' },
    //     { id: 'v', name: 'end_date' },
    //     { id: 'w', name: 'asset_id' },
    //     { id: 'x', name: 'primary_borrower_id' },
    //     { id: 'y', name: 'mailing_address' },
    //     { id: 'z', name: 'birth_date' },
    //     { id: 'aa', name: 'past_due_status' },
    //     { id: 'bb', name: 'product_type' },
    //     { id: 'cc', name: 'annual_income' },
    //     { id: 'dd', name: 'fico_score' },
    // ]

    const targetFields = [
        { id: 'a', name: 'document_type' },
        { id: 'b', name: 'interest_rate' },
        { id: 'c', name: 'origination_date' },
        { id: 'd', name: 'payment_frequency' },
        { id: 'e', name: 'co_borrower_id' },
        { id: 'f', name: 'email' },
        { id: 'g', name: 'collateral_type' },
        { id: 'h', name: 'loan_amount' },
        { id: 'i', name: 'payment_date' },
        { id: 'j', name: 'loan_status' },
        { id: 'k', name: 'payment_amount' },
        { id: 'l', name: 'remaining_balance' },
        { id: 'm', name: 'document_link' },
        { id: 'n', name: 'collateral_value' },
        { id: 'o', name: 'last_name' },
        { id: 'p', name: 'last_reported_date' },
        { id: 'q', name: 'relationship_to_borrower' },
        { id: 'r', name: 'first_name' },
        { id: 's', name: 'maturity_date' },
        { id: 't', name: 'vin_or_property_id' },
        { id: 'u', name: 'borrower_id' },
        { id: 'v', name: 'loan_id' },
        { id: 'w', name: 'address' },
        { id: 'x', name: 'ssn' },
        { id: 'y', name: 'dob' },
        { id: 'z', name: 'delinquency_status' },
        { id: 'aa', name: 'loan_type' },
        { id: 'ab', name: 'income' },
        { id: 'ac', name: 'credit_score' },
        { id: 'ad', name: 'phone_number' },
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
                body: JSON.stringify(
                    generatePrompt(sourceFields, targetFields)
                ),
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

    const handleSubmitMappings = async (mappings: Record<string, string>) => {
        try {
            // Transform the mappings into the format we want to send
            const mappedFields = Object.entries(mappings).map(
                ([sourceId, targetId]) => {
                    const sourceField = sourceFields.find(
                        (field) => field.id === sourceId
                    )
                    const targetField = targetFields.find(
                        (field) => field.id === targetId
                    )

                    return {
                        source: sourceField?.name || 'unknown',
                        target: targetField?.name || 'unknown',
                    }
                }
            )

            console.log('Sending mappings to backend:', mappedFields)

            const response = await fetch(
                'http://127.0.0.1:8000/api/field-mappings/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mappings: mappedFields,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('Failed to submit mappings')
            }

            const data = await response.json()
            console.log('Backend response:', data)

            setIsSubmitted(true)
        } catch (error) {
            console.error('Error submitting mappings:', error)
            alert('Failed to submit mappings. Please try again.')
        }
    }

    if (isChecking || isLoadingFields) {
        return <Spinner />
    }

    if (error) {
        return (
            <div className='p-4 text-red-500 bg-red-50 rounded-lg'>{error}</div>
        )
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
                    sourceFields={sourceFields}
                    targetFields={targetFields}
                    onMapFields={handleMapFields}
                    initialMappings={mappings}
                    onResetMappings={handleResetMappings}
                    onSubmitMappings={handleSubmitMappings}
                />
            </div>
        </div>
    )
}
