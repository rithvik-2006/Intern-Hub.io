
// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { internshipAPI, applicationAPI, startupAPI, studentAPI } from '../services/api';

const Dashboard = () => {
  const { user, isStudent, isStartup } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInternships: 0,
    applicationsSubmitted: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isStudent, isStartup]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isStudent) {
        const [internshipsRes, studentProfileRes] = await Promise.all([
          internshipAPI.getAll({ status: 'Active' }),
          studentAPI.getMe(),
        ]);

        const studentId = studentProfileRes.data?.student?.id;
        let applicationsCount = 0;

        if (studentId) {
          try {
            const applicationsRes = await applicationAPI.getByStudentId(studentId);
            applicationsCount = applicationsRes.data?.applications?.length || 0;
          } catch (appError) {
            console.warn('Failed to fetch applications:', appError);
          }
        }

        setStats({
          totalInternships: internshipsRes.data?.internships?.length || 0,
          applicationsSubmitted: applicationsCount,
          totalApplications: 0,
        });
      } else if (isStartup) {
        const startupsRes = await startupAPI.getByUserId(user.id);
        if (startupsRes.data?.startups?.length > 0) {
          const startupId = startupsRes.data.startups[0].id;
          const [internshipsRes, applicationsRes] = await Promise.all([
            internshipAPI.getByStartupId(startupId),
            applicationAPI.getByStartupId(startupId),
          ]);

          setStats({
            totalInternships: internshipsRes.data?.internships?.length || 0,
            totalApplications: applicationsRes.data?.applications?.length || 0,
            applicationsSubmitted: 0,
          });
        } else {
          setStats({
            totalInternships: 0,
            totalApplications: 0,
            applicationsSubmitted: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 404) {
        console.log('Profile not found - user may need to complete setup');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome back, {user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {isStudent
              ? 'Discover amazing internship opportunities and take the next step in your career'
              : 'Manage your internships and connect with talented students'}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {isStudent && (
            <>
              <Link to="/internships" className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Available Internships</p>
                      <p className="text-4xl font-bold text-gray-900">{stats.totalInternships}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all duration-300">
                    <span>Browse opportunities</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/dashboard/applied" className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">My Applications</p>
                      <p className="text-4xl font-bold text-gray-900">{stats.applicationsSubmitted}</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600 font-medium text-sm group-hover:gap-2 transition-all duration-300">
                    <span>View applications</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </>
          )}

          {isStartup && (
            <>
            
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">My Internships</p>
                    <p className="text-4xl font-bold text-gray-900">{stats.totalInternships}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Total Applications</p>
                    <p className="text-4xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          {isStudent && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Link to="/internships" className="group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        Browse Internships
                      </div>
                      <div className="text-sm text-gray-600">
                        Find your perfect opportunity
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-1 transition-all">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/profile" className="group">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        Update Profile
                      </div>
                      <div className="text-sm text-gray-600">
                        Keep your profile current
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-green-600 font-medium text-sm group-hover:gap-1 transition-all">
                    <span>Edit profile</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {isStartup && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Link to="/my-internships/create" className="group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        Post New Internship
                      </div>
                      <div className="text-sm text-gray-600">
                        Attract talented students
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-purple-600 font-medium text-sm group-hover:gap-1 transition-all">
                    <span>Create posting</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link to="/applications" className="group">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100 hover:border-orange-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        View Applications
                      </div>
                      <div className="text-sm text-gray-600">
                        Review student applications
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-1 transition-all">
                    <span>Review now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;