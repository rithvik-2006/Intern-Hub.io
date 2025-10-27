
// // src/pages/AppliedApplications.jsx
// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Briefcase, ExternalLink } from "lucide-react";
// import { applicationAPI, studentAPI } from "../services/api";

// const StatusBadge = ({ status }) => {
//   const base = "inline-block px-3 py-1 rounded-full text-sm font-medium";
//   switch (status) {
//     case "Applied":
//       return <span className={`${base} bg-blue-100 text-blue-800`}>{status}</span>;
//     case "Reviewing":
//       return <span className={`${base} bg-yellow-100 text-yellow-800`}>{status}</span>;
//     case "Interviewing":
//       return <span className={`${base} bg-indigo-100 text-indigo-800`}>{status}</span>;
//     case "Offer":
//       return <span className={`${base} bg-green-100 text-green-800`}>{status}</span>;
//     case "Rejected":
//       return <span className={`${base} bg-red-100 text-red-800`}>{status}</span>;
//     default:
//       return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
//   }
// };

// const AppliedApplications = () => {
//   const { user, isStudent } = useAuth();
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [StudentId,setStudentId] = useState(null)



//   const loadApplications = async () => {
//     if (!isStudent) {
//       setError("Only students can view their applied internships.");
//       setLoading(false);
//       return;
//     }

//     // ✅ Check for student_profile_id (from previous fix)
//     if (!user?.student_profiles_id && !user?.id) {
//       setError("Student profile not found. Please complete your profile setup.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       // ✅ Use student_profile_id if available, otherwise fallback to user.id
//       const studentId = user.student_profile_id || user.id;
      
//       // ✅ axios returns response in .data
//       const response = await applicationAPI.getByStudentId(studentId);
      
//       // ✅ Handle axios response structure
//       const apps = response.data?.applications ?? [];
//       setApplications(apps);
//     } catch (err) {
//       console.error("Failed to load applications:", err);
      
//       // ✅ Better error message handling for axios errors
//       if (err.response) {
//         // Server responded with error status
//         setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
//       } else if (err.request) {
//         // Request made but no response
//         setError("No response from server. Check if backend is running.");
//       } else {
//         // Other errors
//         setError(err.message || "Failed to load applications");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user && isStudent) {
//       loadApplications();
//     } else {
//       setLoading(false);
//     }
//   }, [user, isStudent]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[300px]">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-red-50 rounded-md">
//         <p className="text-red-700 font-medium">Error</p>
//         <p className="text-sm text-red-600 mt-2">{error}</p>
//         <button
//           onClick={loadApplications}
//           className="mt-4 inline-block bg-red-600 text-white px-3 py-1 rounded"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold">My Applications</h2>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={loadApplications}
//             className="px-3 py-1 bg-primary-50 hover:bg-primary-100 rounded"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {applications.length === 0 ? (
//         <div className="p-6 border rounded-md text-center">
//           <Briefcase className="mx-auto mb-3" />
//           <p className="font-medium">You haven't applied to any internships yet.</p>
//           <p className="text-sm text-gray-500 mt-2">Browse internships to start applying.</p>
//         </div>
//       ) : (
//         <ul className="space-y-4">
//           {applications.map((app) => (
//             <li key={app.application_id} className="p-4 border rounded-md flex flex-col md:flex-row md:items-center md:justify-between">
//               <div>
//                 <div className="flex items-center gap-3">
//                   <h3 className="text-lg font-semibold">{app.internship_title ?? "Untitled Internship"}</h3>
//                   <span className="text-sm text-gray-500">• {app.internship_location ?? "Location not specified"}</span>
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1">{app.internship_description ?? ""}</p>

//                 <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
//                   <div><strong>Startup:</strong> {app.startup_name ?? "—"}</div>
//                   <div><strong>Stipend:</strong> {app.internship_stipend ?? "—"}</div>
//                   <div><strong>Applied:</strong> {new Date(app.applied_at).toLocaleString()}</div>
//                 </div>
//               </div>

//               <div className="mt-3 md:mt-0 flex items-center gap-4">
//                 <StatusBadge status={app.status} />

//                 {app.startup_website ? (
//                   <a
//                     href={app.startup_website}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="inline-flex items-center gap-2 text-sm px-3 py-1 border rounded hover:bg-gray-50"
//                   >
//                     Visit startup <ExternalLink className="w-4 h-4" />
//                   </a>
//                 ) : null}

//                 <button
//                   onClick={() => navigator.clipboard?.writeText(window.location.origin + `/internships/${app.internship_id}`)}
//                   className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
//                   title="Copy internship link"
//                 >
//                   Copy link
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default AppliedApplications;

