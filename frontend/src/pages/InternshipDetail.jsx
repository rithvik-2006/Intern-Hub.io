
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { internshipAPI, applicationAPI, studentAPI } from "../services/api";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Globe,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Award,
} from "lucide-react";

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, isStartup } = useAuth();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInternshipDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isStudent && user?.id) {
      checkStudentProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudent, user]);

  const fetchInternshipDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await internshipAPI.getById(id);
      const internshipData = response.data.internship;

      setInternship({
        ...internshipData,
        startupid: internshipData.startupid || internshipData.startup_id,
      });
    } catch (err) {
      console.error("Error fetching internship:", err);
      setError(err.response?.data?.message || "Failed to load internship details");
    } finally {
      setLoading(false);
    }
  };

  const checkStudentProfile = async () => {
    try {
      const response = await studentAPI.getByUserId(user.id);
      const profile = response.data.student_profile;

      console.log("Student profile loaded:", profile);
      setStudentProfile(profile);

      if (profile?.id && id) {
        await checkExistingApplication(profile.id);
      }
    } catch (err) {
      console.error("Error fetching student profile:", err);
      setStudentProfile(null);
    }
  };

  const checkExistingApplication = async (studentId) => {
    try {
      setCheckingApplication(true);
      const response = await applicationAPI.getAll();

      const existingApp = response.data.applications.find(
        (app) => 
          (app.studentid === studentId || app.student_id === studentId) && 
          (app.internshipid === parseInt(id) || app.internship_id === parseInt(id))
      );
      
      console.log("Existing application check:", existingApp);
      setHasApplied(Boolean(existingApp));
    } catch (err) {
      console.error("Error checking application:", err);
      setHasApplied(false);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApplyClick = async () => {
    console.log("Apply button clicked");
    
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isStudent) {
      alert("Only students can apply for internships.");
      return;
    }

    if (!studentProfile) {
      if (
        window.confirm(
          "You need to complete your profile before applying. Would you like to do that now?"
        )
      ) {
        navigate("/profile-setup");
      }
      return;
    }

    if (hasApplied) {
      alert("You have already applied for this internship.");
      return;
    }

    if (!studentProfile?.id) {
      alert("Student profile is missing. Please refresh the page.");
      return;
    }

    if (!internship?.id) {
      alert("Internship information is missing. Please refresh the page.");
      return;
    }

    if (!internship?.startupid) {
      alert("Startup information is missing. Please contact support.");
      return;
    }

    const applicationData = {
      student_id: studentProfile.id,
      internship_id: parseInt(id),
      startup_id: internship.startupid,
      status: "Applied",
      notes: null,
    };

    console.log("Submitting application with data:", applicationData);

    try {
      setApplying(true);
      setError("");

      const response = await applicationAPI.create(applicationData);
      console.log("Application created successfully:", response.data);

      setApplicationSuccess(true);
      setHasApplied(true);

      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (err) {
      console.error("Application submission error:", err);
      console.error("Error response:", err.response);
      
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to submit application. Please try again.";
      
      alert(message);
      setError(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Internship</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/internships")}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Internships
          </button>
        </div>
      </div>
    );
  }

  if (!internship) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/internships")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Internships</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{internship.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-medium">{internship.startup_name || "Unknown Company"}</span>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full whitespace-nowrap ml-4">
                    {internship.status}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {internship.role && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Role</p>
                        <p className="text-gray-900 font-semibold">{internship.role}</p>
                      </div>
                    </div>
                  )}

                  {internship.location && (
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Location</p>
                        <p className="text-gray-900 font-semibold">{internship.location}</p>
                      </div>
                    </div>
                  )}

                  {internship.stipend && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Stipend</p>
                        <p className="text-gray-900 font-semibold">{internship.stipend}</p>
                      </div>
                    </div>
                  )}

                  {internship.posted_at && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Posted</p>
                        <p className="text-gray-900 font-semibold">{formatDate(internship.posted_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section */}
            {internship.description && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>About this Internship</span>
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{internship.description}</p>
                </div>
              </div>
            )}

            {/* Required Skills Section */}
            {internship.required_skills && internship.required_skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <span>Required Skills</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {internship.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Website Section */}
            {internship.startup_website && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Company</h2>
                <a
                  href={internship.startup_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-700 font-medium group"
                >
                  <Globe className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="border-b border-transparent group-hover:border-blue-600 transition-colors duration-200">
                    Visit Company Website
                  </span>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Apply for this Internship</h3>

              {isStudent ? (
                <>
                  {internship.status === "Active" ? (
                    <>
                      {/* Benefits List */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">Quick and easy application process</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">Get notified about your application status</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">Connect directly with the startup</span>
                        </div>
                      </div>

                      {hasApplied ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <p className="font-semibold text-green-900">Application Submitted</p>
                          </div>
                          <p className="text-sm text-green-700">You've already applied for this internship</p>
                        </div>
                      ) : applicationSuccess ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <p className="font-semibold text-green-900">Application Submitted Successfully!</p>
                          </div>
                          <p className="text-sm text-green-700">Redirecting to your applications...</p>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={handleApplyClick}
                            disabled={checkingApplication || applying}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                          >
                            {applying ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                              </span>
                            ) : checkingApplication ? (
                              "Checking..."
                            ) : (
                              "Apply Now"
                            )}
                          </button>

                          {!studentProfile && (
                            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                              Complete your profile to apply
                            </p>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                      <Clock className="w-6 h-6 text-gray-500 flex-shrink-0" />
                      <p className="text-gray-700">
                        This internship is currently <span className="font-semibold">{internship.status.toLowerCase()}</span>
                      </p>
                    </div>
                  )}
                </>
              ) : isStartup ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <p className="text-blue-900 font-medium">You're viewing this as a startup owner</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">Sign in as a student to apply for this internship</p>
                  <Link 
                    to="/login"
                    className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-center"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Application Tips */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Application Tips</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Make sure your profile is complete and up-to-date</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Highlight relevant skills in your application notes</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Be clear about your availability and commitment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;
