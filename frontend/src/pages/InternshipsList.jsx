


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipAPI } from '../services/api';
import { MapPin, DollarSign, Briefcase, Search, Filter, X } from 'lucide-react';

const InternshipsList = () => {
  const [allInternships, setAllInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'Active',
    skill: '',
  });

  // Fetch internships when filters change
  useEffect(() => {
    fetchInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  // Apply client-side filtering whenever search query or skill filter changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters.skill, allInternships]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = { status: filters.status };
      
      const response = await internshipAPI.getAll(params);
      const internships = response.data.internships || [];
      setAllInternships(internships);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setAllInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allInternships];

    // Apply search query with pattern matching
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((internship) => {
        const title = (internship.title || '').toLowerCase();
        const startupName = (internship.startup_name || '').toLowerCase();
        const role = (internship.role || '').toLowerCase();
        
        // Check if query matches title, startup name, or role
        return title.includes(query) || 
               startupName.includes(query) || 
               role.includes(query);
      });
    }

    // Apply skill filter with pattern matching
    if (filters.skill.trim()) {
      const skillQuery = filters.skill.trim().toLowerCase();
      filtered = filtered.filter((internship) => {
        if (!internship.required_skills || internship.required_skills.length === 0) {
          return false;
        }
        return internship.required_skills.some(skill => 
          skill.toLowerCase().includes(skillQuery)
        );
      });
    }

    setFilteredInternships(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is applied automatically through useEffect
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleClearSkillFilter = () => {
    setFilters({ ...filters, skill: '' });
  };

  const handleSkillFilterChange = (e) => {
    setFilters({ ...filters, skill: e.target.value });
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setFilters({ ...filters, skill: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading internships...</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = searchQuery.trim() || filters.skill.trim();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Browse Internships</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, company, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Filter Section */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <Filter className="text-gray-500 w-5 h-5 shrink-0" />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filter by skill (e.g., React, Node.js)..."
                value={filters.skill}
                onChange={handleSkillFilterChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {filters.skill && (
                <button
                  type="button"
                  onClick={handleClearSkillFilter}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear skill filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Active filters:</span>
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.skill.trim() && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Skill: {filters.skill}
                  <button
                    type="button"
                    onClick={handleClearSkillFilter}
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredInternships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search or filters' 
                : 'No internships available at the moment'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Found <span className="font-semibold text-gray-900">{filteredInternships.length}</span> internship{filteredInternships.length !== 1 ? 's' : ''}
                {hasActiveFilters && allInternships.length > 0 && (
                  <span className="text-gray-500"> out of {allInternships.length} total</span>
                )}
              </p>
            </div>

            {/* Internships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <Link
                  key={internship.id}
                  to={`/internships/${internship.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 flex-1 pr-2">
                        {internship.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        internship.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : internship.status === 'Closed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {internship.status}
                      </span>
                    </div>

                    {/* Startup Name */}
                    <p className="text-gray-600 font-medium mb-4">{internship.startup_name}</p>

                    {/* Details Section */}
                    <div className="space-y-3 mb-4">
                      {internship.role && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm">{internship.role}</span>
                        </div>
                      )}

                      {internship.location && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm">{internship.location}</span>
                        </div>
                      )}

                      {internship.stipend && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium">₹{internship.stipend}/month</span>
                        </div>
                      )}
                    </div>

                    {/* Skills Section */}
                    {internship.required_skills && internship.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                        {internship.required_skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {internship.required_skills.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            +{internship.required_skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InternshipsList;