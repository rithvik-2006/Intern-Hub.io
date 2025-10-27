// src/pages/StartupProfileSetup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startupAPI } from '../services/api';
import { Building2, FileText, Globe, AlertCircle, CheckCircle, Rocket } from 'lucide-react';

const StartupProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Startup name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Startup name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Startup name must be less than 100 characters';
    }

    // Description validation (optional but with limits)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Website validation (optional but must be valid URL)
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL (e.g., https://example.com)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
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
        description: formData.description.trim() || null,
        website: formData.website.trim() || null,
      };

      await startupAPI.create(payload);
      setSuccess(true);
      
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Startup creation error:', err);
      setError(err.response?.data?.message || 'Failed to create startup profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="card max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Startup Profile Created!</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Rocket className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Setup Your Startup Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tell students about your company and start posting internships
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Startup Name - Required */}
            <div>
              <label htmlFor="name" className="label">
                Startup Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Acme Technologies"
                  value={formData.name}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Company Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className={`input pl-10 resize-none ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Tell students about your startup, mission, and culture. What makes your company unique? What kind of work environment do you offer?"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Help students understand what your startup does
                </p>
                <p className="text-xs text-gray-500">
                  {formData.description.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="label">
                Company Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className={`input pl-10 ${errors.website ? 'border-red-500' : ''}`}
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your company's official website or landing page
              </p>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                💡 Profile Tips
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use your official company name that students will recognize</li>
                <li>• Write a compelling description highlighting your mission and culture</li>
                <li>• Include your website so students can learn more about you</li>
                <li>• You can edit your profile anytime from the dashboard</li>
              </ul>
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
                  'Create Startup Profile'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>
          </form>
        </div>

        {/* What's Next Section */}
        <div className="mt-6 card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <h3 className="text-lg font-bold mb-2">What's Next?</h3>
          <p className="text-purple-100 text-sm">
            After creating your profile, you'll be able to post internship opportunities, 
            review student applications, and manage your recruitment process all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartupProfileSetup;
