import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Field {
    id: string
    name: string
    mapped?: string
}

interface FieldMapperProps {
    sourceFields: Field[]
    targetFields: Field[]
    onMapFields: (sourceId: string, targetId: string) => void
}

const FieldMapper: React.FC<FieldMapperProps> = ({
    sourceFields,
    targetFields,
    onMapFields,
}) => {
    const [selectedSourceField, setSelectedSourceField] = useState<
        string | null
    >(null)
    const [mappings, setMappings] = useState<Record<string, string>>({})
    const [orderedTargetFields, setOrderedTargetFields] = useState(targetFields)

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

            const reorderedFields = reorderTargetFields(
                targetFields,
                newMappings,
                sourceFields
            )
            setOrderedTargetFields(reorderedFields)
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

    return (
        <div className='w-full max-w-4xl mx-auto p-4'>
            <div className='flex justify-between gap-8'>
                <div className='w-1/2 bg-white rounded-lg shadow-md p-4'>
                    <h2 className='text-lg font-semibold mb-4'>
                        Primary Fields
                    </h2>
                    <div className='space-y-2'>
                        {sourceFields.map((field) => (
                            <motion.div
                                key={field.id}
                                className={`p-3 rounded cursor-pointer transition-colors ${
                                    selectedSourceField === field.id
                                        ? 'bg-blue-500 text-white'
                                        : mappings[field.id]
                                        ? 'bg-green-100'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => handleSourceClick(field.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {field.name}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className='w-1/2 bg-white rounded-lg shadow-md p-4'>
                    <h2 className='text-lg font-semibold mb-4'>
                        Backup Fields
                    </h2>
                    <div className='space-y-2'>
                        <AnimatePresence>
                            {orderedTargetFields.map((field) => {
                                const isMapped = Object.values(
                                    mappings
                                ).includes(field.id)
                                const mappedSourceField = Object.entries(
                                    mappings
                                ).find(([_, targetId]) => targetId === field.id)

                                return (
                                    <motion.div
                                        key={field.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            type: 'tween',
                                            duration: 0.2,
                                        }}
                                        className={`p-3 rounded cursor-pointer transition-colors ${
                                            isMapped
                                                ? 'bg-green-100'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                        onClick={() =>
                                            handleTargetClick(field.id)
                                        }
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className='flex justify-between'>
                                            <span>{field.name}</span>
                                            {mappedSourceField && (
                                                <span className='text-sm text-gray-500'>
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

            {Object.keys(mappings).length > 0 && (
                <div className='mt-4 text-center'>
                    <button
                        onClick={() => {
                            setMappings({})
                            setOrderedTargetFields(targetFields)
                        }}
                        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                    >
                        Reset Mappings
                    </button>
                </div>
            )}
        </div>
    )
}

export default FieldMapper
