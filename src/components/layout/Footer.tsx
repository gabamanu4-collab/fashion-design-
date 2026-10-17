import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#141210] text-[#E8E4DD] border-t border-[#26221E] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2B2722]">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="text-xl font-serif font-bold tracking-wider text-white">
              FD ATELIER
            </Link>
            <p className="text-xs text-[#A8A29A] leading-relaxed">
              The premier digital portfolio atelier for fashion design students, graduates, and haute couture practitioners.
            </p>
            <p className="text-[11px] font-mono tracking-widest text-[#78716A]">
              EST. 2026 · DIGITAL RUNWAY
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white font-mono">Platform</h4>
            <ul className="space-y-2 text-xs text-[#A8A29A]">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore Portfolios</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Editorial Features</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">Create Portfolio</Link>
              </li>
            </ul>
          </div>

          {/* Disciplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white font-mono">Specializations</h4>
            <ul className="space-y-2 text-xs text-[#A8A29A]">
              <li>
                <Link to="/explore?specialization=Haute+Couture" className="hover:text-white transition-colors">Haute Couture</Link>
              </li>
              <li>
                <Link to="/explore?specialization=Ready-to-Wear" className="hover:text-white transition-colors">Ready-to-Wear (RTW)</Link>
              </li>
              <li>
                <Link to="/explore?specialization=Avant-Garde" className="hover:text-white transition-colors">Avant-Garde &amp; Wearable Art</Link>
              </li>
              <li>
                <Link to="/explore?specialization=Knitwear" className="hover:text-white transition-colors">Knitwear &amp; Textiles</Link>
              </li>
            </ul>
          </div>

          {/* Atelier & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white font-mono">Information</h4>
            <ul className="space-y-2 text-xs text-[#A8A29A]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About the Atelier</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact &amp; Inquiries</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/database-setup" className="hover:text-white transition-colors">Platform Infrastructure</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716A]">
          <p>© 2026 FD Atelier. All fashion portfolios copyrighted to their respective creators.</p>
          <div className="flex items-center gap-6">
            <span>Encrypted Cloud Storage</span>
            <span>·</span>
            <span>High-Fidelity Archival</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
