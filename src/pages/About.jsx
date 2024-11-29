import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary mb-8">About MkulimaExpo</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          MkulimaExpo is a revolutionary agricultural marketplace platform designed to connect farmers directly with buyers,
          eliminating intermediaries and creating a more efficient agricultural market in Kenya.
        </p>
        <div className="bg-base-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Direct farmer-to-buyer connections</li>
            <li>Real-time product listings</li>
            <li>Secure communication channels</li>
            <li>User-friendly interface</li>
            <li>Mobile-responsive design</li>
            <li>Location-based search</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Frontend</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>React.js</li>
              <li>Tailwind CSS</li>
              <li>DaisyUI</li>
              <li>React Router</li>
            </ul>
          </div>
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Backend</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Supabase</li>
              <li>PostgreSQL</li>
              <li>Authentication</li>
              <li>Storage</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Developer Contact</h2>
        <div className="bg-base-200 p-6 rounded-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Onesmus Kipchumba</h3>
              <p className="text-gray-700">Full Stack Developer</p>
            </div>
            <div className="space-y-2">
              <a 
                href="mailto:onesmuskipchumba5@gmail.com" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                onesmuskipchumba5@gmail.com
              </a>
              <a 
                href="https://github.com/onesmuskipchumba0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub Profile
              </a>
              <a 
                href="https://onesmusbett.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Portfolio Website
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
