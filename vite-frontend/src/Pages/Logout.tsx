import { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    // Remove all authentication tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Optional: Clear any other user-related data
    localStorage.removeItem('user');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          {/* Logout Icon */}
          <div className="bg-red-100 p-4 rounded-full">
            <svg 
              className="w-12 h-12 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </div>
          
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          
          {/* Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Logging out...
            </h2>
            <p className="text-gray-600">
              Please wait while we securely log you out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;