import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from 'lucide-react';
import LoginSuccessModal from "../components/LoginSuccessModal";

type TokenResponse = {
	access_token: string;
	token_type?: string;
};

type ErrorResponse = {
	detail?: string;
};

function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [showError, setShowError] = useState<boolean>(false);
	const [loginLoading, setLoginLoading] = useState<boolean>(false);
	const [registerLoading, setRegisterLoading] = useState<boolean>(false);
	const [showLoginSuccess, setShowLoginSuccess] = useState(false);

	const navigate = useNavigate();

	const validateForm = (): boolean => {
		if (!username || !password || username.length < 3) {
			setError("Username and password are required.");
			return false;
		}
		setError("");
		return true;
	};



	const handleForgotPassword = () => {
		navigate("/forgot-password"); // Navigate to forgot password page
	};


	const handleRegister = () => {
		setRegisterLoading(true);

		setTimeout(() => {
			setRegisterLoading(false);
			navigate("/register");
		}, 1200);
	};

	const handleLogin = async (): Promise<void> => {

		if (!username.trim() || !password.trim()) {
			setShowError(true);
			setError("Username and password are required!");
			return;
		}

		if (!validateForm()) return;
		setLoginLoading(true);

		const formDetails = new URLSearchParams();
		formDetails.append("username", username);
		formDetails.append("password", password);

		try {
			const response = await fetch("http://localhost:8000/api/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formDetails.toString(),
			});

			setLoginLoading(false);

			if (response.ok) {
				const data: TokenResponse = await response.json();
				localStorage.setItem("access_token", data.access_token);

				setShowLoginSuccess(true);

				setTimeout(() => {
					navigate("/dashboard");
				}, 1200);

			} else {
				const errorData: ErrorResponse = await response.json();
				setShowError(true)
				setError(errorData.detail ?? "Authentication failed!");
			}
		} catch (err) {
			setLoginLoading(false);
			setShowError(true)
			setError("An error occurred. Please try again.");

		}
	};
	return (
		<div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Login Card */}
				<div className="bg-white rounded-2xl shadow-2xl p-8">
					{/* Logo/Title */}
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
							AES-APP
						</h1>
						<p className="text-gray-500 mt-2">Welcome back! Please login to your account.</p>
					</div>

					{/* Error Message */}
					{showError && error && (
						<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
							<AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
							<p className="text-red-700 text-sm">Wrong username or password. Try again.</p>
						</div>
					)}

					{/* Login Form */}
					<div className="space-y-6">
						{/* Username Input */}
						<div>
							<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
								Username
							</label>
							<input
								id="username"
								type="text"
								value={username}
								onChange={(e) => {
									setUsername(e.target.value)
									setShowError(false)
									setError('')
								}}
								onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
								placeholder="Enter your username"
							/>
						</div>

						{/* Password Input */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
									setShowError(false)
									setError('')
								}}
								onKeyUp={(e) => e.key === 'Enter' && handleLogin()}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
								placeholder="Enter your password"
							/>
						</div>

						{/* Forgot Password Link */}
						<div className="flex justify-end">
							<button
								type="button"
								onClick={handleForgotPassword}
								className="text-sm text-purple-600 hover:text-purple-700 font-medium px-2 py-1 rounded-md hover:bg-purple-50 transition-all duration-200"
							>
								Forgot password?
							</button>
						</div>

						{/* Login Button */}
						<button
							type="button"
							onClick={handleLogin}
							disabled={loginLoading}
							className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{loginLoading ? (
								<span className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Logging in...
								</span>
							) : (
								"Login"
							)}
						</button>

					</div>

					{/* Divider */}
					<div className="relative my-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-gray-500">Or</span>
						</div>
					</div>

					{/* Register Button */}
					<button
						type="button"
						onClick={handleRegister}
						disabled={registerLoading}
						className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{registerLoading ? (
							<span className="flex items-center justify-center gap-2">
								<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Creating Account...
							</span>
						) : (
							"Create Account"
						)}
					</button>

				</div>

				{/* Footer Text */}
				<p className="text-center text-white text-sm mt-6 opacity-80">
					Secure login powered by AES encryption
				</p>
			</div>
					{/* ✅ Login Success Modal (add here) */}
		<LoginSuccessModal
			show={showLoginSuccess}
			username={username}
		/>
		</div>
	);

}

export default Login;