import React from 'react'

function ForBuyers() {
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

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Buy on MkulimaExpo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="card-title">Quality Products</h3>
                <p>Get fresh produce directly from verified farmers</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="card-title">Competitive Prices</h3>
                <p>Fair prices with no middleman markups</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="card-title">Direct Communication</h3>
                <p>Connect directly with farmers for custom orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Vegetables', icon: '🥬' },
              { name: 'Fruits', icon: '🍎' },
              { name: 'Grains', icon: '🌾' },
              { name: 'Dairy', icon: '🥛' },
              { name: 'Poultry', icon: '🐔' },
              { name: 'Meat', icon: '🥩' },
              { name: 'Organic', icon: '🌱' },
              { name: 'Herbs', icon: '🌿' }
            ].map((category) => (
              <div key={category.name} className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow">
                <div className="card-body items-center text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="card-title">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Buyers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="rating mb-4">
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                </div>
                <p>"Great platform to source fresh produce. The quality is always top-notch!"</p>
                <div className="mt-4 font-bold">- John Doe, Restaurant Owner</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="rating mb-4">
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                </div>
                <p>"MkulimaExpo has transformed how we source our ingredients. Highly recommended!"</p>
                <div className="mt-4 font-bold">- Jane Smith, Hotel Manager</div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="rating mb-4">
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                  <input type="radio" className="mask mask-star-2 bg-primary" checked readOnly />
                </div>
                <p>"The direct connection with farmers makes a huge difference in quality and price."</p>
                <div className="mt-4 font-bold">- Mike Johnson, Retailer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Buying Today</h2>
          <p className="mb-8">Join our platform and get access to quality agricultural products</p>
          <button className="btn btn-secondary btn-lg">Register as a Buyer</button>
        </div>
      </div>
    </div>
  )
}

export default ForBuyers
