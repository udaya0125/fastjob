import { X } from 'lucide-react';
import React, { useState } from 'react';

const ConfirmedVisitorDetails = ({ visitor, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        date: visitor.date || '',
        name: visitor.name || '',
        customer_number: visitor.customer_number || '',
        companyname: visitor.companyname || '',
        company_number: visitor.company_number || '',
        salary: visitor.salary || '',
        income_type: visitor.income_type || '',
        percent: visitor.percent || '',
        income: visitor.income || '',
        status: visitor.status || 'Confirm',
        payment_status: visitor.payment_status || '',
        payment_method: visitor.payment_method || '',
        citizenship: visitor.citizenship || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onUpdate(formData);
            alert('Details updated successfully!');
        } catch (error) {
            alert('Failed to update details');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Edit Confirmed Visitor Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Customer Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Number
                                </label>
                                <input
                                    type="text"
                                    name="customer_number"
                                    value={formData.customer_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Company Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    name="companyname"
                                    value={formData.companyname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Company Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Number
                                </label>
                                <input
                                    type="text"
                                    name="company_number"
                                    value={formData.company_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salary
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Income Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Income Type
                                </label>
                                <select
                                    name="income_type"
                                    value={formData.income_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                >
                                    <option value="">Select Income Type</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="project">Project Based</option>
                                </select>
                            </div>

                            {/* Percent */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Percent (%)
                                </label>
                                <input
                                    type="number"
                                    name="percent"
                                    value={formData.percent}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Income */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Income
                                </label>
                                <input
                                    type="number"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirm">Confirm</option>
                                    <option value="Training">Training</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Status *
                                </label>
                                <select
                                    name="payment_status"
                                    value={formData.payment_status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                >
                                    <option value="">Select Payment Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method
                                </label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Phonepay">Phonepay</option>
                                </select>
                            </div>

                            {/* Citizenship - Changed from input to select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Citizenship
                                </label>
                                <select
                                    name="citizenship"
                                    value={formData.citizenship}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    disabled={submitting}
                                >
                                    <option value="">Select Citizenship</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Details'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmedVisitorDetails;