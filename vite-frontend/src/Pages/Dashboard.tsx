import { useState, useEffect } from 'react';

interface UserData {
  first_Name: string;
  last_Name: string;
  username: string;
  email: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                throw new Error("No token found");
            }

            const response = await fetch("http://localhost:8000/users/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();

            setUser({
                first_Name: data.first_Name,
                last_Name: data.last_Name,
                username: data.username,
                email: data.email,
            });

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to load user data");
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Redirect to login page
        window.location.href = '/';
    };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">

      {/* Header with Logout Button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>,
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.first_Name}!
          </h2>
          <p className="text-gray-600">Here's your profile information</p>
        </div>

        {/* User Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* First Name Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">First Name</p>
                <p className="text-xl font-bold text-gray-900">{user?.first_Name}</p>
              </div>
            </div>
          </div>

          {/* Last Name Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Last Name</p>
                <p className="text-xl font-bold text-gray-900">{user?.last_Name}</p>
              </div>
            </div>
          </div>

          {/* Username Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Username</p>
                <p className="text-xl font-bold text-gray-900">{user?.username}</p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-xl font-bold text-gray-900 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Summary</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Full Name:</span>
              <span className="text-gray-900 font-semibold">{user?.first_Name} {user?.last_Name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Username:</span>
              <span className="text-gray-900 font-semibold">{user?.username}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
              <span className="text-gray-600 font-medium mb-1 sm:mb-0">Email Address:</span>
              <span className="text-gray-900 font-semibold break-all">{user?.email}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;