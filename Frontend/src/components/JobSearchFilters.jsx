import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  X,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Bookmark,
  Check
} from 'lucide-react';

/**
 * JobSearchFilters
 * Search bar, multi-select job-type pills, multi-select location dropdown,
 * sort dropdown, removable active filter chips, saved-only toggle, and reset controls.
 */
export default function JobSearchFilters({
  searchQuery,
  onSearchChange,
  selectedTypes = [],
  onToggleType,
  onClearTypes,
  availableJobTypes = [],
  selectedLocations = [],
  onToggleLocation,
  onClearLocations,
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
  const [locationOpen, setLocationOpen] = useState(false);
  const locationMenuRef = useRef(null);

  useEffect(() => {
    if (!locationOpen) return;
    const handleClickOutside = (e) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [locationOpen]);

  const hasActiveFilters = Boolean(
    (searchQuery && searchQuery.trim()) ||
      selectedTypes.length > 0 ||
      selectedLocations.length > 0 ||
      onlySaved
  );

  const locationLabel =
    selectedLocations.length === 0
      ? 'All Locations'
      : selectedLocations.length === 1
      ? selectedLocations[0]
      : `${selectedLocations.length} Locations`;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7E2D8] shadow-xs mb-8 space-y-4">
      {/* Row 1: Search Input + Multi-Select Location + Sort */}
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

        {/* Multi-Select Location Dropdown (3 cols) */}
        <div className="md:col-span-3 relative" ref={locationMenuRef}>
          <button
            type="button"
            onClick={() => setLocationOpen((prev) => !prev)}
            aria-expanded={locationOpen}
            aria-label="Filter by locations"
            className={`w-full pl-9 pr-9 py-2.5 text-xs font-semibold border rounded-xl text-left transition-all cursor-pointer relative ${
              selectedLocations.length > 0
                ? 'bg-[#FFF3EB] border-[#FAD7C0] text-[#F46200]'
                : 'bg-[#FAF8F4] border-[#E7E2D8] text-[#2D2D2D] hover:bg-white'
            }`}
          >
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-current opacity-75 pointer-events-none" />
            <span className="block truncate">{locationLabel}</span>
            <ChevronDown
              className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-75 transition-transform pointer-events-none ${
                locationOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {locationOpen && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#E7E2D8] rounded-2xl shadow-lg z-30 p-2 max-h-60 overflow-y-auto space-y-1">
              <button
                type="button"
                onClick={() => {
                  onClearLocations?.();
                  setLocationOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedLocations.length === 0
                    ? 'bg-[#FFF3EB] text-[#F46200]'
                    : 'text-[#5A554E] hover:bg-[#FAF8F4] hover:text-[#2D2D2D]'
                }`}
              >
                <span>All Locations</span>
                {selectedLocations.length === 0 && <Check className="w-3.5 h-3.5" />}
              </button>

              {availableLocations.map((loc) => {
                const isSelected = selectedLocations.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => onToggleLocation?.(loc)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF3EB] text-[#F46200] font-semibold'
                        : 'text-[#2D2D2D] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    <span className="truncate pr-2">{loc}</span>
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#F46200] border-[#F46200] text-white'
                          : 'border-[#D4CFC7] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
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

      {/* Row 2: Multi-Select Job Type Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8A847C] mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Job Type:</span>
        </span>

        <button
          type="button"
          onClick={onClearTypes}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            selectedTypes.length === 0
              ? 'bg-[#F46200] text-white shadow-xs'
              : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] border border-[#E7E2D8]'
          }`}
        >
          All Types
        </button>

        {availableJobTypes.map((t) => {
          const isActive = selectedTypes.includes(t.type);
          return (
            <button
              key={t.type}
              type="button"
              onClick={() => onToggleType?.(t.type)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F46200] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-[#5A554E] hover:text-[#2D2D2D] border border-[#E7E2D8]'
              }`}
            >
              {isActive && <Check className="w-3 h-3" />}
              <span>
                {t.type} ({t.count})
              </span>
            </button>
          );
        })}
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
              {selectedTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => onToggleType?.(type)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3EB] text-[#F46200] border border-[#FAD7C0] text-[11px] font-semibold hover:bg-[#FFE5D3] transition-colors cursor-pointer"
                >
                  <span>{type}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {selectedLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onToggleLocation?.(loc)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF3EB] text-[#F46200] border border-[#FAD7C0] text-[11px] font-semibold hover:bg-[#FFE5D3] transition-colors cursor-pointer"
                >
                  <span>{loc}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
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
