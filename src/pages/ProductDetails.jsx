import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      console.log('Fetching product with ID:', id);
      
      // First, verify the ID is valid UUID format
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error('Invalid product ID');
      }

      // Fetch the product details with farmer profile
      const { data, error } = await supabase
        .from('product_listings')
        .select(`
          *,
          profiles:farmer_id (
            id,
            full_name,
            farm_name,
            location,
            phone_number
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Product not found');
      }

      console.log('Fetched product:', data);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.message || 'Failed to load product details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-error mb-4">
          {error || 'Product not found'}
        </h2>
        <Link to="/marketplace" className="btn btn-primary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const farmer = product.profiles;

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/marketplace" className="btn btn-ghost">
            ← Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              <>
                <div className="relative aspect-square">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-none w-20 h-20 rounded-lg overflow-hidden border-2 
                          ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-base-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🌾</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <p className="text-2xl text-success font-bold">
                KSh {product.price_per_unit} per {product.unit}
              </p>
            </div>

            <div className="divider"></div>

            {/* Farmer Details */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title">Seller Information</h3>
                <p className="font-semibold">
                  {farmer?.farm_name || farmer?.full_name}
                </p>
                <p>📍 {farmer?.location}</p>
                {user && (
                  <div className="space-y-2 mt-4">
                    {farmer?.phone_number && (
                      <p>
                        <span className="font-semibold">Phone:</span>{' '}
                        {farmer.phone_number}
                      </p>
                    )}
                  </div>
                )}
                {!user && (
                  <div className="alert alert-info mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <div>
                      <div className="font-semibold">Login to see contact details</div>
                      <div className="text-sm">Create an account or login to connect with the seller</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{product.category}</p>
                </div>
                <div>
                  <p className="font-semibold">Quantity Available</p>
                  <p>{product.quantity} {product.unit}</p>
                </div>
                {product.availability_date && (
                  <div>
                    <p className="font-semibold">Available From</p>
                    <p>{new Date(product.availability_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Buttons */}
            {user ? (
              <div className="flex gap-4">
                {farmer?.phone_number && (
                  <a
                    href={`tel:${farmer.phone_number}`}
                    className="btn btn-primary flex-1"
                  >
                    📞 Call Seller
                  </a>
                )}
                {farmer?.phone_number && (
                  <a
                    href={`https://wa.me/${farmer.phone_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success flex-1"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <Link to="/signup" className="btn btn-primary w-full">
                Sign Up to Contact Seller
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
