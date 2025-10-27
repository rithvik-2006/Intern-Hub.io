// src/pages/CreateInternship.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { internshipAPI, startupAPI } from '../services/api';
import { Briefcase, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const CreateInternship = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [startupId, setStartupId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    location: '',
    stipend: '',
    description: '',
    required_skills: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStartupId();
  }, [user]);

  const fetchStartupId = async () => {
    try {
      const response = await startupAPI.getByUserId(user.id);
      if (response.data?.startups?.length > 0) {
        setStartupId(response.data.startups[0].id);
      } else {
        setError('No startup profile found. Please complete your startup setup first.');
      }
    } catch (err) {
      console.error('Error fetching startup:', err);
      setError('Failed to load startup profile');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.role && formData.role.length > 50) {
      newErrors.role = 'Role must be less than 50 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.stipend && isNaN(formData.stipend)) {
      newErrors.stipend = 'Stipend must be a number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!formData.required_skills.trim()) {
      newErrors.required_skills = 'At least one skill is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!startupId) {
      setError('Startup profile not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        startup_id: startupId,
        title: formData.title.trim(),
        role: formData.role.trim() || null,
        location: formData.location.trim(),
        stipend: formData.stipend ? parseFloat(formData.stipend) : null,
        description: formData.description.trim(),
        required_skills: formData.required_skills,
        status: formData.status
      };

      await internshipAPI.create(payload);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error creating internship:', err);
      setError(err.response?.data?.message || 'Failed to create internship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Internship Posted!</h2>
            <p className="text-gray-600 mb-4">
              Your internship has been successfully posted. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Post New Internship</h1>
              <p className="text-gray-600 mt-1">Fill in the details to attract talented students</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Internship Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Full Stack Developer Intern"
                className={`w-full px-4 py-3 border ${
                  errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg focus:ring-2 focus:outline-none transition-colors`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-900 mb-2">
                Role/Department
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Engineering, Marketing"
                className={`w-full px-4 py-3 border ${
                  errors.role ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg focus:ring-2 focus:outline-none transition-colors`}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Location and Stipend Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote, Bangalore, Hybrid"
                  className={`w-full px-4 py-3 border ${
                    errors.location ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } rounded-lg focus:ring-2 focus:outline-none transition-colors`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Stipend */}
              <div>
                <label htmlFor="stipend" className="block text-sm font-semibold text-gray-900 mb-2">
                  Stipend (₹/month)
                </label>
                <input
                  type="number"
                  id="stipend"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="e.g., 10000"
                  min="0"
                  step="1000"
                  className={`w-full px-4 py-3 border ${
                    errors.stipend ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  } rounded-lg focus:ring-2 focus:outline-none transition-colors`}
                />
                {errors.stipend && (
                  <p className="mt-1 text-sm text-red-600">{errors.stipend}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the internship role, responsibilities, and what students will learn..."
                rows="6"
                className={`w-full px-4 py-3 border ${
                  errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg focus:ring-2 focus:outline-none transition-colors resize-vertical`}
              />
              <div className="mt-1 flex justify-between items-center">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <p className="text-sm text-gray-500">Minimum 50 characters</p>
                )}
                <p className="text-sm text-gray-500">{formData.description.length}/2000</p>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label htmlFor="required_skills" className="block text-sm font-semibold text-gray-900 mb-2">
                Required Skills <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="required_skills"
                name="required_skills"
                value={formData.required_skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB, JavaScript"
                className={`w-full px-4 py-3 border ${
                  errors.required_skills ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                } rounded-lg focus:ring-2 focus:outline-none transition-colors`}
              />
              <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
              {errors.required_skills && (
                <p className="mt-1 text-sm text-red-600">{errors.required_skills}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors bg-white"
              >
                <option value="Active">Active - Accepting Applications</option>
                <option value="Draft">Draft - Not Visible to Students</option>
                <option value="Closed">Closed - No Longer Accepting</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !startupId}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting...
                  </span>
                ) : (
                  'Post Internship'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips for a Great Posting</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about the role and responsibilities</li>
            <li>• Mention the learning opportunities and growth potential</li>
            <li>• List the required technical skills clearly</li>
            <li>• Include information about your startup's mission and culture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateInternship;
