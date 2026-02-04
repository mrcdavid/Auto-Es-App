import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMsg("");

		const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		});

		const data = await res.json();
		setMsg(data.message);
		setLoading(false);
	};

	const handleBackToLogin = () => {
		navigate("/");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<form
				onSubmit={handleSubmit}
				className="bg-white w-full max-w-md p-6 rounded-2xl shadow"
			>
				{/* Back Button */}
				<button
					type="button"
					onClick={handleBackToLogin}
					className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
				>
					<ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
					<span className="text-sm font-medium">Back to Login</span>
				</button>

				<h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
				<p className="text-gray-600 mb-6">
					Enter your email to receive a reset link + 6-digit code.
				</p>

				<input
					className="w-full border rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring"
					placeholder="Email address"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<button
					disabled={loading}
					className="w-full bg-black text-white rounded-xl py-2 font-semibold hover:opacity-90 disabled:opacity-50"
				>
					{loading ? "Sending..." : "Send Reset Email"}
				</button>

				{msg && <p className="mt-4 text-sm text-green-700">{msg}</p>}
			</form>
		</div>
	);
}