// src/pages/StudentProfileSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { User, GraduationCap, Calendar, FileText, Link as LinkIcon, AlertCircle, CheckCircle } from 'lucide-react';

const StudentProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    major: '',
    graduation_date: '',
    resume_url: '',
    portfolio_link: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Optional but validate if provided
    if (formData.resume_url && !isValidUrl(formData.resume_url)) {
      newErrors.resume_url = 'Please enter a valid URL (e.g., https://example.com/resume.pdf)';
    }

    if (formData.portfolio_link && !isValidUrl(formData.portfolio_link)) {
      newErrors.portfolio_link = 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (formData.graduation_date) {
      const selectedDate = new Date(formData.graduation_date);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.graduation_date = 'Graduation date should be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: user.id,
        name: formData.name.trim(),
        school: formData.school.trim() || null,
        major: formData.major.trim() || null,
        graduation_date: formData.graduation_date || null,
        resume_url: formData.resume_url.trim() || null,
        portfolio_link: formData.portfolio_link.trim() || null,
      };

      await studentAPI.create(payload);
      setSuccess(true);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="card max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Created!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <GraduationCap className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Complete Your Student Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Help startups discover your skills and experience
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name - Required */}
            <div>
              <label htmlFor="name" className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* School */}
            <div>
              <label htmlFor="school" className="label">
                School/University
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="school"
                  name="school"
                  type="text"
                  className="input pl-10"
                  placeholder="IIT Hyderabad"
                  value={formData.school}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Major */}
            <div>
              <label htmlFor="major" className="label">
                Major/Field of Study
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="major"
                  name="major"
                  type="text"
                  className="input pl-10"
                  placeholder="Computer Science"
                  value={formData.major}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Graduation Date */}
            <div>
              <label htmlFor="graduation_date" className="label">
                Expected Graduation Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="graduation_date"
                  name="graduation_date"
                  type="date"
                  className={`input pl-10 ${errors.graduation_date ? 'border-red-500' : ''}`}
                  value={formData.graduation_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.graduation_date && (
                <p className="mt-1 text-sm text-red-600">{errors.graduation_date}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Optional: When do you expect to graduate?</p>
            </div>

            {/* Resume URL */}
            <div>
              <label htmlFor="resume_url" className="label">
                Resume URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="resume_url"
                  name="resume_url"
                  type="url"
                  className={`input pl-10 ${errors.resume_url ? 'border-red-500' : ''}`}
                  placeholder="https://example.com/my-resume.pdf"
                  value={formData.resume_url}
                  onChange={handleChange}
                />
              </div>
              {errors.resume_url && (
                <p className="mt-1 text-sm text-red-600">{errors.resume_url}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Link to your resume (Google Drive, Dropbox, etc.)
              </p>
            </div>

            {/* Portfolio Link */}
            <div>
              <label htmlFor="portfolio_link" className="label">
                Portfolio/LinkedIn URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="portfolio_link"
                  name="portfolio_link"
                  type="url"
                  className={`input pl-10 ${errors.portfolio_link ? 'border-red-500' : ''}`}
                  placeholder="https://linkedin.com/in/johndoe"
                  value={formData.portfolio_link}
                  onChange={handleChange}
                />
              </div>
              {errors.portfolio_link && (
                <p className="mt-1 text-sm text-red-600">{errors.portfolio_link}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your personal website, GitHub, or LinkedIn profile
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary text-lg py-3"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Profile...
                  </span>
                ) : (
                  'Complete Profile'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileSetup;
