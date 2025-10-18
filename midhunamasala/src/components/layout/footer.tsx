'use client';

export default function Footer() {
  return (
  <footer className="relative bg-blue-900 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
          
          {/* Left side - Brand name */}
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-50 font-serif tracking-wider uppercase">
              MasalaHeritage
            </h2>
            <p className="text-sm text-blue-200 font-sans tracking-wide uppercase mt-2">
              Authentic Flavors
            </p>
          </div>

          {/* Right side - Social media icons */}
          <div className="flex items-center space-x-4">

            {/* Facebook */}
            <a
              href="#"
              className="w-10 h-10 bg-transparent border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.09h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.716-1.794 1.764v2.313h3.587l-.467 3.616h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href="#"
              className="w-10 h-10 bg-transparent border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.38 4.482A13.944 13.944 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.574 4.897 4.897 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.93 4.93 0 0 1-2.224.085c.626 1.956 2.444 3.379 4.6 3.419A9.868 9.868 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.056 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 23 4.557z" />
              </svg>
            </a>

            {/* YouTube (blue play inside white rounded square) */}
            <a
              href="#"
              className="w-10 h-10 bg-transparent border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden>
                {/* white rounded square background */}
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4" fill="#FFFFFF" />
                {/* blue play triangle */}
                <path d="M10 8.5v7l5.5-3.5L10 8.5z" fill="#2563EB" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="w-10 h-10 bg-transparent border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7.001 2C4.243 2 2 4.243 2 7.001v9.998C2 19.757 4.243 22 7.001 22h9.998C19.757 22 22 19.757 22 17V7.001C22 4.243 19.757 2 17 2H7.001zM12 7.5A4.5 4.5 0 1 1 7.5 12 4.505 4.505 0 0 1 12 7.5zm5.25-1.875a1.125 1.125 0 1 1-1.125 1.125A1.124 1.124 0 0 1 17.25 5.625zM12 9.75A2.25 2.25 0 1 0 14.25 12 2.253 2.253 0 0 0 12 9.75z" />
              </svg>
            </a>

          </div>
        </div>
      </div>

      {/* Subtle SVG pattern overlay for texture (keeps non-gradient requirement) */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="block">
          <defs>
            <pattern id="pattern-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-dots)" />
        </svg>
      </div>

      {/* Bottom copyright */}
      <div className="w-full text-center py-4 relative z-10">
        <p className="text-sm text-blue-200">© 2025 MasalaHeritage. All rights reserved.</p>
      </div>
    </footer>
  );
}