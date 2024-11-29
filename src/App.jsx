import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import ForFarmers from './pages/ForFarmers'
import ForBuyers from './pages/ForBuyers'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100 flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><Link to="/marketplace">Marketplace</Link></li>
                <li><Link to="/for-farmers">For Farmers</Link></li>
                <li><Link to="/for-buyers">For Buyers</Link></li>
              </ul>
            </div>
            <Link to="/" className="btn btn-ghost normal-case text-xl">🌾 MkulimaExpo</Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/for-farmers">For Farmers</Link></li>
              <li><Link to="/for-buyers">For Buyers</Link></li>
            </ul>
          </div>
          <div className="navbar-end">
            <Link to="/signin" className="btn btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn bg-secondary hover:bg-secondary-focus text-white">Get Started</Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/for-farmers" element={<ForFarmers />} />
            <Route path="/for-buyers" element={<ForBuyers />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer p-10 bg-neutral text-neutral-content">
          <div>
            <span className="footer-title">Services</span> 
            <Link to="/marketplace" className="link link-hover">Marketplace</Link>
            <Link to="/for-farmers" className="link link-hover">For Farmers</Link>
            <Link to="/for-buyers" className="link link-hover">For Buyers</Link>
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
    </Router>
  )
}

export default App
