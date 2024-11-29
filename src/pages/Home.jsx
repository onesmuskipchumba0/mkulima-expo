import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      title: "For Farmers",
      description: "List your agricultural products and reach buyers across Kenya",
      icon: "🌾",
      link: "/for-farmers"
    },
    {
      title: "For Buyers",
      description: "Find quality agricultural products directly from farmers",
      icon: "🛒",
      link: "/for-buyers"
    },
    {
      title: "Direct Communication",
      description: "Connect directly with farmers or buyers via WhatsApp and calls",
      icon: "📱",
      link: "/marketplace"
    }
  ];

  const howItWorks = [
    {
      title: "Create Account",
      description: "Sign up for free and complete your profile",
      icon: "👤"
    },
    {
      title: "List or Browse",
      description: "Post your products or browse available listings",
      icon: "📝"
    },
    {
      title: "Connect",
      description: "Communicate directly with farmers or buyers",
      icon: "🤝"
    },
    {
      title: "Trade",
      description: "Complete your agricultural trade successfully",
      icon: "✅"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="hero min-h-[80vh]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-8">Grow Your Farm Business</h1>
            <p className="text-xl mb-8">
              Connect directly with buyers, get better prices for your produce, and grow your farming business with MkulimaExpo.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/marketplace" className="btn btn-primary">
                Browse Marketplace
              </Link>
              <Link to="/signup" className="btn btn-secondary">
                Start Selling Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Why Choose MkulimaExpo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link 
                to={feature.link}
                key={index} 
                className="card bg-base-100 shadow-xl border border-primary/20 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl text-primary-content">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="card bg-base-100 shadow-xl border border-primary/20">
                <div className="card-body text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl text-primary-content">{step.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-primary">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="stats shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">Active Listings</div>
              <div className="stat-value text-primary">500+</div>
              <div className="stat-desc">Products available</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Farmers</div>
              <div className="stat-value text-secondary">200+</div>
              <div className="stat-desc">Registered sellers</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Buyers</div>
              <div className="stat-value text-accent">1000+</div>
              <div className="stat-desc">Active buyers</div>
            </div>
            
            <div className="stat place-items-center">
              <div className="stat-title">Counties</div>
              <div className="stat-value">47</div>
              <div className="stat-desc">Across Kenya</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-content py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="mb-8 text-lg">
            Whether you're a farmer looking to sell your produce or a buyer seeking quality agricultural products, MkulimaExpo is here for you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn btn-secondary">
              🌾 Join as Farmer
            </Link>
            <Link to="/marketplace" className="btn btn-accent">
              🛒 Join as Buyer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
