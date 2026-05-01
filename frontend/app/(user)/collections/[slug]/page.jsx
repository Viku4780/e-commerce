'use client';

import FilterSidebar from '@/app/components/Products/FilterSidebar';
import ProductGrid from '@/app/components/Products/ProductGrid';
import SortOptions from '@/app/components/Products/SortOptions';
import { fetchProductsByFilters } from '@/redux/slices/productsSlice';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const page = () => {
    const {collection} = useParams();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.products);
    const queryParams = Object.fromEntries(searchParams.entries());

    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProductsByFilters({collection, ...queryParams}));
    }, [dispatch, collection, searchParams]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        // close sidebar if clicked outside
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    }

    useEffect(() => {
        // add event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);

        // clean event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
    if (isSidebarOpen) {
        document.body.classList.add('overflow-hidden');
    } else {
        document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function to ensure scroll is restored if component unmounts
    return () => document.body.classList.remove('overflow-hidden');
}, [isSidebarOpen]);


  
    return (

        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Filter Button - Styled as a primary action */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-md mb-4 active:scale-95 transition-transform"
                >
                    <FaFilter /> Filters
                </button>

                {/* Overlay for Mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40  lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Filter Sidebar */}
                <aside
                    ref={sidebarRef}
                    className={`
                        absolute inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto 
                        lg:static lg:block lg:w-64 lg:p-0 lg:shadow-none lg:translate-x-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:overflow-y-auto

                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                         `}
                >
                    <FilterSidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-grow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold tracking-tight uppercase">All Collection</h2>
                        <SortOptions />
                    </div>

                    <ProductGrid products={products} loading={loading} error={error} />
                </main>
            </div>
        </div>

    )
}

export default page
