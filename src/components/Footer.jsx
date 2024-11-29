import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          🌾 MkulimaExpo
        </Link>
        <p>Connecting Farmers and Buyers in Kenya</p>
      </div>
      
      <div>
        <span className="footer-title">Navigation</span>
        <Link to="/marketplace" className="link link-hover">Marketplace</Link>
        <Link to="/for-farmers" className="link link-hover">For Farmers</Link>
        <Link to="/for-buyers" className="link link-hover">For Buyers</Link>
        <Link to="/about" className="link link-hover">About</Link>
        <Link to="/contact" className="link link-hover">Contact</Link>
      </div>
      
      <div>
        <span className="footer-title">Developer</span>
        <a 
          href="mailto:onesmuskipchumba5@gmail.com" 
          className="link link-hover flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email
        </a>
        <a 
          href="https://github.com/onesmuskipchumba0" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="link link-hover flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
        <a 
          href="https://onesmusbett.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="link link-hover flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          Portfolio
        </a>
      </div>

      <div>
        <span className="footer-title">Legal</span>
        <Link to="/privacy-policy" className="link link-hover">Privacy Policy</Link>
        <Link to="/terms" className="link link-hover">Terms of Use</Link>
        <p className="mt-4 text-sm">
          {new Date().getFullYear()} MkulimaExpo. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
