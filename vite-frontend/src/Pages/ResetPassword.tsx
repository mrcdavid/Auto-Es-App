import { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const token = useMemo(() => params.get("token") || "", [params]);

	const [code, setCode] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMsg("");

		try {
			// Make sure token is defined
			if (!token) {
				setMsg("Missing reset token. Please use the link from your email.");
				return;
			}

			const res = await fetch("http://localhost:8000/api/auth/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: token,        // must match schema
					code: code,          // must be 6-digit string
					new_password: newPassword, // must match schema
				}),
			});

			if (!res.ok) {
				// Backend returned error (400, 404, etc)
				const data = await res.json();
				setMsg(data.detail || "Failed to reset password.");
				setLoading(false);
				return;
			}

			const data = await res.json();
			setMsg(data.message || "Password reset successfully!");
			setLoading(false);

			// Optional: redirect to login
			setTimeout(() => navigate("/"), 1200);

		} catch (err) {
			// Network error or CORS issue
			console.error(err);
			setMsg("Unable to connect to server. Please try again.");
			setLoading(false);
		}

	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<form
				onSubmit={handleReset}
				className="bg-white w-full max-w-md p-6 rounded-2xl shadow"
			>
				<h1 className="text-2xl font-bold mb-2">Reset Password</h1>
				<p className="text-gray-600 mb-6">
					Enter the 6-digit code sent to your email.
				</p>

				{!token && (
					<p className="text-red-600 text-sm mb-4">
						Missing token. Please use the reset link from your email.
					</p>
				)}

				<input
					className="w-full border rounded-xl px-4 py-2 mb-3 focus:outline-none focus:ring"
					placeholder="6-digit code"
					value={code}
					maxLength={6}
					onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
					required
				/>

				<input
					className="w-full border rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring"
					placeholder="New password (min 8 chars)"
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>

				<button
					disabled={loading || !token}
					className="w-full bg-black text-white rounded-xl py-2 font-semibold hover:opacity-90 disabled:opacity-50"
				>
					{loading ? "Updating..." : "Reset Password"}
				</button>

				{msg && (
					<p
						className={`mt-4 text-sm ${msg.toLowerCase().includes("wrong") ||
								msg.toLowerCase().includes("invalid") ||
								msg.toLowerCase().includes("expired")
								? "text-red-600"
								: "text-green-700"
							}`}
					>
						{msg}
					</p>
				)}
			</form>
		</div>
	);
}
