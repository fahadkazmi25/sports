"use client"

import { useEffect } from "react"

export default function TestErrorPage() {
    useEffect(() => {
        throw new Error("This is a test error to check the error boundary.")
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Throwing error...</p>
        </div>
    )
}
