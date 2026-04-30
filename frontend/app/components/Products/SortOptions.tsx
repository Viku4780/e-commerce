'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback } from 'react'

const SortOptions = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSortChange = useCallback((e) => {
    const sortBy = e.target.value;
    // create a writable clone of the current params
    const params = new URLSearchParams(searchParams.toString());

    // set or delete the parameter
    if(sortBy){
      params.set("sortBy", sortBy);
    }else{
      params.delete("sortBy");
    }

    // update the url this is the updater
    router.push(`${pathname}?${params.toString()}`, {scroll: false});
  }, [searchParams, pathname, router]);

  return (
    <div className='mb-4 flex items-center justify-end'>
      <select id="sort" onChange={handleSortChange} value={searchParams.get("sortBy") || ""} className='border p-2 rounded-md focus:outline-none'>
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions
