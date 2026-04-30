'use client';
import React from 'react'
import {useSelector} from 'react-redux';

const ProtectedRoute = ({children, role}) => {
    const {user} = useSelector((state) => state.auth);
    const router = useRouter

    if(!user || (role && user.role !== role)){
        return router.push("/login");
    }
  return children;
}

export default ProtectedRoute;
