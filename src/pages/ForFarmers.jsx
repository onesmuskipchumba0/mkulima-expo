import React from 'react'

function ForFarmers() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-primary text-primary-content">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">For Farmers</h1>
            <p className="py-6">Grow your farming business with MkulimaExpo. Get better prices and reach more customers.</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits for Farmers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="card-title">Better Prices</h3>
                <p>Sell directly to buyers and get better prices for your produce</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="card-title">Wider Reach</h3>
                <p>Access a larger market and connect with buyers nationwide</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title">Market Insights</h3>
                <p>Get valuable market data and trends to make informed decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="steps steps-vertical lg:steps-horizontal w-full">
            <div className="step step-primary">
              <div className="text-center">
                <div className="text-xl font-bold">Create Account</div>
                <p className="text-sm">Sign up as a farmer</p>
              </div>
            </div>
            <div className="step step-primary">
              <div className="text-center">
                <div className="text-xl font-bold">List Products</div>
                <p className="text-sm">Add your produce</p>
              </div>
            </div>
            <div className="step step-primary">
              <div className="text-center">
                <div className="text-xl font-bold">Get Orders</div>
                <p className="text-sm">Receive buyer requests</p>
              </div>
            </div>
            <div className="step step-primary">
              <div className="text-center">
                <div className="text-xl font-bold">Sell & Deliver</div>
                <p className="text-sm">Complete transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="mb-8">Join thousands of successful farmers on MkulimaExpo</p>
          <button className="btn btn-secondary btn-lg">Register as a Farmer</button>
        </div>
      </div>
    </div>
  )
}

export default ForFarmers
