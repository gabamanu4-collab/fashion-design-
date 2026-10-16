import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPublicPortfolios } from '../../services/portfolioService';
import { fetchCategories } from '../../services/projectService';
import { Portfolio, Category } from '../../types/database';
import { FashionImage } from '../../components/common/FashionImage';
import { Search, Filter, X, ChevronLeft, ChevronRight, Scissors } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const search = searchParams.get('search') || '';
  const specialization = searchParams.get('specialization') || 'all';
  const userType = searchParams.get('userType') || 'all';
  const theme = searchParams.get('theme') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 12;

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(cats));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPublicPortfolios({
      search,
      specialization,
      userType,
      theme,
      page,
      pageSize,
    }).then(({ data, count }) => {
      setPortfolios(data);
      setTotalCount(count);
      setLoading(false);
    });
  }, [search, specialization, userType, theme, page]);

  const updateParam = (key: string, value: string) => {
    const updated = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      updated.set(key, value);
    } else {
      updated.delete(key);
    }
    updated.set('page', '1');
    setSearchParams(updated);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3 pb-6 border-b border-[#E7E2D6]">
        <div className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
          Runway Archives &amp; Portfolios
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141210]">
          Explore Fashion Design Portfolios
        </h1>
        <p className="text-sm text-[#57524A] max-w-2xl">
          Discover curated graduate collections, independent runway monographs, and student technical flats from across the international fashion community.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-[#E7E2D6] rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-[#A3998F] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search portfolio title, designer, or concept..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#DCD7CD] rounded-lg text-xs text-[#141210] placeholder-[#8C827A] focus:outline-hidden focus:border-[#141210]"
            />
          </div>

          {/* Specialization Filter */}
          <div>
            <select
              value={specialization}
              onChange={(e) => updateParam('specialization', e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAF9F6] border border-[#DCD7CD] rounded-lg text-xs text-[#141210] focus:outline-hidden focus:border-[#141210]"
            >
              <option value="all">All Specializations</option>
              <option value="Haute Couture">Haute Couture</option>
              <option value="Ready-to-Wear (RTW)">Ready-to-Wear (RTW)</option>
              <option value="Avant-Garde & Wearable Art">Avant-Garde &amp; Wearable Art</option>
              <option value="Sustainable & Circular Fashion">Sustainable &amp; Circular</option>
              <option value="Knitwear & Textile Design">Knitwear &amp; Textiles</option>
              <option value="Tailoring & Outerwear">Tailoring &amp; Outerwear</option>
            </select>
          </div>

          {/* Designer User Type Filter */}
          <div>
            <select
              value={userType}
              onChange={(e) => updateParam('userType', e.target.value)}
              className="w-full py-2.5 px-3 bg-[#FAF9F6] border border-[#DCD7CD] rounded-lg text-xs text-[#141210] focus:outline-hidden focus:border-[#141210]"
            >
              <option value="all">All Designer Types</option>
              <option value="student">Fashion Students</option>
              <option value="graduate">Recent Graduates</option>
              <option value="professional">Professional Ateliers</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(search || specialization !== 'all' || userType !== 'all') && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#F0ECE1] text-xs">
            <span className="font-mono text-[11px] uppercase text-[#78716A]">Active Filters:</span>
            <button
              onClick={clearAllFilters}
              className="px-2 py-0.5 bg-[#F2EFE9] hover:bg-[#E5E0D5] rounded text-[11px] font-mono text-[#4A453E] flex items-center gap-1 transition-colors"
            >
              <span>Clear All</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
        <span>
          Showing {portfolios.length} of {totalCount} Published Portfolios
        </span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="border border-[#E7E2D6] rounded-xl p-4 bg-white animate-pulse space-y-4">
              <div className="aspect-[3/4] bg-[#F2EFE9] rounded-lg" />
              <div className="h-4 bg-[#F2EFE9] rounded w-3/4" />
              <div className="h-3 bg-[#F2EFE9] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <div className="p-16 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-4">
          <Scissors className="w-10 h-10 text-[#A3998F] mx-auto" />
          <h3 className="font-serif text-2xl font-semibold text-[#141210]">No Matching Portfolios Found</h3>
          <p className="text-xs text-[#57524A] max-w-md mx-auto">
            Try adjusting your search criteria or clearing filters to browse all published fashion archives.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item) => (
            <Link
              key={item.id}
              to={`/portfolio/${item.slug}`}
              className="group border border-[#E7E2D6] rounded-xl overflow-hidden bg-white hover:border-[#141210] transition-all flex flex-col justify-between"
            >
              <div>
                <FashionImage
                  src={item.cover_image_path}
                  alt={item.title}
                  aspectRatio="3:4"
                  category={item.specialization || 'Fashion'}
                  title={item.title}
                />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
                    <span>{item.specialization || 'Haute Couture'}</span>
                    <span className="capitalize">{item.owner?.user_type || 'Designer'}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#141210] group-hover:italic transition-all">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-[#57524A] line-clamp-2">{item.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="px-5 py-3 border-t border-[#F0ECE1] bg-[#FAF9F6] flex items-center justify-between text-xs text-[#78716A]">
                <div>
                  <span className="font-medium text-[#141210]">{item.owner?.display_name || 'Designer'}</span>
                  {item.owner?.institution && (
                    <span className="block text-[11px] opacity-75">{item.owner.institution}</span>
                  )}
                </div>
                <span className="font-mono text-[11px] uppercase group-hover:text-[#141210]">View &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-8 border-t border-[#E7E2D6] flex items-center justify-between">
          <button
            onClick={() => updateParam('page', String(Math.max(page - 1, 1)))}
            disabled={page <= 1}
            className="px-4 py-2 border border-[#DCD7CD] bg-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-30 hover:border-[#141210]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-mono text-[#78716A]">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => updateParam('page', String(Math.min(page + 1, totalPages)))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-[#DCD7CD] bg-white rounded-lg text-xs font-semibold flex items-center gap-1 disabled:opacity-30 hover:border-[#141210]"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
