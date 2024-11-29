import { Link } from 'react-router-dom'

export default function Footer() {
  return (
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
  )
}
