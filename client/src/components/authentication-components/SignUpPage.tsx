import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate(); // Hook to programmatically navigate to another route
    const [form, setForm] = useState({ name: "", email: "", password: "" }); // Form state
    const [error, setError] = useState(""); // Error state for displaying signup errors
    const [isSigningUp, setIsSigningUp] = useState(false); // Loading state for the signup process

    // Handles input changes and updates form state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handles form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSigningUp(true); // Start loading

        try {
            // Send signup data to backend
            const res = await axios.post(`${API}/api/auth/signup`, form);
            alert(res.data.message); // Show success message
            navigate('/'); // Redirect to sign-in page
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || "Sign up failed."); // Set error message
        } finally {
            setIsSigningUp(false); // End loading
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-pink-100 px-4">
            <div className="w-full max-w-md md:bg-white md:shadow-2xl rounded-xl p-8 space-y-6 transition-all duration-300">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-800">Create an Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Join us and explore awesome features!</p>
                </div>

                {/* Display error message if any */}
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* Sign Up form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name input */}
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none px-1.5 pt-4 pb-1 transition-all"
                        />
                        <label className="absolute left-1.5 top-0 text-sm text-gray-500 peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 transition-all">
                            Name
                        </label>
                    </div>

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
                        disabled={isSigningUp} // Disable button when signing up
                    >
                        {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                {/* Link to sign-in page */}
                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
