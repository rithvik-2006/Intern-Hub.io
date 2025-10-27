// // src/pages/StudentProfile.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { studentAPI } from '../services/api';
// import { User, GraduationCap, Calendar, FileText, Link as LinkIcon, Edit2, Save, X } from 'lucide-react';

// const StudentProfile = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     fetchProfile();
//   }, [user.id]);

//   const fetchProfile = async () => {
//     try {
//       const response = await studentAPI.getByUserId(user.id);
//       setProfile(response.data.student_profile);
//       setFormData(response.data.student_profile);
//     } catch (err) {
//       if (err.response?.status === 404) {
//         // No profile found, redirect to setup
//         window.location.href = '/profile/setup';
//       } else {
//         setError('Failed to load profile');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const payload = {
//         name: formData.name,
//         school: formData.school || null,
//         major: formData.major || null,
//         graduation_date: formData.graduation_date || null,
//         resume_url: formData.resume_url || null,
//         portfolio_link: formData.portfolio_link || null,
//       };

//       const response = await studentAPI.update(profile.id, payload);
//       setProfile(response.data.student_profile);
//       setFormData(response.data.student_profile);
//       setEditing(false);
//       setSuccess('Profile updated successfully!');
      
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="card">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
//           {!editing ? (
//             <button
//               onClick={() => setEditing(true)}
//               className="btn btn-primary flex items-center space-x-2"
//             >
//               <Edit2 className="h-4 w-4" />
//               <span>Edit Profile</span>
//             </button>
//           ) : (
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => {
//                   setEditing(false);
//                   setFormData(profile);
//                   setError('');
//                 }}
//                 className="btn btn-secondary flex items-center space-x-2"
//               >
//                 <X className="h-4 w-4" />
//                 <span>Cancel</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
//             {success}
//           </div>
//         )}

//         {editing ? (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="label">Full Name</label>
//               <input
//                 name="name"
//                 type="text"
//                 required
//                 className="input"
//                 value={formData.name || ''}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="label">School/University</label>
//               <input
//                 name="school"
//                 type="text"
//                 className="input"
//                 value={formData.school || ''}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="label">Major</label>
//               <input
//                 name="major"
//                 type="text"
//                 className="input"
//                 value={formData.major || ''}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="label">Graduation Date</label>
//               <input
//                 name="graduation_date"
//                 type="date"
//                 className="input"
//                 value={formData.graduation_date || ''}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="label">Resume URL</label>
//               <input
//                 name="resume_url"
//                 type="url"
//                 className="input"
//                 value={formData.resume_url || ''}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="label">Portfolio Link</label>
//               <input
//                 name="portfolio_link"
//                 type="url"
//                 className="input"
//                 value={formData.portfolio_link || ''}
//                 onChange={handleChange}
//               />
//             </div>

//             <button type="submit" className="btn btn-primary flex items-center space-x-2">
//               <Save className="h-4 w-4" />
//               <span>Save Changes</span>
//             </button>
//           </form>
//         ) : (
//           <div className="space-y-6">
//             <div className="flex items-center space-x-3">
//               <User className="h-5 w-5 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Full Name</p>
//                 <p className="font-medium text-gray-900">{profile?.name || 'Not provided'}</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <GraduationCap className="h-5 w-5 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">School/University</p>
//                 <p className="font-medium text-gray-900">{profile?.school || 'Not provided'}</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <FileText className="h-5 w-5 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Major</p>
//                 <p className="font-medium text-gray-900">{profile?.major || 'Not provided'}</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <Calendar className="h-5 w-5 text-gray-400" />
//               <div>
//                 <p className="text-sm text-gray-600">Graduation Date</p>
//                 <p className="font-medium text-gray-900">
//                   {profile?.graduation_date 
//                     ? new Date(profile.graduation_date).toLocaleDateString() 
//                     : 'Not provided'}
//                 </p>
//               </div>
//             </div>

//             {profile?.resume_url && (
//               <div className="flex items-center space-x-3">
//                 <FileText className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Resume</p>
//                   <a
//                     href={profile.resume_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="font-medium text-primary-600 hover:text-primary-700"
//                   >
//                     View Resume
//                   </a>
//                 </div>
//               </div>
//             )}

//             {profile?.portfolio_link && (
//               <div className="flex items-center space-x-3">
//                 <LinkIcon className="h-5 w-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Portfolio</p>
//                   <a
//                     href={profile.portfolio_link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="font-medium text-primary-600 hover:text-primary-700"
//                   >
//                     Visit Portfolio
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;


// src/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import { User, GraduationCap, Calendar, FileText, Link as LinkIcon, Edit2, Save, X } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getByUserId(user.id);
      setProfile(response.data.student_profile);
      setFormData(response.data.student_profile);
    } catch (err) {
      if (err.response?.status === 404) {
        // No profile found, redirect to setup
        window.location.href = '/profile/setup';
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: formData.name,
        school: formData.school || null,
        major: formData.major || null,
        graduation_date: formData.graduation_date || null,
        resume_url: formData.resume_url || null,
        portfolio_link: formData.portfolio_link || null,
      };

      const response = await studentAPI.update(profile.id, payload);
      setProfile(response.data.student_profile);
      setFormData(response.data.student_profile);
      setEditing(false);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
            </div>
            
            {!editing ? (
              <button 
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Edit2 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                  setError('');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Save className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
          {editing ? (
            /* Edit Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Enter your full name"
                />
              </div>

              {/* School/University */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School/University
                </label>
                <input
                  name="school"
                  type="text"
                  value={formData.school || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="e.g., IIT Hyderabad"
                />
              </div>

              {/* Major */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Major
                </label>
                <input
                  name="major"
                  type="text"
                  value={formData.major || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="e.g., Computer Science"
                />
              </div>

              {/* Graduation Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Date
                </label>
                <input
                  name="graduation_date"
                  type="date"
                  value={formData.graduation_date || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
              </div>

              {/* Resume URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume URL
                </label>
                <input
                  name="resume_url"
                  type="url"
                  value={formData.resume_url || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="https://example.com/resume.pdf"
                />
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Portfolio Link
                </label>
                <input
                  name="portfolio_link"
                  type="url"
                  value={formData.portfolio_link || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Full Name */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{profile?.name || 'Not provided'}</p>
                </div>
              </div>

              {/* School/University */}
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">School/University</p>
                  <p className="text-lg font-semibold text-gray-900">{profile?.school || 'Not provided'}</p>
                </div>
              </div>

              {/* Major */}
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Major</p>
                  <p className="text-lg font-semibold text-gray-900">{profile?.major || 'Not provided'}</p>
                </div>
              </div>

              {/* Graduation Date */}
              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Graduation Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile?.graduation_date 
                      ? new Date(profile.graduation_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) 
                      : 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Resume */}
              {profile?.resume_url && (
                <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">Resume</p>
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                    >
                      View Resume
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {profile?.portfolio_link && (
                <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">Portfolio</p>
                    <a
                      href={profile.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                    >
                      Visit Portfolio
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
