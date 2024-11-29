import { useState, useMemo } from 'react'

// Dummy product data
const products = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    description: "Locally grown organic tomatoes, perfect for salads and cooking.",
    price: 120,
    unit: "kg",
    category: "Vegetables",
    location: "Nakuru",
    farmer: "John Kimani",
    image: "https://images.unsplash.com/photo-1546470427-e26264b3b9af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    name: "Premium Arabica Coffee Beans",
    description: "High-quality Arabica coffee beans from the highlands.",
    price: 800,
    unit: "kg",
    category: "Grains",
    location: "Nyeri",
    farmer: "Sarah Wanjiku",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    name: "Fresh Milk",
    description: "Fresh cow milk from grass-fed cows, delivered daily.",
    price: 65,
    unit: "liter",
    category: "Dairy",
    location: "Eldoret",
    farmer: "David Kiprop",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    name: "Sweet Mangoes",
    description: "Ripe and sweet mangoes, perfect for juice or eating fresh.",
    price: 150,
    unit: "dozen",
    category: "Fruits",
    location: "Mombasa",
    farmer: "Ali Hassan",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    name: "Fresh Green Peas",
    description: "Freshly harvested green peas, perfect for cooking.",
    price: 200,
    unit: "kg",
    category: "Vegetables",
    location: "Nakuru",
    farmer: "Mary Njeri",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    name: "Fresh Eggs",
    description: "Farm fresh eggs from free-range chickens.",
    price: 450,
    unit: "tray",
    category: "Poultry",
    location: "Kisumu",
    farmer: "Jane Adhiambo",
    image: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9efd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    name: "Organic Honey",
    description: "Pure, organic honey from local beekeepers.",
    price: 750,
    unit: "kg",
    category: "Other",
    location: "Kitui",
    farmer: "Peter Mutua",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    name: "Fresh Carrots",
    description: "Organic carrots, freshly harvested.",
    price: 80,
    unit: "kg",
    category: "Vegetables",
    location: "Nanyuki",
    farmer: "James Mwangi",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
  }
]

const categories = ["All", "Vegetables", "Fruits", "Grains", "Dairy", "Poultry", "Other"]
const locations = ["All", "Nakuru", "Nyeri", "Eldoret", "Mombasa", "Kisumu", "Kitui", "Nanyuki"]

function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")

  // Filter products based on search query, category, and location
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === "All" || product.category === selectedCategory
      
      const matchesLocation = 
        selectedLocation === "All" || product.location === selectedLocation

      return matchesSearch && matchesCategory && matchesLocation
    })
  }, [searchQuery, selectedCategory, selectedLocation])

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
      <div className="p-4 bg-base-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="form-control flex-1">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search products, descriptions, or farmers..." 
                className="input input-bordered w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <select 
            className="select select-bordered w-full md:w-48"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select 
            className="select select-bordered w-full md:w-48"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Results count */}
          <div className="text-sm breadcrumbs mb-4">
            <ul>
              <li>Showing {filteredProducts.length} products</li>
              {searchQuery && <li>Search: "{searchQuery}"</li>}
              {selectedCategory !== "All" && <li>Category: {selectedCategory}</li>}
              {selectedLocation !== "All" && <li>Location: {selectedLocation}</li>}
            </ul>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                <figure className="relative h-48">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 badge badge-primary">{product.category}</div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {product.name}
                  </h2>
                  <p className="text-sm">{product.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {product.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {product.farmer}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-primary">
                      KSh {product.price}
                      <span className="text-sm font-normal text-base-content/70">/{product.unit}</span>
                    </span>
                    <div className="badge badge-secondary">In Stock</div>
                  </div>
                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-primary">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-base-content/70">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Marketplace
