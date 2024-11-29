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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Call Seller
                  </a>
                )}
                {farmer?.phone_number && (
                  <a
                    href={`https://wa.me/${farmer.phone_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success flex-1 text-white font-semibold"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="ml-2">WhatsApp</span>
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
