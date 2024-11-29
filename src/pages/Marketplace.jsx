import React, { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { formatPhoneNumber } from '../utils/phoneUtils'

export default function Marketplace() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  })
  const [error, setError] = useState(null)
  const [message, setMessage] = useState({ type: '', content: '' })

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Poultry',
    'Livestock',
    'Other'
  ]

  useEffect(() => {
    fetchListings()

    // Set up real-time subscription
    const channel = supabase
      .channel('public:product_listings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_listings'
        },
        (payload) => {
          console.log('Change received!', payload)
          fetchListings()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [filters])

  const fetchListings = async () => {
    try {
      setLoading(true)
      setError(null)
      setMessage({ type: '', content: '' })

      // First, test the connection with a simple query
      const { data: testData, error: testError } = await supabase
        .from('product_listings')
        .select('id')
        .limit(1)

      if (testError) {
        console.error('Connection test failed:', testError)
        throw new Error('Database connection failed')
      }

      // Build the main query
      let query = supabase
        .from('product_listings')
        .select(`
          *,
          profiles (
            id,
            full_name,
            phone_number,
            location,
            farm_name,
            farm_size,
            main_products,
            company_name,
            business_type
          )
        `)
        .eq('status', 'available')

      // Apply filters if they exist
      if (filters.search?.trim()) {
        const searchTerm = filters.search.trim()
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters.minPrice && !isNaN(parseFloat(filters.minPrice))) {
        query = query.gte('price_per_unit', parseFloat(filters.minPrice))
      }
      
      if (filters.maxPrice && !isNaN(parseFloat(filters.maxPrice))) {
        query = query.lte('price_per_unit', parseFloat(filters.maxPrice))
      }
      
      if (filters.location?.trim()) {
        query = query.ilike('location', `%${filters.location.trim()}%`)
      }

      // Add ordering
      query = query.order('created_at', { ascending: false })

      // Execute the query
      const { data, error: queryError } = await query

      if (queryError) {
        console.error('Query failed:', queryError)
        throw queryError
      }

      // Update state based on results
      if (Array.isArray(data)) {
        console.log('Fetched listings:', data)
        const processedListings = data.map(listing => ({
          ...listing,
          farmer: listing.profiles?.[0] || null // Access the first (and should be only) profile
        }))
        setListings(processedListings)
        
        if (processedListings.length === 0) {
          setMessage({
            type: 'info',
            content: 'No listings found matching your criteria. Try adjusting your filters.'
          })
        }
      } else {
        console.error('Unexpected data format:', data)
        throw new Error('Received invalid data format from server')
      }
    } catch (error) {
      console.error('Error in fetchListings:', error)
      setError(error.message)
      setMessage({
        type: 'error',
        content: `Failed to fetch listings: ${error.message}`
      })
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    fetchListings()
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    })
    fetchListings()
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <form onSubmit={applyFilters} className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  name="search"
                  className="input input-bordered"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  name="category"
                  className="select select-bordered"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Min Price (KSh)</span>
                </label>
                <input
                  type="number"
                  name="minPrice"
                  className="input input-bordered"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Price (KSh)</span>
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  className="input input-bordered"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className="input input-bordered"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Enter location..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button type="submit" className="btn btn-primary">
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {message.content && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : message.type === 'info' ? 'alert-info' : 'alert-success'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              {message.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{message.content}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <div key={listing.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {/* Product Image */}
                {listing.images && listing.images.length > 0 && (
                  <figure className="relative pt-[56.25%]">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    {listing.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-75 px-2 py-1 rounded-full text-sm">
                        +{listing.images.length - 1} more
                      </div>
                    )}
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title text-xl font-bold">{listing.title}</h2>
                  
                  {/* Farmer Information */}
                  <div className="bg-base-200 rounded-lg p-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="avatar text-center self-center flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-content text-3xl font-semibold">
                          {listing.profiles?.full_name?.[0] || 'A'}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {listing.profiles?.full_name || 'Anonymous Farmer'}
                        </h3>
                        {listing.profiles?.farm_name && (
                          <p className="text-sm text-gray-600">
                            {listing.profiles.farm_name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          📍 {listing.profiles?.location || listing.location}
                        </p>
                      </div>
                    </div>
                    {listing.profiles?.main_products && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Main Products:</span> {listing.profiles.main_products}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-4 text-gray-600">{listing.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="text-sm font-medium">Category</span>
                      <p className="text-primary">{listing.category}</p>
                    </div>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="text-sm font-medium">Quantity</span>
                      <p>{listing.quantity} {listing.unit}</p>
                    </div>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="text-sm font-medium">Price per Unit</span>
                      <p className="text-success font-semibold">KSh {listing.price_per_unit}</p>
                    </div>
                    <div className="bg-base-200 p-3 rounded-lg">
                      <span className="text-sm font-medium">Total Value</span>
                      <p className="text-success font-semibold">
                        KSh {(listing.quantity * listing.price_per_unit).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 bg-base-200 p-3 rounded-lg">
                    <span className="text-sm font-medium">Available From</span>
                    <p>{new Date(listing.availability_date).toLocaleDateString()}</p>
                  </div>

                  {user ? (
                    <div className="card-actions justify-center mt-4 gap-2">
                      <a
                        href={`tel:${formatPhoneNumber(listing.profiles?.phone_number)}`}
                        className="btn btn-primary gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Call Farmer
                      </a>
                      {listing.profiles?.phone_number && (
                        <a
                          href={`https://wa.me/${formatPhoneNumber(listing.profiles.phone_number).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success gap-2"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}
                      <Link
                        to={`/marketplace/${listing.id}`}
                        className="btn btn-secondary gap-2"
                      >
                        View Details
                      </Link>
                    </div>
                  ) : (
                    <div className="card-actions justify-end mt-4">
                      <Link to="/login" className="btn btn-outline btn-primary">
                        Login to Contact Farmer
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
