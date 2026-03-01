import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

const EditCompanyVisitorForm = ({
    editingVisitor,
    setReloadTrigger,
    onClose,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [nameOptions, setNameOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState({
        names: false,
        companies: false,
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            customer_number: "",
            companyname: "",
            position: "",
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
        },
    });

    // Add this useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";

        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.position = "static";
            document.body.style.width = "auto";
        };
    }, []); // Empty dependency array means this runs once on mount

    // Fetch options from APIs
    useEffect(() => {
        fetchNameOptions();
        fetchCompanyOptions();
    }, []);

    // Use Effect for editing - populate form with existing data
    useEffect(() => {
        if (editingVisitor) {
            const formData = {
                name: editingVisitor.name || "",
                customer_number: editingVisitor.customer_number || "",
                companyname: editingVisitor.companyname || "",
                position: editingVisitor.position || "",
                date: editingVisitor.date
                    ? editingVisitor.date.split("T")[0]
                    : new Date().toISOString().split("T")[0],
                status: editingVisitor.status || "Pending",
            };

            reset(formData);
        }
    }, [editingVisitor, reset]);

    // Fetch customer names
    const fetchNameOptions = async () => {
        try {
            setLoadingOptions((prev) => ({ ...prev, names: true }));
            const response = await axios.get(
                route("ourcustomername.indexname"),
            );
            const formattedOptions = (response.data.data || response.data).map(
                (customer) => ({
                    value: customer.name,
                    label: customer.name,
                    customerId: customer.id,
                }),
            );
            setNameOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching customer names:", error);
            setNameOptions([]);
        } finally {
            setLoadingOptions((prev) => ({ ...prev, names: false }));
        }
    };

    // Fetch company names only
    const fetchCompanyOptions = async () => {
        try {
            setLoadingOptions((prev) => ({ ...prev, companies: true }));
            const response = await axios.get(
                route("ouremployersdetails.employeeindex"),
            );
            const employers = response.data.data || [];

            // Extract company names only
            const companyOptionsSet = new Set();

            employers.forEach((employer) => {
                if (employer.name) companyOptionsSet.add(employer.name);
            });

            // Format company options
            const companyFormatted = Array.from(companyOptionsSet).map(
                (company) => ({
                    value: company,
                    label: company,
                }),
            );
            setCompanyOptions(companyFormatted);
        } catch (error) {
            console.error("Error fetching employers:", error);
            setCompanyOptions([]);
        } finally {
            setLoadingOptions((prev) => ({ ...prev, companies: false }));
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        // Basic validation
        if (!data.name || !data.customer_number || !data.companyname) {
            alert("Please fill in all required fields");
            return;
        }

        const formData = new FormData();

        // Append form data
        Object.keys(data).forEach((key) => {
            if (
                data[key] !== null &&
                data[key] !== undefined &&
                data[key] !== ""
            ) {
                formData.append(key, data[key]);
            }
        });

        try {
            setSubmitting(true);

            // Update existing visitor
            await handleUpdate(formData, editingVisitor.id);

            onClose();
        } catch (error) {
            console.log("Error updating data", error);
            alert(
                error.response?.data?.message ||
                    "Failed to update visitor. Please check the form data.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        reset();
        onClose();
    };

    // Custom styles for react-select with increased z-index
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: "42px",
            borderColor: state.isFocused
                ? "#6366f1"
                : errors[state.name]
                  ? "#ef4444"
                  : "#d1d5db",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
                : "none",
            "&:hover": {
                borderColor: state.isFocused ? "#6366f1" : "#9ca3af",
            },
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            position: "absolute",
            marginTop: "4px",
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: "200px",
            overflow: "auto",
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#6366f1"
                : state.isFocused
                  ? "#eef2ff"
                  : "white",
            color: state.isSelected ? "white" : "#374151",
            "&:active": {
                backgroundColor: "#4f46e5",
            },
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    };

    if (!editingVisitor) {
        return null; // Don't render if no visitor is being edited
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                style={{ zIndex: 100 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Edit Visitor
                        </h2>
                        {/* <p className="text-sm text-gray-500 mt-1">
                            ID: {editingVisitor.id} • Created: {new Date(editingVisitor.created_at).toLocaleDateString()}
                        </p> */}
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date<span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="date"
                                control={control}
                                rules={{ required: "Date is required" }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        disabled={submitting}
                                    />
                                )}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>

                        {/* Name Field - React Select */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name<span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: "Name is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={nameOptions}
                                        value={
                                            nameOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || null
                                        }
                                        onChange={(selected) =>
                                            field.onChange(
                                                selected?.value || "",
                                            )
                                        }
                                        placeholder="Select or type to search..."
                                        isSearchable
                                        isLoading={loadingOptions.names}
                                        loadingMessage={() =>
                                            "Loading names..."
                                        }
                                        noOptionsMessage={() =>
                                            "No names found"
                                        }
                                        styles={selectStyles}
                                        isDisabled={submitting}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Contact Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                                <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="customer_number"
                                control={control}
                                rules={{
                                    required: "Contact number is required",
                                    pattern: {
                                        value: /^[0-9\s\-+()]+$/,
                                        message:
                                            "Please enter a valid contact number",
                                    },
                                }}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter contact number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        disabled={submitting}
                                    />
                                )}
                            />
                            {errors.customer_number && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.customer_number.message}
                                </p>
                            )}
                        </div>

                        {/* Company Name Field - React Select */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name
                                <span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="companyname"
                                control={control}
                                rules={{ required: "Company name is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={companyOptions}
                                        value={
                                            companyOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    field.value,
                                            ) || null
                                        }
                                        onChange={(selected) =>
                                            field.onChange(
                                                selected?.value || "",
                                            )
                                        }
                                        placeholder="Select or type to search..."
                                        isSearchable
                                        isLoading={loadingOptions.companies}
                                        loadingMessage={() =>
                                            "Loading companies..."
                                        }
                                        noOptionsMessage={() =>
                                            "No companies found"
                                        }
                                        styles={selectStyles}
                                        isDisabled={submitting}
                                        menuPortalTarget={document.body}
                                        menuPosition="fixed"
                                    />
                                )}
                            />
                            {errors.companyname && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.companyname.message}
                                </p>
                            )}
                        </div>

                        {/* Position Field - Text Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position<span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="position"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Enter position (e.g., Manager, Director, etc.)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        disabled={submitting}
                                    />
                                )}
                            />
                        </div>

                        {/* Status Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status<span className="text-red-500">*</span>
                            </label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: "Status is required" }}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        disabled={submitting}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirm">Confirm</option>
                                        <option value="Training">
                                            Training
                                        </option>
                                        <option value="Rejected">
                                            Rejected
                                        </option>
                                    </select>
                                )}
                            />
                            {errors.status && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Visitor"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCompanyVisitorForm;
