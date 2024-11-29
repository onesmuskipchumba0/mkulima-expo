import React from 'react'

function Marketplace() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-primary text-primary-content">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Agricultural Marketplace</h1>
            <p className="py-6">Discover fresh produce directly from farmers across the country.</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="p-4 bg-base-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="form-control flex-1">
            <input type="text" placeholder="Search products..." className="input input-bordered w-full" />
          </div>
          <select className="select select-bordered w-full md:w-48">
            <option disabled selected>Category</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
            <option>Dairy</option>
          </select>
          <select className="select select-bordered w-full md:w-48">
            <option disabled selected>Location</option>
            <option>Nairobi</option>
            <option>Mombasa</option>
            <option>Kisumu</option>
            <option>Nakuru</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Sample Product Cards */}
          {[1, 2, 3, 4, 5, 6, 8].map((item) => (
            <div key={item} className="card bg-base-100 shadow-xl">
              <figure><img src={`https://source.unsplash.com/400x300/?agriculture,farm,${item}`} alt="product" /></figure>
              <div className="card-body">
                <h2 className="card-title">Fresh Produce #{item}</h2>
                <p>High-quality farm products directly from local farmers.</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xl font-bold text-primary">KSh 1,200</span>
                  <div className="badge badge-secondary">In Stock</div>
                </div>
                <div className="card-actions justify-end mt-2">
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Marketplace
