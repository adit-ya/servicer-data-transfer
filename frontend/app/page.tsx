'use client'

import FieldMapper from '@/components/FieldMapper'

export default function Home() {
    const apiFields = [
        { id: '1', name: 'customer_id' },
        { id: '2', name: 'purchase_date' },
        { id: '3', name: 'loan_id' },
        { id: '4', name: 'borrower_name' },
        { id: '5', name: 'orig_principal' },
        { id: '6', name: 'current_balance' },
        { id: '7', name: 'pmt_amount' },
        { id: '8', name: 'pmt_frequency' },
        { id: '9', name: 'next_due_dt' },
        { id: '10', name: 'rate' },
        // { id: '', name: 'maturity_date' },
        // { id: '', name: 'past_due_amt' },
        // { id: '', name: 'escrow_balance' },
        // { id: '', name: 'last_pmt_date' },
        // { id: '', name: 'last_pmt_amt' },
        // { id: '', name: 'loan_status' },
        // { id: '', name: 'loan_type' },
        // { id: '', name: 'prop_address' },
        // { id: '', name: 'servicer_fee' },
        // { id: '', name: 'mod_date' },
        // { id: '', name: 'balloon_amt' },
        // { id: '', name: 'tax_type' }
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
        { id: '10', name: 'interest_rate' },
        // { id: '', name: 'loan_end_date'},
        // { id: '', name: 'delinquent_amount'},
        // { id: '', name: 'impound_balance'},
        // { id: '', name: 'payment_received_date'},
        // { id: '', name: 'payment_posted_amount'},
        // { id: '', name: 'account_status'},
        // { id: '', name: 'collateral_address'},
        // { id: '', name: 'management_fee'},
        // { id: '', name: 'modification_effective_date'},
        // { id: '', name: 'final_payment_amount'},
        // { id: '', name: 'municipality_code'},
    ]

    const handleMapFields = (sourceId: string, targetId: string) => {
        console.log(`Mapped ${sourceId} to ${targetId}`)
    }
    return (
        <div>
            <main>
                <FieldMapper
                    sourceFields={apiFields}
                    targetFields={yourFields}
                    onMapFields={handleMapFields}
                />
            </main>
        </div>
    )
}
