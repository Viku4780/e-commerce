'use client';

import ProductDetails from '@/app/components/Products/ProductDetails'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const {id} = useParams();
  // console.log(id);
  return (
    <div>
      <ProductDetails productId={id} />
    </div>
  )
}

export default page
