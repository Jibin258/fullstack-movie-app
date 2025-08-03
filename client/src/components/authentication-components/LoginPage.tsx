import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // Form state to hold email and password inputs
    const [form, setForm] = useState({ email: "", password: "" });

    // Error state for displaying login errors
    const [error, setError] = useState("");

    // State to indicate login process status
    const [isLogging, setIsLogging] = useState(false);

    // Handle input change and update form state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit function to authenticate user login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLogging(true);

        try {
            // Send login request to backend
            const res = await axios.post(`${API}/api/auth/login`, form);

            // Save token to local storage on successful login
            localStorage.setItem("token", res.data.token);

            // Show success message
            alert(res.data.message);

            // Navigate to entry table/dashboard
            navigate('/entry-table');
        } catch (err: any) {
            // Handle login errors
            console.error(err);
            setError(err.response?.data?.error || "Login failed.");
        } finally {
            setIsLogging(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-pink-100 px-4">
            <div className="w-full max-w-md md:bg-white md:shadow-2xl rounded-xl p-8 space-y-6 transition-all duration-300">
                {/* Page Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
                    <p className="text-sm text-gray-500 mt-1">Log in to continue</p>
                </div>

                {/* Error message box */}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email input */}
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1.5 pt-4 pb-1 transition-all"
                        />
                        <label className="absolute left-1.5 top-0 text-sm text-gray-500 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 transition-all">
                            Email
                        </label>
                    </div>

                    {/* Password input */}
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1.5 pt-4 pb-1 transition-all"
                        />
                        <label className="absolute left-1.5 top-0 text-sm text-gray-500 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 transition-all">
                            Password
                        </label>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md shadow-md transition-all duration-200"
                        disabled={isLogging}
                    >
                        {isLogging ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                {/* Sign up link */}
                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
