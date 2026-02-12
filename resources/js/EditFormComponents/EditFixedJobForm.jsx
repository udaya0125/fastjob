// import React, { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import Select from 'react-select';
// import axios from 'axios';

// const EditFixedJobForm = ({ visitor, onClose, onUpdate }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [nameOptions, setNameOptions] = useState([]);
//     const [companyOptions, setCompanyOptions] = useState([]);
//     const [loadingOptions, setLoadingOptions] = useState({
//         names: false,
//         companies: false
//     });

//     const {
//         control,
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//         formState: { errors }
//     } = useForm({
//         defaultValues: {
//             date: '',
//             name: '',
//             customer_number: '',
//             companyname: '',
//             salary: '',
//             income_type: '',
//             percent: '',
//             income: '',
//             status: 'Confirm',
//             payment_status: '',
//             payment_method: '',
//             citizenship: '',
//         }
//     });

//     const watchedIncomeType = watch("income_type");
//     const watchedSalary = watch("salary");
//     const watchedPercent = watch("percent");

//     // Initialize form data when visitor changes
//     useEffect(() => {
//         if (visitor) {
//             reset({
//                 date: visitor.date ? visitor.date.split('T')[0] : '',
//                 name: visitor.name || '',
//                 customer_number: visitor.customer_number || '',
//                 companyname: visitor.companyname || '',
//                 salary: visitor.salary || '',
//                 income_type: visitor.income_type || '',
//                 percent: visitor.percent || '',
//                 income: visitor.income || '',
//                 status: visitor.status || 'Confirm',
//                 payment_status: visitor.payment_status || '',
//                 payment_method: visitor.payment_method || '',
//                 citizenship: visitor.citizenship || '',
//             });
//         }
//     }, [visitor, reset]);

//     // Fetch options from APIs
//     useEffect(() => {
//         fetchNameOptions();
//         fetchCompanyOptions();
//     }, []);

//     // Calculate income when salary, percent, or income_type changes
//     useEffect(() => {
//         if (watchedIncomeType === 'percentage' && watchedSalary && watchedPercent) {
//             const calculatedIncome = (parseFloat(watchedSalary) * parseFloat(watchedPercent) / 100).toFixed(2);
//             setValue("income", calculatedIncome, { shouldValidate: true });
//         }
//     }, [watchedIncomeType, watchedSalary, watchedPercent, setValue]);

//     // Fetch customer names
//     const fetchNameOptions = async () => {
//         try {
//             setLoadingOptions(prev => ({ ...prev, names: true }));
//             const response = await axios.get(route("ourcustomername.indexname"));
//             const formattedOptions = (response.data.data || response.data).map(customer => ({
//                 value: customer.name,
//                 label: customer.name,
//                 customerId: customer.id
//             }));
//             setNameOptions(formattedOptions);
//         } catch (error) {
//             console.error("Error fetching customer names:", error);
//             setNameOptions([]);
//         } finally {
//             setLoadingOptions(prev => ({ ...prev, names: false }));
//         }
//     };

//     // Fetch company names (from employers)
//     const fetchCompanyOptions = async () => {
//         try {
//             setLoadingOptions(prev => ({ ...prev, companies: true }));
//             const response = await axios.get(route("ouremployersdetails.employeeindex"));
//             const employers = response.data.data || [];
            
//             // Extract company names
//             const companyOptionsSet = new Set();
//             employers.forEach(employer => {
//                 if (employer.name) companyOptionsSet.add(employer.name);
//             });
            
//             // Format company options
//             const companyFormatted = Array.from(companyOptionsSet).map(company => ({
//                 value: company,
//                 label: company
//             }));
//             setCompanyOptions(companyFormatted);
            
//         } catch (error) {
//             console.error("Error fetching employers:", error);
//             setCompanyOptions([]);
//         } finally {
//             setLoadingOptions(prev => ({ ...prev, companies: false }));
//         }
//     };

//     // Handle form submission
//     const onSubmit = async (data) => {
//         // Basic validation
//         if (!data.name || !data.customer_number || !data.companyname) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         setSubmitting(true);
//         try {
//             await onUpdate(data);
//             // Success message is handled in the parent component
//         } catch (error) {
//             console.error('Update error:', error);
//             alert('Failed to update details');
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle cancel
//     const handleCancel = () => {
//         reset();
//         onClose();
//     };

