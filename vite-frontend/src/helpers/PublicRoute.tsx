import { Navigate } from 'react-router-dom';
import React from 'react';

interface PublicRouteProps {
	children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
	const token = localStorage.getItem('access_token');
	
	// If user has valid token, redirect to dashboard
	if (token) {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const isExpired = payload.exp * 1000 < Date.now();
			
			if (!isExpired) {
				// Token is valid, redirect to dashboard
				return <Navigate to="/dashboard" replace />;
			} else {
				// Token expired, remove it
				localStorage.removeItem('access_token');
			}
		} catch (error) {
			// Invalid token, remove it
			localStorage.removeItem('token');
		}
	}
	
	// No valid token, allow access to public page
	return <>{children}</>;
};

export default PublicRoute;