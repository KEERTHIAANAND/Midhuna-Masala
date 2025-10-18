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
              className="w-9 h-9 bg-[#1877F2] rounded-full flex items-center justify-center hover:bg-[#166FE5] transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692V11.09h3.128V8.41c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.716-1.794 1.764v2.313h3.587l-.467 3.616h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="#"
              className="w-9 h-9 bg-gradient-to-r from-[#E4405F] via-[#C13584] to-[#833AB4] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 2C4.238 2 2 4.238 2 7v10c0 2.762 2.238 5 5 5h10c2.762 0 5-2.238 5-5V7c0-2.762-2.238-5-5-5H7zm8 4a1 1 0 110 2 1 1 0 010-2zm-3 1a5 5 0 110 10 5 5 0 010-10z" />
              </svg>
            </a>

            {/* Twitter/X */}
            <a
              href="#"
              className="w-9 h-9 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M23 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.38 4.482A13.944 13.944 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.574 4.897 4.897 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.93 4.93 0 0 1-2.224.085c.626 1.956 2.444 3.379 4.6 3.419A9.868 9.868 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.056 0 14.01-7.506 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 23 4.557z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="#"
              className="w-9 h-9 bg-[#FF0000] rounded-full flex items-center justify-center hover:bg-[#E60000] transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M10 15l5.19-3L10 9v6z" />
                <path d="M21.8 8.001a2.4 2.4 0 0 0-1.687-1.697C18.4 6 12 6 12 6s-6.4 0-8.113.304A2.4 2.4 0 0 0 2.2 8.001 25.3 25.3 0 0 0 2 12a25.3 25.3 0 0 0 .2 3.999 2.4 2.4 0 0 0 1.687 1.697C5.6 18 12 18 12 18s6.4 0 8.113-.304a2.4 2.4 0 0 0 1.687-1.697A25.3 25.3 0 0 0 24 12a25.3 25.3 0 0 0-.2-3.999z" opacity=".2" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              className="w-9 h-9 bg-[#0077B5] rounded-full flex items-center justify-center hover:bg-[#005885] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452z"/>
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