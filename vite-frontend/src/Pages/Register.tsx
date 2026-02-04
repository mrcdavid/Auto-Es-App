import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, User, Mail, Lock, CheckCircle, } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";

interface RegisterErrors {
    first_Name?: string;
    last_Name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    error?: string;
}

export default function RegisterPage() {
    const [first_Name, setFirst_Name] = useState('');
    const [last_Name, setLast_Name] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [signingIn, setSigningIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                navigate("/");
            }, 2000); // matches progress animation

            return () => clearTimeout(timer);
        }
    }, [showSuccessModal, navigate]);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: "Passwords do not match",
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                confirmPassword: "",
            }));
        }
    }, [password, confirmPassword]);


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return { strength: '', text: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        if (strength <= 2) {
            return {
                strength: 'weak',
                text: 'Weak - Not Acceptable',
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-300'
            };
        } else if (strength <= 3) {
            return {
                strength: 'medium',
                text: 'Medium - Acceptable',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                borderColor: 'border-yellow-300'
            };
        } else {
            return {
                strength: 'strong',
                text: 'Strong - Acceptable',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-300'
            };
        }
    };

    const passwordStrength = getPasswordStrength(password);

    const handleRegister = async () => {
        setLoading(true);
        const newErrors: RegisterErrors = {};

        if (!first_Name || first_Name.length < 2) {
            newErrors.first_Name = 'First name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s-]+$/.test(first_Name)) {
            newErrors.first_Name = 'First name can only contain letters, spaces, and hyphens';
        }

        if (!last_Name || last_Name.length < 2) {
            newErrors.last_Name = 'Last name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s-]+$/.test(last_Name)) {
            newErrors.last_Name = 'Last name can only contain letters, spaces, and hyphens';
        }

        if (!username || username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (passwordStrength.strength === 'weak') {
            newErrors.password = 'Password is too weak. Please choose a stronger password';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setShowErrorModal(true);
            setLoading(false); // 🔥 show modal here
            return; // ❗ DO NOT continue
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_Name: first_Name,
                    last_Name: last_Name,
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({
                    error: errorData.detail || "Registration failed"
                });
                setShowErrorModal(true);
                return;
            }

            setShowSuccessModal(true);
            const data = await response.json();
            console.log("Registration success:", data);

        } catch (err) {
            setErrors({ error: "Server error. Please try again later." });
            setShowErrorModal(true);
        } finally {
            setLoading(false); // ✅ ALWAYS stop loading
        }
    };


    const handleBackToLogin = () => {
        setSigningIn(true);

        setTimeout(() => {
            setSigningIn(false);
            navigate("/");
        }, 1200);
        // redirects to /login page
    };


    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleRegister();
        }
    };

    return (
        <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl px-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100 w-full
                    max-h-[90vh] overflow-y-auto">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">AES Create Account</h1>
                        <p className="text-gray-600">Join us today and get started</p>
                    </div>

                    {/* Register Form */}
                    <div className="space-y-5" onKeyUp={handleKeyPress}>
                        {/* First & Last Name Row */}
                        <div className="flex gap-4">
                            {/* First Name */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="first_Name"
                                        type="text"
                                        value={first_Name}
                                        onChange={(e) => setFirst_Name(e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border ${errors.first_Name ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                {errors.first_Name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.first_Name}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="last_Name"
                                        type="text"
                                        value={last_Name}
                                        onChange={(e) => setLast_Name(e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 border ${errors.last_Name ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                                {errors.last_Name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.last_Name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                    placeholder="Choose a username"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password*/}
                        <div className="relative">
                            {/* Password */}
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-11 pr-11 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span
                                            className={`font-semibold ${passwordStrength.strength === 'weak'
                                                ? 'text-red-600'
                                                : passwordStrength.strength === 'medium'
                                                    ? 'text-yellow-600'
                                                    : 'text-green-600'
                                                }`}
                                        >
                                            {passwordStrength.text}
                                        </span>
                                        <span className="text-gray-400 text-xs">{password.length} / 12 chars</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strength === 'weak'
                                                ? 'bg-red-600 w-1/3'
                                                : passwordStrength.strength === 'medium'
                                                    ? 'bg-yellow-500 w-2/3'
                                                    : 'bg-green-600 w-full'
                                                }`}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Password Error */}
                            {errors.password && (
                                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-11 pr-11 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                placeholder="Re-type password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword ? (
                            <span className="text-red-600 flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errors.confirmPassword}
                            </span>
                        ) : confirmPassword && confirmPassword === password ? (
                            <span className="text-green-600 flex items-center gap-2">
                                <CheckCircle size={16} />
                                Passwords match
                            </span>
                        ) : null}

                        {/* Register Button */}
                        <button
                            type="button"
                            onClick={handleRegister}
                            disabled={password !== confirmPassword || loading}
                            className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg hover:shadow-xl mt-6"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Back to Login */}
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
                        >
                            {signingIn ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>

                        {/* Footer */}
                        <p className="text-center text-black text-sm mt-6 opacity-80">
                            Secure register powered by AES encryption
                        </p>

                        {/* Modals */}
                        <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
                        <ErrorModal show={showErrorModal} message={errors.error} onClose={() => setShowErrorModal(false)} />
                    </div>
                </div>
            </div>

            {/* Inline styles for animations */}
            <style>{`
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      @keyframes progress {
        from { width: 0%; }
        to { width: 100%; }
      }

      .animate-slideUp { animation: slideUp 0.3s ease-out; }
      .animate-progress { animation: progress 2s ease-in-out forwards; }
    `}</style>
        </div>
    );
}
