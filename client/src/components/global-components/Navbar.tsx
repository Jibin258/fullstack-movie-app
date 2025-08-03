import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
    navRoute?: string;
    hiddenOptions?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ navRoute, hiddenOptions }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Logout function that clears the token
    const logout = () => {
        setIsLoggingOut(true);

        setTimeout(() => {
            localStorage.removeItem("token");
            setIsLoggingOut(false);
            navigate('/');
        }, 3000);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 text-xl font-bold text-blue-600">
                        MovieApp
                    </div>

                    {/* Desktop Menu */}
                    <div className={`hidden ${!hiddenOptions && 'md:flex'} space-x-6 items-center`}>
                        <Link to={navRoute ?? "/fallback"} className="text-gray-700 hover:text-blue-600">
                            {navRoute === '/entry-form' ? 'Add Movie/Show' : 'View Movie/Show'}
                        </Link>
                        <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                            {isLoggingOut ? 'Logging Out...' : 'Logout'}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className={`${hiddenOptions ? 'hidden' : 'md:hidden'}`}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 focus:outline-none"
                        >
                            {isOpen ? (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow">
                    <Link to={navRoute ?? "/fallback"} className="block text-gray-700 hover:text-blue-600">
                        {navRoute === '/entry-form' ? 'Add Movie/Show' : 'View Movie/Show'}
                    </Link>
                    <button onClick={logout} className="block w-full text-left text-red-500 hover:text-red-600">
                        {isLoggingOut ? 'Logging Out...' : 'Logout'}
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
