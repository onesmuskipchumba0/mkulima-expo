import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'

function ForBuyers() {
  const { user } = useAuth()
  const [recentListings, setRecentListings] = useState([])
  const [trendingCategories, setTrendingCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentListings()
    fetchTrendingCategories()
  }, [])

  const fetchRecentListings = async () => {
    try {
      const { data, error } = await supabase
        .from('product_listings')
        .select(`
          *,
          profiles (
            full_name,
            location,
            farm_name
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(4)

      if (error) throw error
      setRecentListings(data)
    } catch (error) {
      console.error('Error fetching recent listings:', error)
    }
  }

  const fetchTrendingCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_listings')
        .select('category')
        .eq('status', 'available')

      if (error) throw error

      // Count listings per category
      const categoryCounts = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      }, {})

      // Sort categories by count and get top 6
      const trending = Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([category]) => category)

      setTrendingCategories(trending)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching trending categories:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-primary text-primary-content">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">For Buyers</h1>
            <p className="py-6">Source quality agricultural products directly from verified farmers.</p>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Fresh from the Farm</h2>
            <Link to="/marketplace" className="btn btn-primary btn-sm">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map(listing => (
              <div key={listing.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                {listing.images && listing.images.length > 0 && (
                  <figure className="relative pt-[75%]">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </figure>
                )}
                <div className="card-body">
                  <h3 className="card-title">{listing.title}</h3>
                  <p className="text-success font-semibold">KSh {listing.price_per_unit} per {listing.unit}</p>
                  <p className="text-sm text-gray-600">
                    {listing.profiles?.farm_name || listing.profiles?.full_name}
                  </p>
                  <p className="text-sm text-gray-600">📍 {listing.profiles?.location}</p>
                  <div className="card-actions justify-end mt-2">
                    <Link to={`/marketplace/${listing.id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MkulimaExpo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="card-title">Direct from Farmers</h3>
                <p>Get fresh produce directly from verified local farmers. Know exactly where your food comes from.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="card-title">Better Prices</h3>
                <p>Save money by cutting out middlemen. Get wholesale prices for bulk orders.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="card-title">Secure Trading</h3>
                <p>Deal with verified farmers. Build long-term relationships for consistent supply.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingCategories.map(category => (
              <Link
                key={category}
                to={`/marketplace?category=${category}`}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body items-center text-center p-4">
                  <span className="text-3xl mb-2">
                    {category === 'Vegetables' ? '🥬' :
                     category === 'Fruits' ? '🍎' :
                     category === 'Grains' ? '🌾' :
                     category === 'Dairy' ? '🥛' :
                     category === 'Poultry' ? '🐔' :
                     category === 'Livestock' ? '🐄' : '🌿'}
                  </span>
                  <h3 className="font-semibold">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-secondary text-secondary-content">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Buying?</h2>
          <p className="text-xl mb-8">Join our platform and connect with farmers today!</p>
          {!user ? (
            <Link to="/signup" className="btn btn-primary btn-lg">
              Create Buyer Account
            </Link>
          ) : (
            <Link to="/marketplace" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForBuyers
