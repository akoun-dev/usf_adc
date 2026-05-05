import React, { useEffect } from 'react'
import { NewsTab } from "@/features/admin/components/NewsTab"

export default function AdminNewsPage() {
    // Remove html scroll when on this page
    useEffect(() => {
        document.documentElement.classList.add('no-scroll-root')
        document.body.classList.add('no-scroll-root')
        
        return () => {
            document.documentElement.classList.remove('no-scroll-root')
            document.body.classList.remove('no-scroll-root')
        }
    }, [])

    return (
        <div className="space-y-6 animate-fade-in">
            <NewsTab />
        </div>
    )
}
