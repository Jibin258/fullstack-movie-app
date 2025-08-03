import { useState, useEffect } from "react";
import type { FC } from "react";
import type { Entry } from "../../types";

// Props definition for EditModal
interface EditModalProps {
    entry: Entry | null;                 // The entry to be edited
    isOpen: boolean;                     // Flag to show/hide modal
    onClose: () => void;                 // Function to close the modal
    onSubmit: (updatedEntry: Entry) => void; // Function to handle submission of edited data
}

// Functional component with props destructured
const EditModal: FC<EditModalProps> = ({ entry, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Entry | null>(null); // State to hold form data

    // Populate form data whenever a new entry is passed in
    useEffect(() => {
        if (entry) setFormData(entry);
    }, [entry]);

    // If modal is not open or no data to edit, return null (do not render anything)
    if (!isOpen || !formData) return null;

    // Handle changes in input fields and update local state accordingly
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev!, [name]: value }));
    };

    // Handle form submission: call onSubmit with updated data, then close modal
    const handleSubmit = () => {
        onSubmit(formData!);
        onClose();
    };

    return (
        // Fullscreen modal with gradient background
        <div className="fixed inset-0 min-h-screen bg-gradient-to-tr from-blue-100 via-white to-pink-100 bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Edit Entry</h2>

                {/* Input fields for each editable property of the Entry */}
                <div className="space-y-3">
                    <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="director" value={formData.director} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="budget" type="number" value={formData.budget} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="duration" value={formData.duration} onChange={handleChange} className="w-full border p-2 rounded" />
                    <input name="yearOrTime" value={formData.yearOrTime} onChange={handleChange} className="w-full border p-2 rounded" />
                </div>

                {/* Modal buttons for cancel and update actions */}
                <div className="flex justify-end mt-4 space-x-2">
                    <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Update</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
