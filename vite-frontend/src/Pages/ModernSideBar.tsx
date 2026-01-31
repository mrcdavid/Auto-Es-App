import { useState, useEffect } from 'react';

interface UserData {
	first_Name?: string;
	last_Name?: string;
	username?: string;
	email?: string;
}

const ModernSidebar = () => {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showLogout, setShowLogout] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
	const [activePage, setActivePage] = useState('dashboard');

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

	const handleNavigation = (page: string) => {
		setActivePage(page);
		// Close sidebar on mobile after navigation
		if (window.innerWidth < 1024) {
			setSidebarOpen(false);
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
		<div className="min-h-screen bg-gray-100">

			{/* Mobile Header */}
			<header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
				<div className="flex items-center justify-between px-4 py-3">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">AES</span>
						</div>
						<h1 className="text-lg font-bold text-gray-900">Auto Quotation</h1>
					</div>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
					>
						{sidebarOpen ? (
							<svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						) : (
							<svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						)}
					</button>
				</div>
			</header>


			{/* Sidebar */}
			<aside
				className={`fixed left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
				${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
				top-16 h-[calc(100vh-4rem)]
				lg:top-0 lg:h-screen lg:translate-x-0`}

			>
				<div className="flex flex-col h-full">
					{/* Logo Section */}
					<div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-gray-200">
						<div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold">AB</span>
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">Alums</h1>
							<p className="text-xs text-gray-500">Fabrication System</p>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 overflow-y-auto">
						{/* Dashboard */}
						<button
							onClick={() => handleNavigation('dashboard')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${activePage === 'dashboard'
									? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
									: 'text-gray-700 hover:bg-gray-100'
								}`}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							<span className="font-medium">Dashboard</span>
						</button>

						{/* Analytics */}
						<button
							onClick={() => handleNavigation('analytics')}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${activePage === 'analytics'
									? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
									: 'text-gray-700 hover:bg-gray-100'
								}`}
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
							<span className="font-medium">Analytics</span>
						</button>

						{/* User Dropdown */}
						<div className="mb-2">
							<button
								onClick={() => setUserDropdownOpen(!userDropdownOpen)}
								className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
							>
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									<span className="font-medium">User</span>
								</div>
								<svg
									className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''
										}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							{/* User Submenu */}
							<div
								className={`overflow-hidden transition-all duration-300 ${userDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
									}`}
							>
								<button
									onClick={() => handleNavigation('personal-info')}
									className={`w-full flex items-center gap-3 px-4 py-2.5 pl-12 rounded-lg text-sm transition-all duration-200 ${activePage === 'personal-info'
											? 'bg-blue-50 text-blue-600 font-medium'
											: 'text-gray-600 hover:bg-gray-50'
										}`}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Personal Information
								</button>
								<button
									onClick={() => handleNavigation('settings')}
									className={`w-full flex items-center gap-3 px-4 py-2.5 pl-12 rounded-lg text-sm transition-all duration-200 ${activePage === 'settings'
											? 'bg-blue-50 text-blue-600 font-medium'
											: 'text-gray-600 hover:bg-gray-50'
										}`}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									Settings
								</button>
							</div>
						</div>

						{/* Orders Dropdown */}
						<div className="mb-2">
							<button
								onClick={() => setOrdersDropdownOpen(!ordersDropdownOpen)}
								className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
							>
								<div className="flex items-center gap-3">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<span className="font-medium">Orders</span>
								</div>
								<svg
									className={`w-4 h-4 transition-transform duration-200 ${ordersDropdownOpen ? 'rotate-180' : ''
										}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</button>

							{/* Orders Submenu */}
							<div
								className={`overflow-hidden transition-all duration-300 ${ordersDropdownOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
									}`}
							>
								<button
									onClick={() => handleNavigation('quotations')}
									className={`w-full flex items-center gap-3 px-4 py-2.5 pl-12 rounded-lg text-sm transition-all duration-200 ${activePage === 'quotations'
											? 'bg-blue-50 text-blue-600 font-medium'
											: 'text-gray-600 hover:bg-gray-50'
										}`}
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									Quotations
								</button>
							</div>
						</div>
					</nav>

					{/* User Profile Section */}
					<div className="px-4 py-4 border-t border-gray-200"
						onMouseLeave={() => setShowLogout(false)}
					>
						<div className="relative">
							<div
								className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
								onClick={() => setShowLogout(!showLogout)}
							>
								<div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
									<span className="text-white font-semibold text-sm">JD</span>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
									<p className="text-xs text-gray-500 truncate">{user?.email}</p>
								</div>
								<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
								</svg>
							</div>

							{/* Logout Button Popup */}
							{showLogout && (
								<div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
									<button
										onClick={handleLogout}
										onMouseLeave={() => setShowLogout(false)}
										className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
										</svg>
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</aside>

			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				></div>
			)}

			{/* Main Content */}
			<main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
				<div className="p-6">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-4">
							{activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ')}
						</h1>
						<p className="text-gray-600">
							This is the content area for the {activePage} page. The sidebar is sticky and responsive!
						</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ModernSidebar;