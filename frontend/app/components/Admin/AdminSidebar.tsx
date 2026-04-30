'use client';

import { logout } from '@/redux/slices/authSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

const AdminSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const isActive = pathname;

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        router.push('/');
    }

    return (
        <div className='p-6 '>
            <div className='mb-6'>
                <Link href={'/admin'} className='text-2xl font-medium'>
                    Rabbit
                </Link>
            </div>
            <h2 className='text-xl font-medium mb-6 text-center'>
                Admin Dashboard
            </h2>

            <nav className='flex flex-col space-y-2'>
                <Link href={'/admin/users'} className={ isActive === '/admin/users' ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                 <FaUser />

                 <span>Users</span>
                </Link>

                <Link href={'/admin/products'} className={ isActive === '/admin/products' ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                 <FaBoxOpen />

                 <span>Products</span>
                </Link>

                <Link href={'/admin/orders'} className={ isActive === '/admin/orders' ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                 <FaClipboardList />

                 <span>Orders</span>
                </Link>

                <Link href={'/admin/shop'} className={ isActive === '/admin/shop' ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2" : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>
                 <FaStore />

                 <span>Shop</span>
                </Link>
              
            </nav>

            <div className='mt-6'>
                <button onClick={handleLogout} className='w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2'>
                   <FaSignOutAlt />
                   <span>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default AdminSidebar
