// src/pages/MyApplications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, studentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Briefcase,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentApplications();
  }, [user.id]);

  const fetchStudentApplications = async () => {
    try {
      setLoading(true);
      
      // Get student profile first
      const profileRes = await studentAPI.getByUserId(user.id);
      setStudentProfile(profileRes.data.student_profile);

      // Get all applications and filter by student_id
      const appsRes = await applicationAPI.getAll();
      const myApps = appsRes.data.applications.filter(
        app => app.student_id === profileRes.data.student_profile.id
      );
      setApplications(myApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Applied: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      Reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Eye },
      Interviewing: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Briefcase },
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your internship applications</p>
      </div>

      {error && (
        <div className="mb-6 card bg-red-50 border border-red-200">
          <div className="flex items-center space-x-3 text-red-700">
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            Start applying to internships to see them here
          </p>
          <Link to="/internships" className="btn btn-primary inline-block">
            Browse Internships
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1 mb-4 md:mb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {application.internship_title}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <span>{application.startup_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Applied {formatDate(application.applied_at)}</span>
                    </div>
                    <div>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>

                  {application.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        <strong>Your note:</strong> {application.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 md:ml-6">
                  <Link
                    to={`/internships/${application.internship_id}`}
                    className="btn btn-secondary flex items-center justify-center space-x-2 flex-1 md:flex-none"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Internship</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
