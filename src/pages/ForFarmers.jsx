import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'
import { Link } from 'react-router-dom'

export default function ForFarmers() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [myListings, setMyListings] = useState([])
  const [showListingForm, setShowListingForm] = useState(false)
  const initialFormState = {
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: '',
    price_per_unit: '',
    location: '',
    availability_date: new Date().toISOString().split('T')[0],
  }
  const [newListing, setNewListing] = useState(initialFormState)

  // Categories for products
  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Poultry',
    'Livestock',
    'Other'
  ]

  // Units for measurement
  const units = [
    'kg',
    'g',
    'ton',
    'piece',
    'dozen',
    'crate',
    'bag',
    'liter'
  ]

  useEffect(() => {
    if (user) {
      fetchMyListings()
    }
  }, [user])

  const clearMessage = useCallback(() => {
    setTimeout(() => {
      setMessage({ type: '', content: '' })
    }, 5000)
  }, [])

  const fetchMyListings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('product_listings')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMyListings(data || [])
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', content: error.message })
      clearMessage()
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewListing(initialFormState)
  }

  const validateForm = () => {
    if (!newListing.title.trim()) {
      setMessage({ type: 'error', content: 'Please enter a product title' })
      return false
    }
    if (!newListing.category) {
      setMessage({ type: 'error', content: 'Please select a category' })
      return false
    }
    if (!newListing.quantity || newListing.quantity <= 0) {
      setMessage({ type: 'error', content: 'Please enter a valid quantity' })
      return false
    }
    if (!newListing.unit) {
      setMessage({ type: 'error', content: 'Please select a unit' })
      return false
    }
    if (!newListing.price_per_unit || newListing.price_per_unit <= 0) {
      setMessage({ type: 'error', content: 'Please enter a valid price' })
      return false
    }
    if (!newListing.location.trim()) {
      setMessage({ type: 'error', content: 'Please enter a location' })
      return false
    }
    if (!newListing.description.trim()) {
      setMessage({ type: 'error', content: 'Please enter a description' })
      return false
    }
    return true
  }

  const handleSubmitListing = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      clearMessage()
      return
    }

    try {
      setFormLoading(true)
      const { error } = await supabase
        .from('product_listings')
        .insert([
          {
            ...newListing,
            farmer_id: user.id,
            quantity: parseFloat(newListing.quantity),
            price_per_unit: parseFloat(newListing.price_per_unit)
          }
        ])

      if (error) throw error

      setMessage({ type: 'success', content: 'Product listed successfully!' })
      clearMessage()
      setShowListingForm(false)
      resetForm()
      fetchMyListings()
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', content: error.message })
      clearMessage()
    } finally {
      setFormLoading(false)
    }
  }

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewListing((prev) => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const NotLoggedInContent = () => (
    <div className="hero min-h-[60vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">For Farmers</h1>
          <p className="py-6">
            Join MkulimaExpo to list your products and connect directly with buyers.
            Get better prices and reach more customers.
          </p>
          <Link to="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </div>
  )

  const ListingForm = () => (
    <div className="bg-base-100 rounded-lg shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">New Product Listing</h2>
      <form onSubmit={handleSubmitListing} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered"
              value={newListing.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              name="category"
              className="select select-bordered"
              value={newListing.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              name="quantity"
              className="input input-bordered"
              value={newListing.quantity}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Unit</span>
            </label>
            <select
              name="unit"
              className="select select-bordered"
              value={newListing.unit}
              onChange={handleInputChange}
              required
            >
              <option value="">Select unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Price per Unit (KSh)</span>
            </label>
            <input
              type="number"
              name="price_per_unit"
              className="input input-bordered"
              value={newListing.price_per_unit}
              onChange={handleInputChange}
              required
              min="0.01"
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
              value={newListing.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Available From</span>
            </label>
            <input
              type="date"
              name="availability_date"
              className="input input-bordered"
              value={newListing.availability_date}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered h-24"
              value={newListing.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setShowListingForm(false)
              resetForm()
            }}
            disabled={formLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${formLoading ? 'loading' : ''}`}
            disabled={formLoading}
          >
            {formLoading ? 'Posting...' : 'Post Listing'}
          </button>
        </div>
      </form>
    </div>
  )

  const LoggedInContent = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowListingForm(!showListingForm)}
          disabled={formLoading}
        >
          {showListingForm ? 'Cancel' : '+ New Listing'}
        </button>
      </div>

      {message.content && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-4`}>
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

      {showListingForm && <ListingForm />}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">My Listings</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((listing) => (
              <div key={listing.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">{listing.title}</h3>
                  <div className="badge badge-primary">{listing.category}</div>
                  <p className="text-sm">{listing.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold">
                      KSh {listing.price_per_unit}/{listing.unit}
                    </span>
                    <span className="badge badge-secondary">
                      {listing.quantity} {listing.unit} available
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {listing.location}
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-outline">Edit</button>
                    <button className="btn btn-sm btn-error btn-outline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/70">No listings yet. Create your first listing!</p>
          </div>
        )}
      </div>
    </div>
  )

  return user ? <LoggedInContent /> : <NotLoggedInContent />
}
