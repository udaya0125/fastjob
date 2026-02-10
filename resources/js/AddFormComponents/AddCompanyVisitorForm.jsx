// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import axios from "axios";
// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";

// const AddCompanyVisitorForm = ({
//     editingVisitor,
//     setEditingVisitor,
//     setReloadTrigger,
//     onClose,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [nameOptions, setNameOptions] = useState([]);
//     const [companyOptions, setCompanyOptions] = useState([]);
//     const [loadingOptions, setLoadingOptions] = useState({
//         names: false,
//         companies: false,
//     });

//     const {
//         control,
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//         formState: { errors },
//     } = useForm({
//         defaultValues: {
//             name: "",
//             customer_number: "",
//             companyname: "",
//             position: "",
//             date: new Date().toISOString().split("T")[0],
//             status: "Pending",
//         },
//     });

//     const watchedPosition = watch("position");

//     // Fetch options from APIs
//     useEffect(() => {
//         fetchNameOptions();
//         fetchCompanyOptions();
//     }, []);

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingVisitor) {
//             const formData = {
//                 name: editingVisitor.name || "",
//                 customer_number: editingVisitor.customer_number || "",
//                 companyname: editingVisitor.companyname || "",
//                 position: editingVisitor.position || "",
//                 date: editingVisitor.date
//                     ? editingVisitor.date.split("T")[0]
//                     : new Date().toISOString().split("T")[0],
//                 status: editingVisitor.status || "Pending",
//             };

//             reset(formData);
//         } else {
//             reset({
//                 name: "",
//                 customer_number: "",
//                 companyname: "",
//                 position: "",
//                 date: new Date().toISOString().split("T")[0],
//                 status: "Pending",
//             });
//         }
//     }, [editingVisitor, reset]);

//     // Fetch customer names
//     const fetchNameOptions = async () => {
//         try {
//             setLoadingOptions((prev) => ({ ...prev, names: true }));
//             const response = await axios.get(
//                 route("ourcustomername.indexname"),
//             );
//             const formattedOptions = (response.data.data || response.data).map(
//                 (customer) => ({
//                     value: customer.name,
//                     label: customer.name,
//                     customerId: customer.id,
//                 }),
//             );
//             setNameOptions(formattedOptions);
//         } catch (error) {
//             console.error("Error fetching customer names:", error);
//             setNameOptions([]);
//         } finally {
//             setLoadingOptions((prev) => ({ ...prev, names: false }));
//         }
//     };

//     // Fetch company names only (removed position fetching)
//     const fetchCompanyOptions = async () => {
//         try {
//             setLoadingOptions((prev) => ({ ...prev, companies: true }));
//             const response = await axios.get(
//                 route("ouremployersdetails.employeeindex"),
//             );
//             const employers = response.data.data || [];

//             // Extract company names only
//             const companyOptionsSet = new Set();

//             employers.forEach((employer) => {
//                 if (employer.name) companyOptionsSet.add(employer.name);
//             });

//             // Format company options
//             const companyFormatted = Array.from(companyOptionsSet).map(
//                 (company) => ({
//                     value: company,
//                     label: company,
//                 }),
//             );
//             setCompanyOptions(companyFormatted);
//         } catch (error) {
//             console.error("Error fetching employers:", error);
//             setCompanyOptions([]);
//         } finally {
//             setLoadingOptions((prev) => ({ ...prev, companies: false }));
//         }
//     };

//     // Handle Create User
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(
//                 route("ourvisitors.store"),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating user", error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Basic validation
//         if (!data.name || !data.customer_number || !data.companyname) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         const formData = new FormData();

//         // Append form data
//         Object.keys(data).forEach((key) => {
//             if (
//                 data[key] !== null &&
//                 data[key] !== undefined &&
//                 data[key] !== ""
//             ) {
//                 formData.append(key, data[key]);
//             }
//         });

//         try {
//             setSubmitting(true);

//             if (editingVisitor) {
//                 // Editing existing user
//                 await handleUpdate(formData, editingVisitor.id);
//             } else {
//                 // Creating new user
//                 await handleCreate(formData);
//             }

//             onClose();
//             if (!editingVisitor) {
//                 reset();
//             }
//             setEditingVisitor(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//             alert(
//                 error.response?.data?.message ||
//                     "Failed to save visitor. Please check the form data.",
//             );
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle cancel
//     const handleCancel = () => {
//         reset();
//         onClose();
//         setEditingVisitor(null);
//     };

//     // Custom styles for react-select with increased z-index
//     const selectStyles = {
//         control: (base, state) => ({
//             ...base,
//             minHeight: "42px",
//             borderColor: state.isFocused
//                 ? "#6366f1"
//                 : errors[state.name]
//                   ? "#ef4444"
//                   : "#d1d5db",
//             boxShadow: state.isFocused
//                 ? "0 0 0 2px rgba(99, 102, 241, 0.2)"
//                 : "none",
//             "&:hover": {
//                 borderColor: state.isFocused ? "#6366f1" : "#9ca3af",
//             },
//         }),
//         menu: (base) => ({
//             ...base,
//             zIndex: 9999,
//             position: "absolute",
//             marginTop: "4px",
//         }),
//         menuList: (base) => ({
//             ...base,
//             maxHeight: "200px",
//             overflow: "auto",
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected
//                 ? "#6366f1"
//                 : state.isFocused
//                   ? "#eef2ff"
//                   : "white",
//             color: state.isSelected ? "white" : "#374151",
//             "&:active": {
//                 backgroundColor: "#4f46e5",
//             },
//         }),
//         // Additional styling for dropdown portal to ensure it's above modal
//         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     };

//     console.log("Editing Visitor:", {
//         editingVisitor,
//     });

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div
//                 className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
//                 style={{ zIndex: 100 }}
//             >
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingVisitor ? "Edit Visitor" : "Add New Visitor"}
//                     </h2>
//                     <button
//                         onClick={handleCancel}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Date Field */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Date *
//                             </label>
//                             <Controller
//                                 name="date"
//                                 control={control}
//                                 rules={{ required: "Date is required" }}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="date"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         disabled={submitting}
//                                     />
//                                 )}
//                             />
//                             {errors.date && (
//                                 <p className="text-red-500 text-xs mt-1">
//                                     {errors.date.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Name Field - React Select */}
//                         <div className="relative">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Name *
//                             </label>
//                             <Controller
//                                 name="name"
//                                 control={control}
//                                 rules={{ required: "Name is required" }}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         options={nameOptions}
//                                         value={
//                                             nameOptions.find(
//                                                 (option) =>
//                                                     option.value ===
//                                                     field.value,
//                                             ) || null
//                                         }
//                                         onChange={(selected) =>
//                                             field.onChange(
//                                                 selected?.value || "",
//                                             )
//                                         }
//                                         placeholder="Select or type to search..."
//                                         isSearchable
//                                         isLoading={loadingOptions.names}
//                                         loadingMessage={() =>
//                                             "Loading names..."
//                                         }
//                                         noOptionsMessage={() =>
//                                             "No names found"
//                                         }
//                                         styles={selectStyles}
//                                         isDisabled={submitting}
//                                         menuPortalTarget={document.body} // Render dropdown in body to ensure it's above modal
//                                         menuPosition="fixed"
//                                     />
//                                 )}
//                             />
//                             {errors.name && (
//                                 <p className="text-red-500 text-xs mt-1">
//                                     {errors.name.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Contact Number Field */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Contact Number *
//                             </label>
//                             <Controller
//                                 name="customer_number"
//                                 control={control}
//                                 rules={{
//                                     required: "Contact number is required",
//                                     pattern: {
//                                         value: /^[0-9\s\-+()]+$/,
//                                         message:
//                                             "Please enter a valid contact number",
//                                     },
//                                 }}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter contact number"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         disabled={submitting}
//                                     />
//                                 )}
//                             />
//                             {errors.customer_number && (
//                                 <p className="text-red-500 text-xs mt-1">
//                                     {errors.customer_number.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Company Name Field - React Select */}
//                         <div className="relative">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Company Name *
//                             </label>
//                             <Controller
//                                 name="companyname"
//                                 control={control}
//                                 rules={{ required: "Company name is required" }}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         options={companyOptions}
//                                         value={
//                                             companyOptions.find(
//                                                 (option) =>
//                                                     option.value ===
//                                                     field.value,
//                                             ) || null
//                                         }
//                                         onChange={(selected) =>
//                                             field.onChange(
//                                                 selected?.value || "",
//                                             )
//                                         }
//                                         placeholder="Select or type to search..."
//                                         isSearchable
//                                         isLoading={loadingOptions.companies}
//                                         loadingMessage={() =>
//                                             "Loading companies..."
//                                         }
//                                         noOptionsMessage={() =>
//                                             "No companies found"
//                                         }
//                                         styles={selectStyles}
//                                         isDisabled={submitting}
//                                         menuPortalTarget={document.body} // Render dropdown in body to ensure it's above modal
//                                         menuPosition="fixed"
//                                     />
//                                 )}
//                             />
//                             {errors.companyname && (
//                                 <p className="text-red-500 text-xs mt-1">
//                                     {errors.companyname.message}
//                                 </p>
//                             )}
//                         </div>

//                         {/* Position Field - Text Input */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Position
//                             </label>
//                             <Controller
//                                 name="position"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="text"
//                                         placeholder="Enter position (e.g., Manager, Director, etc.)"
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         disabled={submitting}
//                                     />
//                                 )}
//                             />
//                         </div>

//                         {/* Status Field */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Status *
//                             </label>
//                             <Controller
//                                 name="status"
//                                 control={control}
//                                 rules={{ required: "Status is required" }}
//                                 render={({ field }) => (
//                                     <select
//                                         {...field}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                         disabled={submitting}
//                                     >
//                                         <option value="Pending">Pending</option>
//                                         <option value="Confirm">Confirm</option>
//                                         <option value="Training">
//                                             Training
//                                         </option>
//                                         <option value="Rejected">
//                                             Rejected
//                                         </option>
//                                     </select>
//                                 )}
//                             />
//                             {errors.status && (
//                                 <p className="text-red-500 text-xs mt-1">
//                                     {errors.status.message}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Form Actions */}
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                             type="button"
//                             onClick={handleCancel}
//                             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                     {editingVisitor
//                                         ? "Updating..."
//                                         : "Saving..."}
//                                 </>
//                             ) : editingVisitor ? (
//                                 "Update Visitor"
//                             ) : (
//                                 "Add Visitor"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddCompanyVisitorForm;

import React, { useState, useEffect, use, useContext } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { MainContextData } from "@/Context/MainContext";
import AddEmployerForm from "./AddEmployerForm";
import AddCustomerForm from "./AddCustomerForm";

const AddCompanyVisitorForm = ({ setReloadTrigger, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [nameOptions, setNameOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState({
        names: false,
        companies: false,
    });

    const {
        showAddForm,
        setShowAddForm,
        editingEmployer,
        setEditingEmployer,
        reloadEmployerTrigger,
        setReloadEmployerTrigger,
        handleAddNewEmployee,
    } = useContext(MainContextData);
    const {
        showForm,
        setShowForm,
        editingCustomer,
        setEditingCustomer,
        handleFormClose,
        handleSuccess,
        setReloadCustomerTrigger,
        reloadCustomerTrigger,
        handleAddNew,
    } = useContext(MainContextData);

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

    // Fetch options from APIs
    useEffect(() => {
        fetchNameOptions();
        fetchCompanyOptions();

        // Reset form to default values
        reset({
            name: "",
            customer_number: "",
            companyname: "",
            position: "",
            date: new Date().toISOString().split("T")[0],
            status: "Pending",
        });
    }, []);

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

    // Handle Create User
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourvisitors.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
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
            await handleCreate(formData);
            onClose();
            reset();
        } catch (error) {
            console.log("Error saving data", error);
            alert(
                error.response?.data?.message ||
                    "Failed to save visitor. Please check the form data.",
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

    console.log(handleAddNew);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
                style={{ zIndex: 100 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Visitor
                    </h2>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                {showAddForm && (
                    <AddEmployerForm
                        editingEmployer={editingEmployer}
                        setEditingEmployer={setEditingEmployer}
                        reloadEmployerTrigger={reloadEmployerTrigger}
                        setReloadEmployerTrigger={setReloadEmployerTrigger}
                        onClose={() => {
                            setShowAddForm(false);
                            setEditingEmployer(null);
                        }}
                    />
                )}

                {showForm && (
                    <AddCustomerForm
                        editingCustomer={editingCustomer}
                        onClose={handleFormClose}
                        onSuccess={handleSuccess}
                    />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date *
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
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Name *
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddNew}
                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
                                >
                                    <span>+</span>
                                    <span>Add New</span>
                                </button>
                            </div>
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
                                Contact Number *
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <button
                                    type="button"
                                     onClick={handleAddNewEmployee}
                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
                                >
                                    <span>+</span>
                                    <span>Add New</span>
                                </button>
                            </div>
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
                                Position
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
                                Status *
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
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700  transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                "Add Visitor"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCompanyVisitorForm;
