// src/pages/ApplicationDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, studentAPI } from '../services/api';
import {
  ArrowLeft,
  User,
  Briefcase,
  Calendar,
  FileText,
  Link as LinkIcon,
  GraduationCap,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
} from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStartup } = useAuth();

  const [application, setApplication] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const statusOptions = ['Applied', 'Reviewing', 'Interviewing', 'Offer', 'Rejected'];

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getById(id);
      const app = response.data.application;
      setApplication(app);
      setNewStatus(app.status);
      setNewNotes(app.notes || '');

      // Fetch student profile details
      if (app.student_id) {
        try {
          const studentRes = await studentAPI.getById(app.student_id);
          setStudentProfile(studentRes.data.student_profile);
        } catch (err) {
          console.error('Error fetching student profile:', err);
        }
      }
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async () => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      const updateData = {};
      if (newStatus !== application.status) {
        updateData.status = newStatus;
      }
      if (newNotes !== application.notes) {
        updateData.notes = newNotes || null;
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        setUpdating(false);
        return;
      }

      await applicationAPI.update(id, updateData);
      setSuccess('Application updated successfully!');
      
      // Refresh application data
      await fetchApplicationDetails();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update application');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card bg-red-50 border border-red-200">
          <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
          <p className="text-red-700">Application not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Applications</span>
      </button>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Header */}
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Application Details
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium text-gray-900">{application.internship_title}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Applied On</p>
                  <p className="font-medium text-gray-900">{formatDate(application.applied_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Profile */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-primary-600" />
              <span>Student Profile</span>
            </h2>

            {studentProfile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900 text-lg">{studentProfile.name}</p>
                </div>

                {studentProfile.school && (
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">School</p>
                      <p className="font-medium text-gray-900">{studentProfile.school}</p>
                    </div>
                  </div>
                )}

                {studentProfile.major && (
                  <div>
                    <p className="text-sm text-gray-600">Major</p>
                    <p className="font-medium text-gray-900">{studentProfile.major}</p>
                  </div>
                )}

                {studentProfile.graduation_date && (
                  <div>
                    <p className="text-sm text-gray-600">Expected Graduation</p>
                    <p className="font-medium text-gray-900">
                      {new Date(studentProfile.graduation_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {studentProfile.user_email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a
                        href={`mailto:${studentProfile.user_email}`}
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {studentProfile.user_email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  {studentProfile.resume_url && (
                    <a
                      href={studentProfile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary inline-flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>View Resume</span>
                    </a>
                  )}

                  {studentProfile.portfolio_link && (
                    <a
                      href={studentProfile.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary inline-flex items-center space-x-2"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>View Portfolio</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Student profile information not available</p>
            )}
          </div>

          {/* Application Notes */}
          {application.notes && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary-600" />
                <span>Application Notes from Student</span>
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Status Management */}
        {isStartup && (
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Manage Application
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="label">Application Status</label>
                  <select
                    className="input"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Internal Notes</label>
                  <textarea
                    rows={6}
                    className="input resize-none"
                    placeholder="Add internal notes about this application..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    maxLength={1000}
                  />
                  <p className="mt-1 text-xs text-gray-500 text-right">
                    {newNotes.length}/1000 characters
                  </p>
                </div>

                <button
                  onClick={handleUpdateApplication}
                  disabled={updating}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Guide */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Status Guide</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><strong>Applied:</strong> Initial submission</div>
                  <div><strong>Reviewing:</strong> Under consideration</div>
                  <div><strong>Interviewing:</strong> Interview scheduled</div>
                  <div><strong>Offer:</strong> Offer extended</div>
                  <div><strong>Rejected:</strong> Not moving forward</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