// src/pages/AppliedApplications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, ExternalLink, AlertCircle } from "lucide-react";
import { applicationAPI, studentAPI } from "../services/api";

const StatusBadge = ({ status }) => {
  const base = "inline-block px-3 py-1 rounded-full text-sm font-medium";
  switch (status) {
    case "Applied":
      return <span className={`${base} bg-blue-100 text-blue-800`}>{status}</span>;
    case "Reviewing":
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>{status}</span>;
    case "Interviewing":
      return <span className={`${base} bg-indigo-100 text-indigo-800`}>{status}</span>;
    case "Offer":
      return <span className={`${base} bg-green-100 text-green-800`}>{status}</span>;
    case "Rejected":
      return <span className={`${base} bg-red-100 text-red-800`}>{status}</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

const AppliedApplications = () => {
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState(null); // ✅ Fixed: lowercase 's' and camelCase
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  // ✅ Separate useEffect to fetch student profile ID
  useEffect(() => {
    // ✅ Define async function inside useEffect
    const fetchStudentProfile = async () => {
      if (!isStudent || !user?.id) {
        return;
      }

      try {
        console.log("Fetching student profile...");
        
        // ✅ Call the /me endpoint
        const response = await studentAPI.getMe();
        
        console.log("Student profile response:", response.data);

        // ✅ Extract student ID from response
        if (response.data?.student?.id) {
          setStudentId(response.data.student.id);
          console.log("Student ID set to:", response.data.student.id);
        } else {
          console.log("No student profile found");
          setNeedsProfileSetup(true);
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
        
        if (err.response?.status === 404) {
          setNeedsProfileSetup(true);
        } else {
          setError("Failed to load student profile. Please try again.");
        }
      }
    };

    // ✅ Call the async function
    fetchStudentProfile();
  }, [user, isStudent]); // Dependencies

  // ✅ Separate useEffect to load applications when studentId is available
  useEffect(() => {
    // ✅ Define async function inside useEffect
    const loadApplications = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching applications for student ID:", studentId);

        // ✅ Fetch applications using student ID
        const response = await applicationAPI.getByStudentId(studentId);
        
        console.log("Applications response:", response.data);

        // ✅ Handle axios response structure
        const apps = response.data?.applications ?? [];
        setApplications(apps);
        
        console.log("Loaded applications:", apps);
      } catch (err) {
        console.error("Failed to load applications:", err);

        // ✅ Better error message handling
        if (err.response) {
          const errorMsg = err.response.data?.message || 'Unknown error';
          setError(`Server error (${err.response.status}): ${errorMsg}`);
        } else if (err.request) {
          setError("No response from server. Check if backend is running.");
        } else {
          setError(err.message || "Failed to load applications");
        }
      } finally {
        setLoading(false);
      }
    };

    // ✅ Call the async function
    loadApplications();
  }, [studentId]); // Only run when studentId changes

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // ✅ Handle profile setup needed
  if (needsProfileSetup) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Complete Your Profile First
              </h3>
              <p className="text-yellow-800 mb-4">
                Before you can view your applications, you need to set up your student profile.
              </p>
              <button
                onClick={() => navigate('/profile/setup')}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition"
              >
                Set Up Profile Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Show error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-md max-w-2xl mx-auto mt-8">
        <p className="text-red-700 font-medium">Error</p>
        <p className="text-sm text-red-600 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Show applications list
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Applications</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-primary-50 hover:bg-primary-100 rounded"
        >
          Refresh
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="p-6 border rounded-md text-center">
          <Briefcase className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="font-medium">You haven't applied to any internships yet.</p>
          <p className="text-sm text-gray-500 mt-2">Browse internships to start applying.</p>
          <button
            onClick={() => navigate('/internships')}
            className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Browse Internships
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li key={app.application_id} className="p-4 border rounded-md hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {app.internship_title ?? "Untitled Internship"}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>

                  {app.internship_location && (
                    <p className="text-sm text-gray-500 mb-2">
                      📍 {app.internship_location}
                    </p>
                  )}

                  {app.internship_description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {app.internship_description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <div>
                      <strong>Startup:</strong> {app.startup_name ?? "—"}
                    </div>
                    {app.internship_stipend && (
                      <div>
                        <strong>Stipend:</strong> {app.internship_stipend}
                      </div>
                    )}
                    <div>
                      <strong>Applied:</strong> {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {app.startup_website && (
                    <a
                      href={app.startup_website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
                    >
                      Visit <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/internships/${app.internship_id}`;
                      navigator.clipboard?.writeText(url);
                      alert("Link copied!");
                    }}
                    className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
                  >
                    Copy link
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppliedApplications;
