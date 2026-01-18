import { useState, useEffect} from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
//import { Mail, Lock, User, } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface RegisterErrors {
    first_Name?: string;
    last_Name?: string;
    username?: string;
    email?: string;
    password?: string;
    error?: string;
}

export default function RegisterPage() {
    const [first_Name, setFirst_Name] = useState('');
    const [last_Name, setLast_Name] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      if (showSuccessModal) {
        const timer = setTimeout(() => {
          navigate("/");
        }, 2000); // matches progress animation

        return () => clearTimeout(timer);
      }
    }, [showSuccessModal, navigate]);





    
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

    setLoading(true);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Registration successful:', { username, email, password });
      // Handle successful registration here
    }
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
          error: errorData.detail || "Registration failed",
        });
        return;
      }

      setShowSuccessModal(true);
      const data = await response.json();
      console.log(data);

      //navigate("/"); // back to login

    } catch (err) {
      setErrors({
        error: "Server error. Please try again later.",
      });
    }
  };

  const handleBackToLogin = () => {
        navigate("/"); // redirects to /login page
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AES-APP
            </h1>
            <p className="text-gray-500 mt-2">Create your account to get started.</p>
          </div>

          {/* Register Form */}
          <div className="space-y-5">
            {/* Username Input */}
            {/* First Name Input */}
            <div>
              <label htmlFor="first_Name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="first_Name"
                type="text"
                value={first_Name}
                onChange={(e) => setFirst_Name(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                  errors.first_Name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.first_Name && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.first_Name}</span>
                </div>
              )}
            </div>

            {/* Last Name Input */}
            <div>
              <label htmlFor="last_Name" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="last_Name"
                type="text"
                value={last_Name}
                onChange={(e) => setLast_Name(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                  errors.last_Name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.last_Name && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.last_Name}</span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Choose a username"
              />
              {errors.username && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition pr-12 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className={`mt-3 p-3 rounded-lg border ${passwordStrength.bgColor} ${passwordStrength.borderColor}`}>
                  <div className="flex items-center gap-2">
                    {passwordStrength.strength === 'weak' ? (
                      <AlertCircle size={18} className={passwordStrength.color} />
                    ) : (
                      <CheckCircle size={18} className={passwordStrength.color} />
                    )}
                    <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-gray-600 space-y-1 ml-6">
                    <li className={password.length >= 8 ? 'text-green-600' : ''}>
                      • At least 8 characters
                    </li>
                    <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
                      • Mix of uppercase and lowercase
                    </li>
                    <li className={/\d/.test(password) ? 'text-green-600' : ''}>
                      • At least one number
                    </li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>
                      • At least one special character
                    </li>
                  </ul>
                </div>
              )}

              {errors.password && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg hover:shadow-xl mt-6"
            >
              Register
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Back to Login Button */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
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
                'Create Account'
              )}
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white text-sm mt-6 opacity-80">
          Secure registration powered by AES encryption
        </p>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-slideUp">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Success!
              </h2>

              <p className="text-gray-600 mb-4">
                Your account has been created successfully.
                <br />
                Redirecting to home page...
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-linear-to-r from-blue-500 to-purple-600 h-2 animate-progress" />
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}








// import { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
// //import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     first_Name: '',
//     last_Name: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.first_Name.trim()) {
//       newErrors.first_Name = 'First name is required';
//     } else if (formData.first_Name.trim().length < 2) {
//       newErrors.first_Name = 'First name must be at least 2 characters';
//     }

//     if (!formData.last_Name.trim()) {
//       newErrors.last_Name = 'Last name is required';
//     } else if (formData.last_Name.trim().length < 2) {
//       newErrors.last_Name = 'Last name must be at least 2 characters';
//     }

//         if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.trim().length < 2) {
//       newErrors.username = 'Username must be at least 2 characters';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain uppercase, lowercase, and number';
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.MouseEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setLoading(true);
//     setErrors({});

//     try {
//       const response = await fetch('http://localhost:8000/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           first_Name: formData.first_Name,
//           last_Name: formData.last_Name,
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (data.detail) {
//           setErrors({ submit: data.detail });
//         } else {
//           setErrors({ submit: 'Registration failed. Please try again.' });
//         }
//         return;
//       }

//       setShowSuccessModal(true);
      
//       setTimeout(() => {
//         window.location.href = '/';
//       }, 2000);

//     } catch (error) {
//       setErrors({ submit: 'Network error. Please check your connection.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleSubmit(e as any);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full mb-4">
//               <User className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
//             <p className="text-gray-600">Join us today and get started</p>
//           </div>

//           <div className="space-y-5" onKeyPress={handleKeyPress}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 First Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="first_Name"
//                   value={formData.first_Name}
//                   onChange={handleChange}
//                   className={`w-full pl-11 pr-4 py-3 border ${
//                     errors.first_Name ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
//                   placeholder="John Doe"
//                 />
//               </div>
//               {errors.first_Name && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.first_Name}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Last Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="last_Name"
//                   value={formData.last_Name}
//                   onChange={handleChange}
//                   className={`w-full pl-11 pr-4 py-3 border ${
//                     errors.last_Name ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
//                   placeholder="John Doe"
//                 />
//               </div>
//               {errors.last_Name && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.last_Name}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Username
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className={`w-full pl-11 pr-4 py-3 border ${
//                     errors.username ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
//                   placeholder="John Doe"
//                 />
//               </div>
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.username}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full pl-11 pr-4 py-3 border ${
//                     errors.email ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
//                   placeholder="john@example.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full pl-11 pr-11 py-3 border ${
//                     errors.password ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`w-full pl-11 pr-11 py-3 border ${
//                     errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                   } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {errors.submit && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm text-red-600 flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4" />
//                   {errors.submit}
//                 </p>
//               </div>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Creating Account...
//                 </span>
//               ) : (
//                 'Create Account'
//               )}
//             </button>
//           </div>

//           <p className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
//               Sign in
//             </a>
//           </p>
//         </div>
//       </div>


//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-[slideUp_0.3s_ease-out]">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
//                 <CheckCircle2 className="w-10 h-10 text-green-600" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
//               <p className="text-gray-600 mb-4">
//                 Your account has been created successfully. Redirecting to home page...
//               </p>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-[progress_2s_ease-in-out]" />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes slideUp {
//           from {
//             transform: translateY(20px);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//         @keyframes progress {
//           from {
//             width: 0%;
//           }
//           to {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


