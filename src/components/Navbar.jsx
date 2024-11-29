import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

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
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={signOut}>Sign Out</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/signin" className="btn btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn bg-secondary hover:bg-secondary-focus text-white">Get Started</Link>
          </>
        )}
      </div>
    </div>
  )
}
