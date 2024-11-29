import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  const navLinkClasses = ({ isActive }) => 
    `px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-white text-green-500 font-bold' 
        : 'text-white hover:bg-primary-focus'
    }`

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <NavLink 
                to="/marketplace" 
                className={navLinkClasses}
              >
                Marketplace
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/for-farmers" 
                className={navLinkClasses}
              >
                For Farmers
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/for-buyers" 
                className={navLinkClasses}
              >
                For Buyers
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                className={navLinkClasses}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={navLinkClasses}
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/pricing" 
                className={navLinkClasses}
              >
                Pricing
              </NavLink>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl text-white">🌾 MkulimaExpo</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-2 px-1">
          <li>
            <NavLink 
              to="/marketplace" 
              className={navLinkClasses}
            >
              Marketplace
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/for-farmers" 
              className={navLinkClasses}
            >
              For Farmers
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/for-buyers" 
              className={navLinkClasses}
            >
              For Buyers
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/about" 
              className={navLinkClasses}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contact" 
              className={navLinkClasses}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/pricing" 
              className={navLinkClasses}
            >
              Pricing
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">{user.email[0].toUpperCase()}</span>
                </div>
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <NavLink 
                  to="/profile" 
                  className={navLinkClasses}
                >
                  Profile
                </NavLink>
              </li>
              <li><button onClick={signOut} className="text-primary font-bold">Sign Out</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/signin" className="btn btn-ghost text-white">Sign In</Link>
            <Link to="/signup" className="btn bg-secondary hover:bg-secondary-focus text-white">Get Started</Link>
          </>
        )}
      </div>
    </div>
  )
}
