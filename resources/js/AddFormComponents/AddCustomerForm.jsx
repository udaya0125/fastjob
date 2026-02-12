import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddCustomerForm = ({ editingCustomer, onClose, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [customerForm, setCustomerForm] = useState({
        name: "",
        reference_by: "",
        permanent_address: "",
        temporary_address: "",
        contact_number: "",
        experience: "",
        interested_in: "",
    });

    // Use Effect for setting form data when editing
    useEffect(() => {
        if (editingCustomer) {
            setCustomerForm({
                name: editingCustomer.name || "",
                reference_by: editingCustomer.reference_by || "",
                permanent_address: editingCustomer.permanent_address || "",
                temporary_address: editingCustomer.temporary_address || "",
                contact_number: editingCustomer.contact_number || "",
                experience: editingCustomer.experience || "",
                interested_in: editingCustomer.interested_in || "",
            });
        } else {
            // Reset form for new customer
            setCustomerForm({
                name: "",
                reference_by: "",
                permanent_address: "",
                temporary_address: "",
                contact_number: "",
                experience: "",
                interested_in: "",
            });
        }
    }, [editingCustomer]);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!customerForm.name.trim() || !customerForm.contact_number.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);

            if (editingCustomer) {
                // Editing existing customer
                await axios.put(
                    route("ourcustomers.update", { id: editingCustomer.id }),
                    customerForm,
                );
            } else {
                // Creating new customer
                await axios.post(route("ourcustomers.store"), customerForm);
            }

            onSuccess();
        } catch (error) {
            console.log("Error saving data", error);
            alert(error.response?.data?.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header - Same as AddEmployerForm */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingCustomer ? "Edit Customer" : "Add New Customer"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form - Same layout as AddEmployerForm */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={customerForm.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter customer name"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="contact_number"
                                value={customerForm.contact_number}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter contact number"
                                required
                                disabled={submitting}
                            />
                        </div>

                        {/* Reference By */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reference By
                            </label>
                            <input
                                type="text"
                                name="reference_by"
                                value={customerForm.reference_by}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Who referred this customer?"
                                disabled={submitting}
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Experience<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="experience"
                                value={customerForm.experience}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="e.g., 5 years in sales"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Address Section - Both addresses in one line */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Permanent Address */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Permanent Address<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="permanent_address"
                                value={customerForm.permanent_address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="Enter permanent address"
                                disabled={submitting}
                            />
                        </div>

                        {/* Temporary Address */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Temporary Address<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="temporary_address"
                                value={customerForm.temporary_address}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                placeholder="Enter temporary address"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Interested In */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Interested In<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="interested_in"
                            value={customerForm.interested_in}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Real Estate, Cars, etc."
                            disabled={submitting}
                        />
                    </div>

                    {/* Form Actions - Same as AddEmployerForm */}
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
                                    {editingCustomer
                                        ? "Updating..."
                                        : "Saving..."}
                                </>
                            ) : editingCustomer ? (
                                "Update Customer"
                            ) : (
                                "Add Customer"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerForm;