//     // Custom styles for react-select with increased z-index
//     const selectStyles = {
//         control: (base, state) => ({
//             ...base,
//             minHeight: '42px',
//             borderColor: state.isFocused ? '#6366f1' : errors[state.name] ? '#ef4444' : '#d1d5db',
//             boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
//             '&:hover': {
//                 borderColor: state.isFocused ? '#6366f1' : '#9ca3af'
//             }
//         }),
//         menu: (base) => ({
//             ...base,
//             zIndex: 9999, // Increased z-index for dropdown
//             position: 'absolute',
//             marginTop: '4px'
//         }),
//         menuList: (base) => ({
//             ...base,
//             maxHeight: '200px',
//             overflow: 'auto'
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#eef2ff' : 'white',
//             color: state.isSelected ? 'white' : '#374151',
//             '&:active': {
//                 backgroundColor: '#4f46e5'
//             }
//         }),
//         // Additional styling for dropdown portal to ensure it's above modal
//         menuPortal: base => ({ ...base, zIndex: 9999 })
//     };

//     const isPercentageType = watchedIncomeType === 'percentage';
//     const isManualType = watchedIncomeType === 'manual';

//     console.log("Editing Visitor:", {
//         date: watch("date"),
//         name: watch("name"),
//         customer_number: watch("customer_number"),
//         companyname: watch("companyname"),
//         salary: watch("salary"),
//         income_type: watch("income_type"),
//         percent: watch("percent"),
//         income: watch("income"),
//         status: watch("status"),
//         payment_status: watch("payment_status"),
//         payment_method: watch("payment_method"),
//         citizenship: watch("citizenship"),
//     });

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 100 }}>
//                 <div className="p-6">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-2xl font-bold text-gray-800">
//                             Edit Confirmed Visitor Details
//                         </h2>
//                         <button
//                             onClick={handleCancel}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         >
//                             ✕
//                         </button>
//                     </div>

//                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {/* Date */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Date *
//                                 </label>
//                                 <Controller
//                                     name="date"
//                                     control={control}
//                                     rules={{ required: "Date is required" }}
//                                     render={({ field }) => (
//                                         <input
//                                             {...field}
//                                             type="date"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         />
//                                     )}
//                                 />
//                                 {errors.date && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
//                                 )}
//                             </div>

//                             {/* Name - React Select */}
//                             <div className="relative">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Name *
//                                 </label>
//                                 <Controller
//                                     name="name"
//                                     control={control}
//                                     rules={{ required: "Name is required" }}
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             options={nameOptions}
//                                             value={nameOptions.find(option => option.value === field.value) || null}
//                                             onChange={(selected) => field.onChange(selected?.value || "")}
//                                             placeholder="Select or type to search..."
//                                             isSearchable
//                                             isLoading={loadingOptions.names}
//                                             loadingMessage={() => "Loading names..."}
//                                             noOptionsMessage={() => "No names found"}
//                                             styles={selectStyles}
//                                             isDisabled={submitting}
//                                             menuPortalTarget={document.body} // Render dropdown in body to ensure it's above modal
//                                             menuPosition="fixed"
//                                         />
//                                     )}
//                                 />
//                                 {errors.name && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
//                                 )}
//                             </div>

//                             {/* Contact Number */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Contact Number *
//                                 </label>
//                                 <Controller
//                                     name="customer_number"
//                                     control={control}
//                                     rules={{ 
//                                         required: "Contact number is required",
//                                         pattern: {
//                                             value: /^[0-9\s\-+()]+$/,
//                                             message: "Please enter a valid contact number"
//                                         }
//                                     }}
//                                     render={({ field }) => (
//                                         <input
//                                             {...field}
//                                             type="text"
//                                             placeholder="Enter contact number"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         />
//                                     )}
//                                 />
//                                 {errors.customer_number && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.customer_number.message}</p>
//                                 )}
//                             </div>

