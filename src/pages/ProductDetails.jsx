import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { formatPhoneNumber } from '../utils/phoneUtils';
import { BsTelephone } from 'react-icons/bs';
import { IoLogoWhatsapp, IoPerson } from 'react-icons/io5';
import { IoArrowBack } from 'react-icons/io5';

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      // First, verify the ID is valid UUID format
      if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
        throw new Error('Invalid product ID');
      }

      // Fetch the main product
      const { data: productData, error: productError } = await supabase
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

      if (productError) throw productError;

      if (productData) {
        setProduct(productData);
        
        // Fetch related products (same category, excluding current product)
        const { data: relatedData, error: relatedError } = await supabase
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
          .eq('category', productData.category)
          .neq('id', id)
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError(err.message || 'Failed to load product details');
    } finally {
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
        <h2 className="text-2xl font-bold mb-4">
          {error || 'Product not found'}
        </h2>
        <Link to="/marketplace" className="btn btn-primary">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const farmer = product.profiles;

  const handleCall = () => {
    window.location.href = `tel:${formatPhoneNumber(farmer.phone_number)}`;
  };

  const handleWhatsApp = () => {
    const phone = formatPhoneNumber(farmer.phone_number);
    const message = `Hello, I'm interested in your ${product.title} listed on MkulimaExpo.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="py-8 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Link 
              to="/marketplace" 
              className="btn btn-ghost gap-2 hover:-translate-x-1 transition-transform"
            >
              <IoArrowBack className="text-xl" />
              Back to Marketplace
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image and Details */}
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-xl">
                <figure className="px-4 pt-4">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]}
                      alt={product.title}
                      className="rounded-xl w-full h-[400px] object-cover"
                    />
                  ) : (
                    <img 
                      src={'https://placehold.co/600x400'} 
                      alt={product.title}
                      className="rounded-xl w-full h-[400px] object-cover"
                    />
                  )}
                </figure>
                <div className="card-body">
                  <h1 className="card-title text-3xl font-bold text-primary">{product.title}</h1>
                  <p className="text-lg mb-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="badge badge-primary badge-lg text-lg">KSH {product.price_per_unit} per {product.unit}</div>
                    <div className="badge badge-secondary badge-lg">{product.category}</div>
                    <div className="badge badge-accent badge-lg">{product.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-xl border border-primary/20">
                <div className="card-body">
                  <h2 className="card-title text-primary mb-4">Seller Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <IoPerson className="text-2xl text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{farmer?.farm_name || farmer?.full_name}</h3>
                        <p className="text-sm opacity-75">Verified Seller</p>
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="space-y-3">
                      <p className="text-lg"><span className="font-semibold">Location:</span> {farmer?.location}</p>
                      <p className="text-lg"><span className="font-semibold">Phone:</span> {formatPhoneNumber(farmer.phone_number)}</p>
                    </div>
                    <div className="card-actions justify-between pt-4 gap-4">
                      <button 
                        onClick={handleCall} 
                        className="btn btn-primary flex-1 gap-2 hover:scale-105 transition-transform"
                      >
                        <BsTelephone className="text-xl" />
                        Call Seller
                      </button>
                      <button 
                        onClick={handleWhatsApp} 
                        className="btn btn-success flex-1 gap-2 hover:scale-105 transition-transform"
                      >
                        <IoLogoWhatsapp className="text-xl" />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="stats shadow w-full">
                <div className="stat place-items-center">
                  <div className="stat-title">Category</div>
                  <div className="stat-value text-primary text-2xl">{product.category}</div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title">Price</div>
                  <div className="stat-value text-secondary text-2xl">KSH {product.price_per_unit} per {product.unit}</div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title">Location</div>
                  <div className="stat-value text-accent text-2xl">{product.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="py-16 bg-base-200">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">Similar Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  to={`/product/${relatedProduct.id}`}
                  key={relatedProduct.id} 
                  className="card bg-base-100 shadow-xl border border-primary/20 hover:shadow-2xl transition-shadow duration-300"
                >
                  <figure className="px-4 pt-4">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img 
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        className="rounded-xl w-full h-48 object-cover"
                      />
                    ) : (
                      <img 
                        src={'https://placehold.co/600x400'} 
                        alt={relatedProduct.title}
                        className="rounded-xl w-full h-48 object-cover"
                      />
                    )}
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-primary">{relatedProduct.title}</h3>
                    <p className="line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="badge badge-primary">KSH {relatedProduct.price_per_unit} per {relatedProduct.unit}</div>
                      <div className="badge badge-secondary">{relatedProduct.category}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-primary text-primary-content py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Selling Your Products</h2>
          <p className="mb-8 text-lg">
            Join MkulimaExpo today and reach thousands of potential buyers across Kenya.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn btn-secondary">
              🌾 List Your Products
            </Link>
            <Link to="/marketplace" className="btn btn-accent">
              🛒 Browse More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
