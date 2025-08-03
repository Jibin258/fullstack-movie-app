import { useState } from "react";
import type { Entry } from "../../types"; // Importing Entry type (except 'id' since it's auto-generated)
import { useNavigate } from "react-router-dom";
import axios from "axios";

// EntryForm component handles the form UI and logic for submitting a new movie or TV show entry
const EntryForm = () => {
    const navigate = useNavigate(); // React Router hook to navigate programmatically

    // State to hold form data (excluding the 'id' field)
    const [formData, setFormData] = useState<Omit<Entry, "id">>({
        title: "",
        type: "Movie", // Default type is 'Movie'
        director: "",
        budget: 0,
        location: "",
        duration: "",
        yearOrTime: "",
    });

    // Submission status to prevent multiple form submissions
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // Convert budget string to float, fallback to 0 if invalid
            [name]: name === "budget" ? parseFloat(value) || 0 : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh
        setIsSubmitting(true); // Disable the form while submitting

        try {
            // Send POST request to backend API with form data and auth token
            const response = await axios.post("http://localhost:5000/api/movies", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Auth header
                },
            });

            // Show success message
            alert(response.data.message);

            // Reset form after successful submission
            setFormData({
                title: "",
                type: "Movie",
                director: "",
                budget: 0,
                location: "",
                duration: "",
                yearOrTime: "",
            });

            // Navigate to entry-table page
            navigate('/entry-table');
        } catch (error) {
            console.error("Error adding entry:", error);
            alert("Failed to add entry. Please try again.");
        } finally {
            setIsSubmitting(false); // Re-enable form
        }
    };

    // Render form
    return (
        <div className="md:pt-10 md:px-24 min-h-screen bg-gradient-to-tr from-blue-100 via-white to-pink-100">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto max-md:min-h-screen max-md:bg-gradient-to-tr from-blue-100 via-white to-pink-100"
            >
                <h2 className="text-xl font-semibold text-gray-700 text-center">Add Movie/Show</h2>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    {/* Type Dropdown */}
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="Movie">Movie</option>
                        <option value="TV Show">TV Show</option>
                    </select>
                    
                    {/* Director */}
                    <input
                        name="director"
                        value={formData.director}
                        onChange={handleChange}
                        placeholder="Director"
                        required
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    {/* Budget */}
                    <input
                        name="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Budget (USD)"
                        required
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    {/* Location */}
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Location"
                        required
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    {/* Duration */}
                    <input
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Duration (e.g. 2h 10m)"
                        required
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                    
                    {/* Release Year or Time */}
                    <input
                        name="yearOrTime"
                        value={formData.yearOrTime}
                        onChange={handleChange}
                        placeholder="Release Year or Time"
                        required
                        className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding Entry...' : 'Add Entry'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EntryForm;