//                             {/* Company Name - React Select */}
//                             <div className="relative">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Company Name *
//                                 </label>
//                                 <Controller
//                                     name="companyname"
//                                     control={control}
//                                     rules={{ required: "Company name is required" }}
//                                     render={({ field }) => (
//                                         <Select
//                                             {...field}
//                                             options={companyOptions}
//                                             value={companyOptions.find(option => option.value === field.value) || null}
//                                             onChange={(selected) => field.onChange(selected?.value || "")}
//                                             placeholder="Select or type to search..."
//                                             isSearchable
//                                             isLoading={loadingOptions.companies}
//                                             loadingMessage={() => "Loading companies..."}
//                                             noOptionsMessage={() => "No companies found"}
//                                             styles={selectStyles}
//                                             isDisabled={submitting}
//                                             menuPortalTarget={document.body} // Render dropdown in body to ensure it's above modal
//                                             menuPosition="fixed"
//                                         />
//                                     )}
//                                 />
//                                 {errors.companyname && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.companyname.message}</p>
//                                 )}
//                             </div>

//                             {/* Status */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Status *
//                                 </label>
//                                 <Controller
//                                     name="status"
//                                     control={control}
//                                     rules={{ required: "Status is required" }}
//                                     render={({ field }) => (
//                                         <select
//                                             {...field}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         >
//                                             <option value="Pending">Pending</option>
//                                             <option value="Confirm">Confirm</option>
//                                             <option value="Training">Training</option>
//                                             <option value="Rejected">Rejected</option>
//                                         </select>
//                                     )}
//                                 />
//                                 {errors.status && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
//                                 )}
//                             </div>

//                             {/* Salary */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Salary
//                                 </label>
//                                 <Controller
//                                     name="salary"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <input
//                                             {...field}
//                                             type="number"
//                                             step="0.01"
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         />
//                                     )}
//                                 />
//                             </div>

//                             {/* Income Type */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Income Type
//                                 </label>
//                                 <Controller
//                                     name="income_type"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <select
//                                             {...field}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         >
//                                             <option value="">Select Income Type</option>
//                                             <option value="percentage">Percentage</option>
//                                             <option value="manual">Manual</option>
//                                         </select>
//                                     )}
//                                 />
//                             </div>

//                             {/* Percent - Only show when income_type is Percentage */}
//                             {isPercentageType && (
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Percent (%)
//                                     </label>
//                                     <Controller
//                                         name="percent"
//                                         control={control}
//                                         render={({ field }) => (
//                                             <input
//                                                 {...field}
//                                                 type="number"
//                                                 step="0.01"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                                 disabled={submitting}
//                                             />
//                                         )}
//                                     />
//                                 </div>
//                             )}

//                             {/* Income - Different behavior based on income_type */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Income {isPercentageType ? "(Calculated)" : ""}
//                                 </label>
//                                 <Controller
//                                     name="income"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <input
//                                             {...field}
//                                             type="number"
//                                             step="0.01"
//                                             className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
//                                                 isPercentageType ? 'bg-gray-50' : 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
//                                             }`}
//                                             disabled={submitting || isPercentageType}
//                                             readOnly={isPercentageType}
//                                         />
//                                     )}
//                                 />
//                             </div>

//                             {/* Payment Status */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Payment Status *
//                                 </label>
//                                 <Controller
//                                     name="payment_status"
//                                     control={control}
//                                     rules={{ required: "Payment status is required" }}
//                                     render={({ field }) => (
//                                         <select
//                                             {...field}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         >
//                                             <option value="">Select Payment Status</option>
//                                             <option value="Paid">Paid</option>
//                                             <option value="Pending">Pending</option>
//                                         </select>
//                                     )}
//                                 />
//                                 {errors.payment_status && (
//                                     <p className="text-red-500 text-xs mt-1">{errors.payment_status.message}</p>
//                                 )}
//                             </div>

//                             {/* Payment Method */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Payment Method
//                                 </label>
//                                 <Controller
//                                     name="payment_method"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <select
//                                             {...field}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         >
//                                             <option value="">Select Payment Method</option>
//                                             <option value="Cash">Cash</option>
//                                             <option value="Phonepay">Phonepay</option>
//                                         </select>
//                                     )}
//                                 />
//                             </div>

//                             {/* Citizenship */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Citizenship
//                                 </label>
//                                 <Controller
//                                     name="citizenship"
//                                     control={control}
//                                     render={({ field }) => (
//                                         <select
//                                             {...field}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                             disabled={submitting}
//                                         >
//                                             <option value="">Select Citizenship</option>
//                                             <option value="Yes">Yes</option>
//                                             <option value="No">No</option>
//                                         </select>
//                                     )}
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                             <button
//                                 type="button"
//                                 onClick={handleCancel}
//                                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                                 disabled={submitting}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 disabled={submitting}
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
//                             >
//                                 {submitting ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                         Updating...
//                                     </>
//                                 ) : (
//                                     'Update Details'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditFixedJobForm;



import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';
import { X } from 'lucide-react';

const EditFixedJobForm = ({ visitor, onClose, onUpdate }) => {
    const [submitting, setSubmitting] = useState(false);
    const [nameOptions, setNameOptions] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState({
        names: false,
        companies: false
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            date: '',
            name: '',
            customer_number: '',
            companyname: '',
            salary: '',
            income_type: '',
            percent: '',
            income: '',
            status: 'Confirm',
            payment_status: '',
            payment_method: '',
            citizenship: '',
        }
    });

    const watchedIncomeType = watch("income_type");
    const watchedSalary = watch("salary");
    const watchedPercent = watch("percent");

    // Initialize form data when visitor changes
    useEffect(() => {
        if (visitor) {
            reset({
                date: visitor.date ? visitor.date.split('T')[0] : '',
                name: visitor.name || '',
                customer_number: visitor.customer_number || '',
                companyname: visitor.companyname || '',
                salary: visitor.salary || '',
                income_type: visitor.income_type || '',
                percent: visitor.percent || '',
                income: visitor.income || '',
                status: visitor.status || 'Confirm',
                payment_status: visitor.payment_status || '',
                payment_method: visitor.payment_method || '',
                citizenship: visitor.citizenship || '',
            });
        }
    }, [visitor, reset]);

    // Fetch options from APIs
    useEffect(() => {
        fetchNameOptions();
        fetchCompanyOptions();
    }, []);

    // Calculate income when salary, percent, or income_type changes
    useEffect(() => {
        if (watchedIncomeType === 'percentage' && watchedSalary && watchedPercent) {
            const calculatedIncome = (parseFloat(watchedSalary) * parseFloat(watchedPercent) / 100).toFixed(2);
            setValue("income", calculatedIncome, { shouldValidate: true });
        }
    }, [watchedIncomeType, watchedSalary, watchedPercent, setValue]);

    // Fetch customer names
    const fetchNameOptions = async () => {
        try {
            setLoadingOptions(prev => ({ ...prev, names: true }));
            const response = await axios.get(route("ourcustomername.indexname"));
            const formattedOptions = (response.data.data || response.data).map(customer => ({
                value: customer.name,
                label: customer.name,
                customerId: customer.id
            }));
            setNameOptions(formattedOptions);
        } catch (error) {
            console.error("Error fetching customer names:", error);
            setNameOptions([]);
        } finally {
            setLoadingOptions(prev => ({ ...prev, names: false }));
        }
    };

    // Fetch company names (from employers)
    const fetchCompanyOptions = async () => {
        try {
            setLoadingOptions(prev => ({ ...prev, companies: true }));
            const response = await axios.get(route("ouremployersdetails.employeeindex"));
            const employers = response.data.data || [];
            
            // Extract company names
            const companyOptionsSet = new Set();
            employers.forEach(employer => {
                if (employer.name) companyOptionsSet.add(employer.name);
            });
            
            // Format company options
            const companyFormatted = Array.from(companyOptionsSet).map(company => ({
                value: company,
                label: company
            }));
            setCompanyOptions(companyFormatted);
            
        } catch (error) {
            console.error("Error fetching employers:", error);
            setCompanyOptions([]);
        } finally {
            setLoadingOptions(prev => ({ ...prev, companies: false }));
        }
    };

    // Handle form submission
    const onSubmit = async (data) => {
        // Basic validation
        if (!data.name || !data.customer_number || !data.companyname) {
            alert("Please fill in all required fields");
            return;
        }

        setSubmitting(true);
        try {
            await onUpdate(data);
            // The parent component will handle closing and reloading
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update details');
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
            minHeight: '42px',
            borderColor: state.isFocused ? '#6366f1' : errors[state.name] ? '#ef4444' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#6366f1' : '#9ca3af'
            }
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            position: 'absolute',
            marginTop: '4px'
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: '200px',
            overflow: 'auto'
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#eef2ff' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            '&:active': {
                backgroundColor: '#4f46e5'
            }
        }),
        menuPortal: base => ({ ...base, zIndex: 9999 })
    };

    const isPercentageType = watchedIncomeType === 'percentage';
    const isManualType = watchedIncomeType === 'manual';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 100 }}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Edit Confirmed Visitor Details
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Date */}
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
                                    <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                                )}
                            </div>

                            {/* Name - React Select */}
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
                                            value={nameOptions.find(option => option.value === field.value) || null}
                                            onChange={(selected) => field.onChange(selected?.value || "")}
                                            placeholder="Select or type to search..."
                                            isSearchable
                                            isLoading={loadingOptions.names}
                                            loadingMessage={() => "Loading names..."}
                                            noOptionsMessage={() => "No names found"}
                                            styles={selectStyles}
                                            isDisabled={submitting}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                    )}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Number<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="customer_number"
                                    control={control}
                                    rules={{ 
                                        required: "Contact number is required",
                                        pattern: {
                                            value: /^[0-9\s\-+()]+$/,
                                            message: "Please enter a valid contact number"
                                        }
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
                                    <p className="text-red-500 text-xs mt-1">{errors.customer_number.message}</p>
                                )}
                            </div>

                            {/* Company Name - React Select */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="companyname"
                                    control={control}
                                    rules={{ required: "Company name is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={companyOptions}
                                            value={companyOptions.find(option => option.value === field.value) || null}
                                            onChange={(selected) => field.onChange(selected?.value || "")}
                                            placeholder="Select or type to search..."
                                            isSearchable
                                            isLoading={loadingOptions.companies}
                                            loadingMessage={() => "Loading companies..."}
                                            noOptionsMessage={() => "No companies found"}
                                            styles={selectStyles}
                                            isDisabled={submitting}
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                        />
                                    )}
                                />
                                {errors.companyname && (
                                    <p className="text-red-500 text-xs mt-1">{errors.companyname.message}</p>
                                )}
                            </div>

                            {/* Status */}
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
                                            <option value="Training">Training</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    )}
                                />
                                {errors.status && (
                                    <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                                )}
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salary<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="salary"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={submitting}
                                        />
                                    )}
                                />
                            </div>

                            {/* Income Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Income Type<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="income_type"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={submitting}
                                        >
                                            <option value="">Select Income Type</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="manual">Manual</option>
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Percent - Only show when income_type is Percentage */}
                            {isPercentageType && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Percent (%)<span className="text-red-500">*</span>
                                    </label>
                                    <Controller
                                        name="percent"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                disabled={submitting}
                                            />
                                        )}
                                    />
                                </div>
                            )}

                            {/* Income - Different behavior based on income_type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Income {isPercentageType ? "(Calculated)" : ""}<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="income"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            step="0.01"
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                                                isPercentageType ? 'bg-gray-50' : 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                                            }`}
                                            disabled={submitting || isPercentageType}
                                            readOnly={isPercentageType}
                                        />
                                    )}
                                />
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Status<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="payment_status"
                                    control={control}
                                    rules={{ required: "Payment status is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={submitting}
                                        >
                                            <option value="">Select Payment Status</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Unpaid">Unpaid</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                    )}
                                />
                                {errors.payment_status && (
                                    <p className="text-red-500 text-xs mt-1">{errors.payment_status.message}</p>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="payment_method"
                                    control={control}
                                    rules={{ required: "Payment method is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={submitting}
                                        >
                                            <option value="">Select Payment Method</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Phonepay">Phonepay</option>
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Citizenship */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Citizenship<span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="citizenship"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            disabled={submitting}
                                        >
                                            <option value="">Select Citizenship</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    )}
                                />
                            </div>
                        </div>

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

export default EditFixedJobForm;