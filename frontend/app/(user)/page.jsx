'use client';

import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Home/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { useEffect, useState } from "react";
import { fetchProductsByFilters } from "../../redux/slices/productsSlice";
import axios from "axios";

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Botton Wear",
        limit: 8,
      })
    );

    // fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <main>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best seller */}
      <h2 className="text-3xl text-center font-bold mb-4">
        Best Seller
      </h2>
      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />) : (
        <p className="text-center">Loading best seller product ...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />

      <FeaturesSection />

    </main>
  );
}
