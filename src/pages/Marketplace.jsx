import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'

export default function Marketplace() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Poultry',
    'Livestock',
    'Other'
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      let query = supabase
        .from('product_listings')
        .select(`
          *,
          profiles:farmer_id (
            full_name,
            phone_number,
            location
          )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category)
      }
      if (filters.minPrice) {
        query = query.gte('price_per_unit', parseFloat(filters.minPrice))
      }
      if (filters.maxPrice) {
        query = query.lte('price_per_unit', parseFloat(filters.maxPrice))
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Apply search filter on the client side
      let filteredData = data
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        filteredData = data.filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.location.toLowerCase().includes(searchLower)
        )
      }

      setProducts(filteredData || [])
    } catch (error) {
      console.error('Error:', error)
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

  const applyFilters = () => {
    fetchProducts()
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    })
    setSearchTerm('')
    fetchProducts()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        {/* Search and Filters */}
        <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={applyFilters}
                disabled={loading}
              >
                Apply Filters
              </button>
              <button 
                className="btn btn-ghost" 
                onClick={resetFilters}
                disabled={loading}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered w-full"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Min Price (KSh)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                name="minPrice"
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
                className="input input-bordered w-full"
                name="maxPrice"
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
                className="input input-bordered w-full"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location..."
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{product.title}</h2>
                  <div className="badge badge-primary">{product.category}</div>
                  <p className="text-sm mt-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold">
                      KSh {product.price_per_unit}/{product.unit}
                    </span>
                    <span className="badge badge-secondary">
                      {product.quantity} {product.unit} available
                    </span>
                  </div>

                  <div className="divider"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {product.location}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Available from: {formatDate(product.availability_date)}
                    </div>

                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Seller: {product.profiles.full_name}
                    </div>

                    {user && user.id !== product.farmer_id && (
                      <div className="card-actions justify-end mt-4">
                        <button className="btn btn-primary btn-block">
                          Contact Seller
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/70">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
