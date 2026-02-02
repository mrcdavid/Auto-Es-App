import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import ModernSidebar from "./Pages/ModernSideBar";
import ProtectedRoute from "./helpers/ProtectedRoute";
import PublicRoute from "./helpers/PublicRoute";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from './Pages/ResetPassword';
import "./index.css";

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<PublicRoute>
							<RegisterPage />
						</PublicRoute>
					}
				/>
				<Route
					path="/reset-password"
					element={
						<PublicRoute>
							<ResetPassword />
						</PublicRoute>
					}
				/>
				<Route
					path="/forgot-password"
					element={
						<PublicRoute>
							<ForgotPassword />
						</PublicRoute>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<ModernSidebar />
						</ProtectedRoute>
					}
				/>

			</Routes>
		</Router>
	);
}

export default App;
