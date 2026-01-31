import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const token = localStorage.getItem('access_token');
	
	if (!token) {
		return <Navigate to="/" replace />;
	}
	
	// Optional: Add token validation logic here
	try {
		// You can decode and check if token is expired
		const payload = JSON.parse(atob(token.split('.')[1]));
		const isExpired = payload.exp * 1000 < Date.now();
		
		if (isExpired) {
			localStorage.removeItem('access_token');
			return <Navigate to="/" replace />;
		}
	} catch (error) {
		localStorage.removeItem('access_token');
		return <Navigate to="/" replace />;
	}
	
	return <>{children}</>;
};

export default ProtectedRoute;