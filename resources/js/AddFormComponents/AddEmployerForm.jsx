import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload } from "lucide-react";

const AddEmployerForm = ({
    editingEmployer,
    setEditingEmployer,
    reloadEmployerTrigger,
    setReloadEmployerTrigger,
    onClose,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [employerForm, setEmployerForm] = useState({
        name: "",
        post: "",
        location: "",
        salary: "",
        time: "", 
        contact_number: "",
        experience: "",
    });

    // Use Effect
    useEffect(() => {
        if (editingEmployer) {
            setEmployerForm({
                name: editingEmployer.name || "",
                post: editingEmployer.post || "",
                location: editingEmployer.location || "",
                salary: editingEmployer.salary || "",
                time: editingEmployer.time || "", // Changed default value
                contact_number: editingEmployer.contact_number || "",
                experience: editingEmployer.experience || "",
            });
        }
    }, [editingEmployer]);

    // Handle Create Employer
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ouremployers.store"), formData);
            setReloadEmployerTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating employer", error);
            throw error;
        }
    };

    // Handle Update Employer
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            await axios.post(route("ouremployers.update", { id }), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadEmployerTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error updating employer", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (
            !employerForm.name ||
            !employerForm.post ||
            !employerForm.location ||
            !employerForm.contact_number ||
            !employerForm.time
        ) {
            alert("Please fill in all required fields");
            return;
        }

        const formData = new FormData();

        // Append all form data
        Object.keys(employerForm).forEach((key) => {
            if (employerForm[key] !== null && employerForm[key] !== "") {
                formData.append(key, employerForm[key]);
            }
        });

        try {
            setSubmitting(true);

            if (editingEmployer) {
                // Editing existing employer
                await handleUpdate(formData, editingEmployer.id);
            } else {
                // Creating new employer
                await handleCreate(formData);
            }

            // Reset form and close
            setEmployerForm({
                name: "",
                post: "",
                location: "",
                salary: "",
                time: "", // Reset to empty string
                contact_number: "",
                experience: "",
            });

            onClose();
            setEditingEmployer(null);
        } catch (error) {
            console.log("Error saving data", error);
            alert("Failed to save employer. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setEmployerForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingEmployer ? "Edit Employer" : "Add New Employer"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={employerForm.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter company name"
                                required
                            />
                        </div>

                        {/* Job Post */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Post *
                            </label>
                            <input
                                type="text"
                                name="post"
                                value={employerForm.post}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Frontend Developer"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={employerForm.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Kathmandu"
                                required
                            />
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Salary
                            </label>
                            <input
                                type="text"
                                name="salary"
                                value={employerForm.salary}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., Rs. 80,000"
                            />
                        </div>

                        {/* Job Type - Changed from select to text input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Working Time *
                            </label>
                            <input
                                type="text"
                                name="time"
                                value={employerForm.time}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="9:30 to 5:30"
                                required
                            />
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number *
                            </label>
                            <input
                                type="text"
                                name="contact_number"
                                value={employerForm.contact_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., +977-9841234567"
                                required
                            />
                        </div>
                    </div>

                    {/* Experience - Full width */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Experience
                        </label>
                        <input
                            type="text"
                            name="experience"
                            value={employerForm.experience}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., 2+ Years"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : editingEmployer ? (
                                "Update Employer"
                            ) : (
                                "Add Employer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployerForm;
