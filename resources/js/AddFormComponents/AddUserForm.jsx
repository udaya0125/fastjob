// import React, { useState, useEffect } from "react";
// import { X, Eye, EyeOff, UserPlus, UserCog } from "lucide-react";
// import { useForm } from "react-hook-form";

// const AddUserForm = ({
//     editingUser,
//     handleUpdate,
//     handleAddUser,
//     setReloadTrigger,
//     setEditingUser,
//     setShowAddModal,
//     setShowEditModal,
//     submitting,
//     setSubmitting,
//     closeModal,
// }) => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setError,
//         watch,
//         reset,
//         setValue,
//     } = useForm({
//         defaultValues: {
//             name: "",
//             email: "",
//             roles: "user",
//             password: "",
//             password_confirmation: "",
//             image: null,
//         },
//     });

//     // Watch password value for validation
//     const password = watch("password");

//     // Initialize form when editingUser changes
//     useEffect(() => {
//         if (editingUser) {
//             setValue("name", editingUser.name || "");
//             setValue("email", editingUser.email || "");
//             setValue("roles", editingUser.roles || "user");
//             setValue("password", "");
//             setValue("password_confirmation", "");
//             setValue("image", null);

//             if (editingUser.image) {
//                 setImagePreview(`/storage/${editingUser.image}`);
//             } else {
//                 setImagePreview(null);
//             }
//             setSelectedImage(null);
//         } else {
//             reset({
//                 name: "",
//                 email: "",
//                 roles: "user",
//                 password: "",
//                 password_confirmation: "",
//                 image: null,
//             });
//             setImagePreview(null);
//             setSelectedImage(null);
//         }
//     }, [editingUser, setValue, reset]);

//     // Clean up object URLs to prevent memory leaks
//     useEffect(() => {
//         return () => {
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);

//     // Handle Submit - FIXED
//     const onSubmit = async (data) => {
//         // Validate required fields
//         if (!data.name.trim()) {
//             alert("Name is required");
//             return;
//         }

//         if (!data.email.trim()) {
//             alert("Email is required");
//             return;
//         }

//         // Email validation
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(data.email)) {
//             alert("Please enter a valid email address");
//             return;
//         }

//         // For new users, password is required
//         if (!editingUser && !data.password) {
//             alert("Password is required for new users");
//             return;
//         }

//         // Password validation for new users
//         if (!editingUser && data.password && data.password.length < 6) {
//             alert("Password must be at least 6 characters");
//             return;
//         }

//         // For existing users, if password is provided, it must be confirmed
//         if (editingUser && data.password && !data.password_confirmation) {
//             alert("Please confirm your password");
//             return;
//         }

//         // Password confirmation validation
//         if (data.password && data.password !== data.password_confirmation) {
//             alert("Passwords do not match");
//             return;
//         }

//         const formData = new FormData();

//         // Append all form data
//         formData.append("name", data.name.trim());
//         formData.append("email", data.email.trim());
//         formData.append("roles", data.roles);

//         // Only append password if it's provided
//         if (data.password && data.password.trim() !== "") {
//             formData.append("password", data.password);
//             formData.append(
//                 "password_confirmation",
//                 data.password_confirmation || data.password,
//             );
//         }

//         // Only append image if a new one is selected
//         if (selectedImage instanceof File) {
//             formData.append("image", selectedImage);
//         }

//         // IMPORTANT: For Laravel route model binding with 'ouruser' parameter
//         // Append the ID for update if we're editing
//         if (editingUser) {
//             formData.append("id", editingUser.id);
//         }

//         try {
//             setSubmitting(true);

//             if (editingUser) {
//                 // Editing existing user - pass formData and user ID
//                 await handleUpdate(formData, editingUser.id);
//             } else {
//                 // Creating new user
//                 await handleAddUser(formData);
//             }

//             // Clean up image preview URL
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }

//             // Close modal on success
//             closeModal();
//         } catch (error) {
//             // Error handling is done in handleUpdate/handleAddUser
//             console.error("Form submission error:", error);
//             setSubmitting(false);
//         }
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Clean up previous object URL if it exists
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }

//             setSelectedImage(file);
//             const previewUrl = URL.createObjectURL(file);
//             setImagePreview(previewUrl);
//         }
//     };

//     const isEditMode = Boolean(editingUser);

//     return (
//         <div className="fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40">
//             <div className="relative w-full max-w-2xl rounded-xl shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 text-gray-800">
//                     <div className="flex justify-between items-center mb-6">
//                         <div className="flex items-center space-x-3">
//                             <h2 className="text-2xl font-bold">
//                                 {isEditMode ? "Edit User" : "Add New User"}
//                             </h2>
//                         </div>
//                         <button
//                             onClick={closeModal}
//                             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                             type="button"
//                             disabled={submitting}
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     <form
//                         onSubmit={handleSubmit(onSubmit)}
//                         className="space-y-6"
//                     >
//                         {/* Profile Image Upload */}
//                         <div className="flex flex-col items-center">
//                             <div className="relative mb-4">
//                                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                                     <img
//                                         src={
//                                             imagePreview ||
//                                             (editingUser?.image
//                                                 ? `/storage/${editingUser.image}`
//                                                 : "/images/placeholder.png")
//                                         }
//                                         alt="Profile"
//                                         className="w-full h-full object-cover"
                                        
//                                     />
//                                 </div>
//                                 <label
//                                     htmlFor="image-upload"
//                                     className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors"
//                                 >
//                                     <svg
//                                         className="w-5 h-5"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth="2"
//                                             d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                                         />
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth="2"
//                                             d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                                         />
//                                     </svg>
//                                 </label>
//                                 <input
//                                     id="image-upload"
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                     disabled={submitting}
//                                 />
//                             </div>
//                             <p className="text-sm text-gray-500">
//                                 Click the camera icon to upload a profile
//                                 picture
//                             </p>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             {/* Name Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                         errors.name
//                                             ? "border-red-500"
//                                             : "border-gray-300"
//                                     }`}
//                                     {...register("name", {
//                                         required: "Name is required",
//                                         minLength: {
//                                             value: 2,
//                                             message:
//                                                 "Name must be at least 2 characters",
//                                         },
//                                     })}
//                                     disabled={submitting}
//                                 />
//                                 {errors.name && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.name.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Email Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Email *
//                                 </label>
//                                 <input
//                                     type="email"
//                                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                         errors.email
//                                             ? "border-red-500"
//                                             : "border-gray-300"
//                                     }`}
//                                     {...register("email", {
//                                         required: "Email is required",
//                                         pattern: {
//                                             value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                                             message: "Invalid email address",
//                                         },
//                                     })}
//                                     disabled={submitting}
//                                 />
//                                 {errors.email && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.email.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Role Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Role *
//                                 </label>
//                                 <select
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     {...register("roles", {
//                                         required: "Role is required",
//                                     })}
//                                     disabled={submitting}
//                                 >
//                                     <option value="User">User</option>
//                                     <option value="Admin">Admin</option>
//                                 </select>
//                                 {errors.roles && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.roles.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Password Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     {isEditMode
//                                         ? "New Password (Optional)"
//                                         : "Password *"}
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={
//                                             showPassword ? "text" : "password"
//                                         }
//                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                             errors.password
//                                                 ? "border-red-500"
//                                                 : "border-gray-300"
//                                         }`}
//                                         placeholder={
//                                             isEditMode
//                                                 ? "Leave empty to keep current"
//                                                 : "Enter password"
//                                         }
//                                         {...register("password", {
//                                             required:
//                                                 !isEditMode &&
//                                                 "Password is required",
//                                             minLength: {
//                                                 value: 6,
//                                                 message:
//                                                     "Password must be at least 6 characters",
//                                             },
//                                         })}
//                                         disabled={submitting}
//                                         autoComplete="new-password"
//                                     />
//                                     <button
//                                         type="button"
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                         onClick={() =>
//                                             setShowPassword(!showPassword)
//                                         }
//                                         disabled={submitting}
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5 text-gray-500" />
//                                         ) : (
//                                             <Eye className="h-5 w-5 text-gray-500" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.password && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.password.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Password Confirmation Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     {isEditMode
//                                         ? "Confirm New Password"
//                                         : "Confirm Password *"}
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={
//                                             showConfirmPassword
//                                                 ? "text"
//                                                 : "password"
//                                         }
//                                         className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                                             errors.password_confirmation
//                                                 ? "border-red-500"
//                                                 : "border-gray-300"
//                                         }`}
//                                         placeholder={
//                                             isEditMode
//                                                 ? "Leave empty to keep current"
//                                                 : "Confirm password"
//                                         }
//                                         {...register("password_confirmation", {
//                                             required:
//                                                 !isEditMode &&
//                                                 "Please confirm your password",
//                                             validate: (value) => {
//                                                 if (
//                                                     isEditMode &&
//                                                     !password &&
//                                                     !value
//                                                 )
//                                                     return true;
//                                                 return (
//                                                     value === password ||
//                                                     "Passwords do not match"
//                                                 );
//                                             },
//                                         })}
//                                         disabled={submitting}
//                                         autoComplete="new-password"
//                                     />
//                                     <button
//                                         type="button"
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                         onClick={() =>
//                                             setShowConfirmPassword(
//                                                 !showConfirmPassword,
//                                             )
//                                         }
//                                         disabled={submitting}
//                                     >
//                                         {showConfirmPassword ? (
//                                             <EyeOff className="h-5 w-5 text-gray-500" />
//                                         ) : (
//                                             <Eye className="h-5 w-5 text-gray-500" />
//                                         )}
//                                     </button>
//                                 </div>
//                                 {errors.password_confirmation && (
//                                     <p className="mt-1 text-sm text-red-600">
//                                         {errors.password_confirmation.message}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Form Actions */}
//                         <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                             <button
//                                 type="button"
//                                 onClick={closeModal}
//                                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={submitting}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                                 disabled={submitting}
//                             >
//                                 {submitting ? (
//                                     <span className="flex items-center">
//                                         <svg
//                                             className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <circle
//                                                 className="opacity-25"
//                                                 cx="12"
//                                                 cy="12"
//                                                 r="10"
//                                                 stroke="currentColor"
//                                                 strokeWidth="4"
//                                             />
//                                             <path
//                                                 className="opacity-75"
//                                                 fill="currentColor"
//                                                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                             />
//                                         </svg>
//                                         {isEditMode
//                                             ? "Updating..."
//                                             : "Creating..."}
//                                     </span>
//                                 ) : (
//                                     <span>
//                                         {isEditMode
//                                             ? "Update User"
//                                             : "Create User"}
//                                     </span>
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;


import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

const AddUserForm = ({
    handleAddUser,
    setShowAddModal,
    submitting,
    setSubmitting,
    closeModal,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            roles: "User",
            password: "",
            password_confirmation: "",
            image: null,
        },
    });

    // Watch password value for validation
    const password = watch("password");

    // Reset form when component mounts
    useEffect(() => {
        reset({
            name: "",
            email: "",
            roles: "User",
            password: "",
            password_confirmation: "",
            image: null,
        });
        setImagePreview(null);
        setSelectedImage(null);
    }, [reset]);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle Submit - Add User Only
    const onSubmit = async (data) => {
        // Validate required fields
        if (!data.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!data.email.trim()) {
            alert("Email is required");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Password is required for new users
        if (!data.password) {
            alert("Password is required");
            return;
        }

        // Password validation
        if (data.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        // Password confirmation validation
        if (data.password !== data.password_confirmation) {
            alert("Passwords do not match");
            return;
        }

        const formData = new FormData();

        // Append all form data
        formData.append("name", data.name.trim());
        formData.append("email", data.email.trim());
        formData.append("roles", data.roles);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        // Append image if selected
        if (selectedImage instanceof File) {
            formData.append("image", selectedImage);
        }

        try {
            setSubmitting(true);
            await handleAddUser(formData);

            // Clean up image preview URL
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }

            // Close modal on success
            closeModal();
        } catch (error) {
            console.error("Form submission error:", error);
            setSubmitting(false);
        }
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Clean up previous object URL if it exists
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }

            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    return (
        <div className="fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40">
            <div className="relative w-full max-w-2xl rounded-xl shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
                <div className="p-6 text-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <UserPlus className="w-6 h-6 text-blue-600" />
                            <h2 className="text-2xl font-bold">Add New User</h2>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            type="button"
                            disabled={submitting}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={
                                            imagePreview ||
                                            "/images/placeholder.png"
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label
                                    htmlFor="image-upload"
                                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={submitting}
                                />
                            </div>
                            <p className="text-sm text-gray-500">
                                Click the camera icon to upload a profile
                                picture
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "Name must be at least 2 characters",
                                        },
                                    })}
                                    disabled={submitting}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    disabled={submitting}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Role Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role *
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    {...register("roles", {
                                        required: "Role is required",
                                    })}
                                    disabled={submitting}
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                {errors.roles && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.roles.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message:
                                                    "Password must be at least 6 characters",
                                            },
                                        })}
                                        disabled={submitting}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        disabled={submitting}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Confirmation Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.password_confirmation
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Confirm password"
                                        {...register("password_confirmation", {
                                            required:
                                                "Please confirm your password",
                                            validate: (value) =>
                                                value === password ||
                                                "Passwords do not match",
                                        })}
                                        disabled={submitting}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        disabled={submitting}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-500" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.password_confirmation.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Creating...
                                    </span>
                                ) : (
                                    <span>Create User</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserForm;
