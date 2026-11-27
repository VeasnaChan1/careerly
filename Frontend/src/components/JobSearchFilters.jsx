import React from 'react';
import {
  Search,
  MapPin,
  X,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Bookmark
} from 'lucide-react';

/**
 * JobSearchFilters
 * Search bar, quick job-type chips, location/sort dropdowns, active filter tags,
 * saved-only toggle, and reset controls for the Job Finder page.
 */
export default function JobSearchFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  availableJobTypes = [],
  selectedLocation,
  onLocationChange,
  availableLocations = [],
  selectedSort,
  onSortChange,
  onlySaved,
  onOnlySavedChange,
  savedCount = 0,
  displayedCount = 0,
  totalCount = 0,
  onResetFilters
}) {
  const hasActiveFilters = Boolean(
    (searchQuery && searchQuery.trim()) ||
      selectedType !== 'all' ||
      selectedLocation !== 'all' ||
      onlySaved
  );

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7E2D8] shadow-xs mb-8 space-y-4">
      {/* Row 1: Search Input + Location + Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Keyword Input (6 cols) */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847C] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search jobs by title, company, or skills"
            placeholder="Search by job title, company name, or skills (e.g. React, ABA Bank, QA)..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F46200]/30 focus:border-[#F46200] text-[#2D2D2D] placeholder-[#8A847C] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#8A847C] hover:text-[#2D2D2D] hover:bg-[#EFECE6] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Location Select (3 cols) */}
        <div className="md:col-span-3 relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847C] pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            aria-label="Filter by location"
            className="w-full pl-9 pr-9 py-2.5 text-xs font-semibold bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl text-[#2D2D2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] cursor-pointer appearance-none transition-all"
          >
            <option value="all">All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#8A847C] pointer-events-none" />
        </div>

        {/* Sort By Select (3 cols) */}
        <div className="md:col-span-3 relative">
          <ArrowUpDown className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A847C] pointer-events-none" />
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort jobs"
            className="w-full pl-9 pr-9 py-2.5 text-xs font-semibold bg-[#FAF8F4] border border-[#E7E2D8] rounded-xl text-[#2D2D2D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F46200]/20 focus:border-[#F46200] cursor-pointer appearance-none transition-all"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="company">Sort: Company Name (A-Z)</option>
            <option value="title">Sort: Job Title (A-Z)</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#8A847C] pointer-events-none" />
        </div>
      </div>

      {/* Row 2: Job Type Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8A847C] mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Job Type:</span>
        </span>

        <button
          type="button"
          onClick={() => onTypeChange('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedType === 'all'
              ? 'bg-[#F46200] text-white shadow-xs'
              : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] border border-[#E7E2D8]'
          }`}
        >
          All Types
        </button>

        {availableJobTypes.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => onTypeChange(t.type)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedType === t.type
                ? 'bg-[#F46200] text-white shadow-xs'
                : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] border border-[#E7E2D8]'
            }`}
          >
            {t.type} ({t.count})
          </button>
        ))}
      </div>

      {/* Row 3: Active Filter Chips + Saved Toggle + Reset & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E7E2D8]/60 text-xs text-[#5A554E]">
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 cursor-pointer hover:text-[#2D2D2D] select-none">
            <input
              type="checkbox"
              checked={onlySaved}
              onChange={(e) => onOnlySavedChange(e.target.checked)}
              className="custom-checkbox"
            />
            <span className="inline-flex items-center gap-1 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-[#F46200]" />
              Show Saved Only ({savedCount})
            </span>
          </label>

          {/* Removable Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5">
              {searchQuery?.trim() && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3EB] text-[#F46200] border border-[#FAD7C0] text-[11px] font-semibold hover:bg-[#FFE5D3] transition-colors cursor-pointer"
                >
                  <span>&ldquo;{searchQuery.trim()}&rdquo;</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedType !== 'all' && (
                <button
                  type="button"
                  onClick={() => onTypeChange('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3EB] text-[#F46200] border border-[#FAD7C0] text-[11px] font-semibold hover:bg-[#FFE5D3] transition-colors cursor-pointer"
                >
                  <span>{selectedType}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedLocation !== 'all' && (
                <button
                  type="button"
                  onClick={() => onLocationChange('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3EB] text-[#F46200] border border-[#FAD7C0] text-[11px] font-semibold hover:bg-[#FFE5D3] transition-colors cursor-pointer"
                >
                  <span>{selectedLocation}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#F46200] hover:text-[#DC5800] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
          <span className="text-xs text-[#8A847C]">
            Showing <strong className="text-[#2D2D2D]">{displayedCount}</strong> of{' '}
            <strong className="text-[#2D2D2D]">{totalCount}</strong> jobs
          </span>
        </div>
      </div>
    </div>
  );
}
