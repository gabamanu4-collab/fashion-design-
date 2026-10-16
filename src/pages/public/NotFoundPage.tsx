import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scissors } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="w-12 h-12 rounded-full bg-[#F5F2EB] border border-[#E7E2D6] flex items-center justify-center mx-auto text-[#78716A]">
          <Scissors className="w-6 h-6" />
        </div>
        <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">404 · Uncharted Runway</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210]">
          Page Not Found
        </h1>
        <p className="text-xs text-[#57524A] leading-relaxed">
          The requested page or portfolio archive could not be located. It may have moved or been taken offline by its creator.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Atelier Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
