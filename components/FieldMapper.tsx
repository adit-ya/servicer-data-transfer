import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, RefreshCw } from 'lucide-react'

interface Field {
    id: string
    name: string
    mapped?: string
}

interface FieldMapperProps {
    sourceFields: Field[]
    targetFields: Field[]
    onMapFields: (sourceId: string, targetId: string) => void
    initialMappings?: Record<string, string>
    onResetMappings?: () => void
    onSubmitMappings?: (mappings: Record<string, string>) => void
}

const FieldMapper: React.FC<FieldMapperProps> = ({
    sourceFields,
    targetFields,
    onMapFields,
    initialMappings = {},
    onResetMappings = () => {},
    onSubmitMappings = () => {},
}) => {
    const [selectedSourceField, setSelectedSourceField] = useState<
        string | null
    >(null)
    const [mappings, setMappings] =
        useState<Record<string, string>>(initialMappings)
    const [orderedTargetFields, setOrderedTargetFields] = useState(targetFields)

    useEffect(() => {
        setMappings(initialMappings)
        const reordered = reorderTargetFields(
            targetFields,
            initialMappings,
            sourceFields
        )
        setOrderedTargetFields(reordered)
    }, [initialMappings, sourceFields, targetFields])

    const handleSourceClick = (fieldId: string) => {
        setSelectedSourceField(fieldId)
    }

    const handleTargetClick = (targetId: string) => {
        if (selectedSourceField) {
            const newMappings = { ...mappings }

            Object.keys(newMappings).forEach((key) => {
                if (newMappings[key] === targetId) {
                    delete newMappings[key]
                }
            })

            newMappings[selectedSourceField] = targetId
            setMappings(newMappings)
            onMapFields(selectedSourceField, targetId)
            setSelectedSourceField(null)

            const reordered = reorderTargetFields(
                targetFields,
                newMappings,
                sourceFields
            )
            setOrderedTargetFields(reordered)
        }
    }

    const reorderTargetFields = (
        targets: Field[],
        currentMappings: Record<string, string>,
        sources: Field[]
    ) => {
        const reordered: (Field | null)[] = new Array(targets.length).fill(null)
        const unmapped: Field[] = []

        targets.forEach((targetField) => {
            const sourceIndex = sources.findIndex(
                (sourceField) =>
                    currentMappings[sourceField.id] === targetField.id
            )

            if (sourceIndex !== -1) {
                reordered[sourceIndex] = targetField
            } else {
                unmapped.push(targetField)
            }
        })

        let unmappedIndex = 0
        return reordered
            .map((field) => {
                if (field === null && unmappedIndex < unmapped.length) {
                    return unmapped[unmappedIndex++]
                }
                return field
            })
            .filter((field): field is Field => field !== null)
    }

    const allFieldsMapped = sourceFields.length === Object.keys(mappings).length

    return (
        <div className='w-full max-w-6xl mx-auto px-6'>
            <div className='flex flex-col md:flex-row justify-between gap-8'>
                <div className='md:w-1/2'>
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <h3 className='font-heading text-lg text-secondary dark:text-secondary-dark mb-4'>
                            Source Fields
                        </h3>
                        <div className='space-y-2'>
                            {sourceFields.map((field) => (
                                <motion.div
                                    key={field.id}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all
                                        ${
                                            selectedSourceField === field.id
                                                ? 'bg-primary border-primary text-white'
                                                : mappings[field.id]
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                                        }`}
                                    onClick={() => handleSourceClick(field.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className='flex items-center justify-between font-body'>
                                        <span className='text-tertiary dark:text-tertiary-dark'>
                                            {field.name}
                                        </span>
                                        {mappings[field.id] && (
                                            <ArrowRight className='w-4 h-4 text-green-500' />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='md:w-1/2'>
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <h3 className='font-heading text-lg text-secondary dark:text-secondary-dark mb-4'>
                            Target Fields
                        </h3>
                        <div className='space-y-2'>
                            <AnimatePresence>
                                {orderedTargetFields.map((field) => {
                                    const isMapped = Object.values(
                                        mappings
                                    ).includes(field.id)
                                    const mappedSourceField = Object.entries(
                                        mappings
                                    ).find(
                                        ([, targetId]) => targetId === field.id
                                    )

                                    return (
                                        <motion.div
                                            key={field.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 30,
                                            }}
                                            className={`p-4 rounded-lg cursor-pointer border transition-all
                                                ${
                                                    isMapped
                                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                                                }`}
                                            onClick={() =>
                                                handleTargetClick(field.id)
                                            }
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className='flex justify-between items-center font-body'>
                                                <span className='text-tertiary dark:text-tertiary-dark'>
                                                    {field.name}
                                                </span>
                                                {mappedSourceField && (
                                                    <span className='text-sm text-green-600 dark:text-green-400'>
                                                        ←{' '}
                                                        {
                                                            sourceFields.find(
                                                                (f) =>
                                                                    f.id ===
                                                                    mappedSourceField[0]
                                                            )?.name
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {Object.keys(mappings).length > 0 && (
                <div className='mt-6 flex justify-center gap-4'>
                    <button
                        onClick={onResetMappings}
                        className='inline-flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 
                text-white font-heading rounded-lg transition-colors focus:outline-none 
                focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                    >
                        <RefreshCw className='w-4 h-4' />
                        <span>Reset Mappings</span>
                    </button>

                    {allFieldsMapped && onSubmitMappings && (
                        <button
                            onClick={() => onSubmitMappings(mappings)}
                            className='inline-flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 
                    text-white font-heading rounded-lg transition-colors focus:outline-none 
                    focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
                        >
                            <span>Submit Mappings</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default FieldMapper
