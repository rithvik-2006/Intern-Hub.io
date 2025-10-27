// src/pages/ApplicationsList.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, startupAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Calendar,
  Filter,
  Search,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
} from 'lucide-react';

const ApplicationsList = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startupId, setStartupId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = ['All', 'Applied', 'Reviewing', 'Interviewing', 'Offer', 'Rejected'];

  useEffect(() => {
    fetchStartupAndApplications();
  }, [user.id]);

  useEffect(() => {
    filterApplications();
  }, [applications, filterStatus, searchQuery]);

  const fetchStartupAndApplications = async () => {
    try {
      setLoading(true);
      // First get startup by user_id
      const startupRes = await startupAPI.getByUserId(user.id);
      
      if (startupRes.data.startups.length === 0) {
        setError('No startup profile found. Please create one first.');
        setLoading(false);
        return;
      }

      const startup = startupRes.data.startups[0];
      setStartupId(startup.id);

      // Then get applications for this startup
      const appsRes = await applicationAPI.getByStartupId(startup.id);
      setApplications(appsRes.data.applications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        app =>
          app.student_name?.toLowerCase().includes(query) ||
          app.internship_title?.toLowerCase().includes(query)
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Applied: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      Reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Eye },
      Interviewing: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Users },
      Offer: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.Applied;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="h-4 w-4" />
        <span>{status}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      Applied: 0,
      Reviewing: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach(app => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      }
    });

    return counts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <div className="flex items-center space-x-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-600">Manage all applications to your internship postings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-sm text-blue-100">Total</p>
          <p className="text-3xl font-bold">{statusCounts.total}</p>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <p className="text-sm text-yellow-100">Applied</p>
          <p className="text-3xl font-bold">{statusCounts.Applied}</p>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-sm text-orange-100">Reviewing</p>
          <p className="text-3xl font-bold">{statusCounts.Reviewing}</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-sm text-purple-100">Interviewing</p>
          <p className="text-3xl font-bold">{statusCounts.Interviewing}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-sm text-green-100">Offers</p>
          <p className="text-3xl font-bold">{statusCounts.Offer}</p>
        </div>
        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <p className="text-sm text-red-100">Rejected</p>
          <p className="text-3xl font-bold">{statusCounts.Rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="input pl-10"
              placeholder="Search by student name or internship..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="input pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600">
            {applications.length === 0
              ? "You haven't received any applications yet."
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {application.student_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.student_name || 'Unknown Student'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.internship_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(application.applied_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/applications/${application.id}`}
                        className="text-primary-600 hover:text-primary-900 font-medium inline-flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
