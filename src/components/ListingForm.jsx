import React, { useState } from 'react'
import { supabase } from '../config/supabase'

const categories = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Poultry',
  'Livestock',
  'Other'
]

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

export default function ListingForm({ 
  onClose, 
  onSuccess, 
  editingListing = null,
  userId 
}) {
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState(
    editingListing ? {
      title: editingListing.title,
      description: editingListing.description,
      category: editingListing.category,
      quantity: editingListing.quantity.toString(),
      unit: editingListing.unit,
      price_per_unit: editingListing.price_per_unit.toString(),
      location: editingListing.location,
      availability_date: editingListing.availability_date,
    } : {
      title: '',
      description: '',
      category: '',
      quantity: '',
      unit: '',
      price_per_unit: '',
      location: '',
      availability_date: new Date().toISOString().split('T')[0],
    }
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim()) return false
    if (!formData.category) return false
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) return false
    if (!formData.unit) return false
    if (!formData.price_per_unit || parseFloat(formData.price_per_unit) <= 0) return false
    if (!formData.location.trim()) return false
    if (!formData.description.trim()) return false
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setFormLoading(true)
      
      const listingData = {
        ...formData,
        farmer_id: userId,
        quantity: parseFloat(formData.quantity),
        price_per_unit: parseFloat(formData.price_per_unit),
        status: 'available'
      }

      let error

      if (editingListing) {
        const { error: updateError } = await supabase
          .from('product_listings')
          .update(listingData)
          .eq('id', editingListing.id)
          .eq('farmer_id', userId)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('product_listings')
          .insert([listingData])
        error = insertError
      }

      if (error) throw error

      onSuccess(editingListing ? 'Listing updated successfully!' : 'Product listed successfully!')
      onClose()
    } catch (error) {
      console.error('Error:', error)
      onSuccess(error.message, 'error')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <form onSubmit={handleSubmit} className="card-body">
        <h2 className="card-title mb-4">
          {editingListing ? 'Edit Listing' : 'New Listing'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Title</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered"
              value={formData.title}
              onChange={handleChange}
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
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
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
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Unit</span>
            </label>
            <select
              name="unit"
              className="select select-bordered"
              value={formData.unit}
              onChange={handleChange}
              required
            >
              <option value="">Select unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
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
              value={formData.price_per_unit}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
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
              value={formData.location}
              onChange={handleChange}
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
              value={formData.availability_date}
              onChange={handleChange}
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
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={formLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${formLoading ? 'loading' : ''}`}
            disabled={formLoading}
          >
            {formLoading 
              ? (editingListing ? 'Updating...' : 'Posting...') 
              : (editingListing ? 'Update Listing' : 'Post Listing')
            }
          </button>
        </div>
      </form>
    </div>
  )
}
