import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="navbar bg-primary text-primary-content shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-primary text-primary-content rounded-box w-52">
              <li><a className="text-white">Marketplace</a></li>
              <li><a className="text-white">For Farmers</a></li>
              <li><a className="text-white">For Buyers</a></li>
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl">🌾 MkulimaExpo</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a>Marketplace</a></li>
            <li><a>For Farmers</a></li>
            <li><a>For Buyers</a></li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn btn-ghost">Sign In</a>
          <a className="btn bg-secondary hover:bg-secondary-focus text-white">Get Started</a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero min-h-[80vh] bg-base-200" style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Grow Your Farm Business</h1>
            <p className="mb-5">Connect directly with buyers, get better prices for your produce, and grow your farming business with MkulimaExpo.</p>
            <button className="btn btn-primary">Start Selling Today</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">Why Choose MkulimaExpo?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="card-title text-primary">Direct Farm Sales</h3>
              <p>Sell your produce directly to buyers without middlemen</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="card-title text-primary">Better Prices</h3>
              <p>Get fair prices for your agricultural products</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl border border-primary/20">
            <div className="card-body items-center text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="card-title text-primary">Easy Platform</h3>
              <p>Simple and user-friendly platform for all</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-content py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="mb-8 max-w-2xl mx-auto">Whether you're a farmer looking to sell your produce or a buyer seeking quality agricultural products, MkulimaExpo is here for you.</p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-secondary">🌾 Join as Farmer</button>
            <button className="btn btn-accent">🛒 Join as Buyer</button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="stats shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Active Farmers</div>
              <div className="stat-value text-primary">1,000+</div>
              <div className="stat-desc">From various regions</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Products Sold</div>
              <div className="stat-value text-secondary">50,000+</div>
              <div className="stat-desc">Last year</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Satisfied Buyers</div>
              <div className="stat-value text-accent">2,000+</div>
              <div className="stat-desc">Across the country</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-10 bg-neutral text-neutral-content">
        <div>
          <span className="footer-title">Services</span> 
          <a className="link link-hover">Marketplace</a>
          <a className="link link-hover">For Farmers</a>
          <a className="link link-hover">For Buyers</a>
          <a className="link link-hover">Support</a>
        </div> 
        <div>
          <span className="footer-title">Company</span> 
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Press kit</a>
        </div> 
        <div>
          <span className="footer-title">Legal</span> 
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </div>
      </footer>
    </div>
  )
}

export default App
