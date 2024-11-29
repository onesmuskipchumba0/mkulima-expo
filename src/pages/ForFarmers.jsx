import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'
import { Link, useNavigate } from 'react-router-dom'
import ListingForm from '../components/ListingForm'

export default function ForFarmers() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [listings, setListings] = useState([])
  const [showListingForm, setShowListingForm] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [editingListing, setEditingListing] = useState(null)

  const initialFormState = {
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: '',
    price_per_unit: '',
    location: '',
    availability_date: new Date().toISOString().split('T')[0],
    images: []
  }
  const [newListing, setNewListing] = useState(initialFormState)

  // Memoize the categories and units arrays
  const categories = useMemo(() => [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Poultry',
    'Livestock',
    'Other'
  ], [])

  const units = useMemo(() => [
    'kg',
    'g',
    'ton',
    'piece',
    'dozen',
    'crate',
    'bag',
    'liter'
  ], [])

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchListings()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setUserProfile(profile)
      if (profile.user_type === 'farmer') {
        // fetchMyListings()
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setMessage({ type: 'error', content: 'Error fetching profile' })
    } finally {
      setLoading(false)
    }
  }

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('product_listings')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log('Farmer listings:', data)
      setListings(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleMessageDisplay = useCallback((content, type = 'success') => {
    setMessage({ content, type })
    setTimeout(() => setMessage({ type: '', content: '' }), 5000)
  }, [])

  const clearMessage = useCallback(() => {
    setMessage({ type: '', content: '' })
  }, [])

  const resetForm = () => {
    setNewListing(initialFormState)
  }

  const validateForm = () => {
    const errors = [];
    
    if (!newListing.title.trim()) {
      errors.push('Please enter a product title');
    }
    if (!newListing.category) {
      errors.push('Please select a category');
    }
    if (!newListing.quantity || isNaN(newListing.quantity) || parseFloat(newListing.quantity) <= 0) {
      errors.push('Please enter a valid quantity');
    }
    if (!newListing.unit) {
      errors.push('Please select a unit');
    }
    if (!newListing.price_per_unit || isNaN(newListing.price_per_unit) || parseFloat(newListing.price_per_unit) <= 0) {
      errors.push('Please enter a valid price');
    }
    if (!newListing.location.trim()) {
      errors.push('Please enter a location');
    }
    if (!newListing.description.trim()) {
      errors.push('Please enter a description');
    }
    
    if (errors.length > 0) {
      handleMessageDisplay(errors.join('\n'), 'error');
      return false;
    }
    return true;
  }

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase
        .from('product_listings')
        .delete()
        .eq('id', listingId)
        .eq('farmer_id', user.id) // Security check

      if (error) throw error

      setMessage({ type: 'success', content: 'Listing deleted successfully!' })
      clearMessage()
      fetchListings()
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', content: error.message })
      clearMessage()
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (listing) => {
    setEditingListing(listing)
    setNewListing({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      quantity: listing.quantity.toString(),
      unit: listing.unit,
      price_per_unit: listing.price_per_unit.toString(),
      location: listing.location,
      availability_date: listing.availability_date,
    })
    setShowListingForm(true)
  }

  const handleSubmitListing = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setFormLoading(true)
      
      const listingData = {
        ...newListing,
        farmer_id: user.id,
        quantity: parseFloat(newListing.quantity),
        price_per_unit: parseFloat(newListing.price_per_unit),
        status: 'available'
      }

      let result;
      
      if (editingListing) {
        result = await supabase
          .from('product_listings')
          .update(listingData)
          .eq('id', editingListing.id)
          .eq('farmer_id', user.id)
      } else {
        result = await supabase
          .from('product_listings')
          .insert([listingData])
      }

      if (result.error) {
        throw result.error
      }

      handleMessageDisplay(
        editingListing 
          ? 'Listing updated successfully!' 
          : 'Product listed successfully!',
        'success'
      )
      
      setShowListingForm(false)
      setEditingListing(null)
      resetForm()
      await fetchListings()
    } catch (error) {
      console.error('Error:', error)
      handleMessageDisplay(error.message || 'An error occurred while saving the listing', 'error')
    } finally {
      setFormLoading(false)
    }
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    
    // Validate file types and sizes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', content: `${file.name} is not an image file` })
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', content: `${file.name} is too large (max 5MB)` })
        return
      }
    }

    setNewListing(prev => ({
      ...prev,
      images: files
    }))
  }

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setNewListing(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleFormClose = () => {
    setShowListingForm(false)
    setEditingListing(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage({ type: '', content: '' })

    try {
      if (!user) throw new Error('You must be logged in to create a listing')

      // Upload images first if any
      const uploadedImageUrls = []
      if (newListing.images && newListing.images.length > 0) {
        for (const file of newListing.images) {
          try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            console.log('Uploading file:', filePath)

            const { error: uploadError, data } = await supabase.storage
              .from('product-images')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              })

            if (uploadError) {
              console.error('Upload error:', uploadError)
              throw uploadError
            }

            console.log('Upload successful:', data)

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(filePath)

            console.log('Public URL:', publicUrl)
            uploadedImageUrls.push(publicUrl)
          } catch (uploadError) {
            console.error('Error uploading file:', uploadError)
            throw new Error(`Failed to upload image: ${uploadError.message}`)
          }
        }
      }

      const listingData = {
        ...newListing,
        farmer_id: user.id,
        images: uploadedImageUrls,
        quantity: parseFloat(newListing.quantity),
        price_per_unit: parseFloat(newListing.price_per_unit)
      }

      // Remove the file objects before sending to database
      delete listingData.imageFiles

      console.log('Saving listing data:', listingData)

      const { error: dbError } = await supabase
        .from('product_listings')
        .insert([listingData])

      if (dbError) {
        console.error('Database error:', dbError)
        throw dbError
      }

      setMessage({ type: 'success', content: 'Listing created successfully!' })
      setNewListing(initialFormState)
      setShowListingForm(false)
      fetchListings()
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <div className="alert alert-warning">
            <div>
              <span>Please complete your profile first.</span>
              <Link to="/profile" className="btn btn-primary btn-sm ml-4">
                Go to Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userProfile.user_type === 'buyer') {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-bold">Access Restricted</h3>
              <div className="text-sm">This section is only for farmers. Please update your profile type to access farmer features.</div>
            </div>
            <Link to="/profile" className="btn btn-sm">Update Profile</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowListingForm(!showListingForm)}
          >
            {showListingForm ? 'Cancel' : '+ New Listing'}
          </button>
        </div>

        {message.content && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              {message.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            <span>{message.content}</span>
          </div>
        )}

        {showListingForm && (
          <ListingForm
            onClose={handleFormClose}
            onSuccess={handleMessageDisplay}
            editingListing={editingListing}
            userId={user.id}
            handleSubmitListing={handleSubmitListing}
            handleInputChange={handleInputChange}
            newListing={newListing}
            formLoading={formLoading}
          >
            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Product Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newListing.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
                  className="input input-bordered w-full"
                />
              </div>
              {/* Description */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Product Description</span>
                </label>
                <textarea
                  name="description"
                  value={newListing.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>

            {/* Image Upload Field */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Product Images</span>
                <span className="label-text-alt text-gray-500">(You can select multiple images)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
              {newListing.images?.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto p-2">
                  {Array.from(newListing.images).map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = Array.from(newListing.images).filter((_, i) => i !== index)
                          setNewListing(prev => ({ ...prev, images: newImages }))
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleFormClose}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
              >
                {formLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  editingListing ? 'Update Listing' : 'Create Listing'
                )}
              </button>
            </div>
          </ListingForm>
        )}

        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Product Image Gallery */}
                {listing.images && listing.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {listing.images.map((imageUrl, index) => (
                      <div key={index} className="relative flex-none">
                        <img
                          src={imageUrl}
                          alt={`${listing.title} - Image ${index + 1}`}
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title">{listing.title}</h2>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                      </svg>
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button onClick={() => {
                          setEditingListing(listing)
                          setShowListingForm(true)
                        }}>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button onClick={() => handleDelete(listing.id)} className="text-error">
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <p>{listing.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <p>{listing.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Quantity</span>
                    <p>{listing.quantity} {listing.unit}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Price per Unit</span>
                    <p>KSh {listing.price_per_unit}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <p>{listing.location}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Available From</span>
                  <p>{new Date(listing.availability_date).toLocaleDateString()}</p>
                </div>
                <div className="mt-2">
                  <span className={`badge ${listing.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                    {listing.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {listings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No listings yet. Create your first listing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
