'use client';
import { useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminHomePage from '../components/Admin/AdminHomePage';

const Page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        // Added overflow-hidden here to prevent page-level scrollbars when sidebar moves
        <div className='min-h-screen flex flex-col md:flex-row overflow-hidden'>
            
            {/* mobile top bar - fixed or relative depending on design needs */}
            <div className='flex md:hidden p-4 bg-gray-600 text-white justify-between items-center z-10'>
                <button onClick={toggleSidebar}>
                    <FaBars size={24} />
                </button>
                <h1 className='ml-4 text-xl font-medium'>Admin Dashboard</h1>
            </div>

            {/* overlay for mobile sidebar - higher z-index than content, lower than sidebar */}
            {isSidebarOpen && (
                <div 
                    className='fixed inset-0 z-20 bg-black/50 md:hidden' 
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar - Fix: Changed top padding, added shadow, refined transitions */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-64 bg-gray-500 text-white
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:flex-shrink-0
                flex flex-col
            `}>
                <AdminSidebar />
            </aside>

            {/* Main Content - Fix: Changed p-6 to include top padding for mobile if needed */}
            <main className='flex-grow overflow-y-auto bg-gray-100'>
                <div className="p-6">
                    <AdminHomePage />
                </div>
            </main>
        </div>

    )
}

export default Page
