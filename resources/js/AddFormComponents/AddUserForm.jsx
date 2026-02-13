import React, { useState, useEffect } from "react";
import axios from 'axios';
import { X, Eye, EyeOff, Camera } from "lucide-react";

const AddUserForm = ({
    onSuccess,
    onCancel,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        image: null,
        roles: "User",
    });

    // Add this useEffect to lock body scroll when form mounts
useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
        document.body.style.overflow = 'unset';
        document.body.style.position = 'static';
        document.body.style.width = 'auto';
    };
}, []); // Empty dependency array means this runs once on mount

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle Create User
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourusers.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!userForm.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!userForm.email.trim()) {
            alert("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userForm.email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Password validation for new users
        if (!userForm.password) {
            alert("Password is required");
            return;
        }

        if (userForm.password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (userForm.password !== userForm.password_confirmation) {
            alert("Passwords do not match");
            return;
        }

        const formData = new FormData();
        
        // Append all form data
        for (const key in userForm) {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        }

        try {
            setSubmitting(true);

            await handleCreate(formData);
            alert('User created successfully!');
            
            // Call success callback
            if (onSuccess) {
                onSuccess();
            }
            
        } catch (error) {
            console.log("Error creating user", error);
            
            let errorMessage = 'Error creating user. Please check the form and try again.';
            
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 422) {
                    errorMessage = 'Validation error. Please check your input.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            }
            
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Clean up previous object URL if it exists
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }

            setUserForm((prev) => ({
                ...prev,
                image: file,
            }));
            
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Reset form
    const resetForm = () => {
        setUserForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            image: null,
            roles: "User",
        });
        setImagePreview(null);
    };

    // Handle cancel
    const handleCancel = () => {
        // Clean up image preview URL
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        
        resetForm();
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold">
                        Add New User
                    </h2>
                </div>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                    disabled={submitting}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-gray-400 text-center">
                                        <Camera className="w-12 h-12 mx-auto mb-2" />
                                        <span className="text-xs block">Add Photo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="image-upload"
                            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                        >
                            <Camera className="w-5 h-5" />
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={submitting}
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        Click the camera icon to upload a profile picture
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={submitting}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={submitting}
                            required
                        />
                    </div>

                    {/* Role Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="roles"
                            value={userForm.roles}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={submitting}
                            required
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userForm.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={submitting}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={submitting}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password Confirmation Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password<span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={userForm.password_confirmation}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={submitting}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={submitting}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
    );
};

export default AddUserForm;






// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import { X, Eye, EyeOff, UserPlus } from "lucide-react";

// const AddUserForm = ({
//     editingUser,
//     setEditingUser,
//     handleUpdate,
//     onSuccess,
//     onCancel,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [userForm, setUserForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//         password_confirmation: "",
//         image: null,
//         roles: "User",
//     });

//     // Use Effect for initial data
//     useEffect(() => {
//         if (editingUser) {
//             setUserForm({
//                 name: editingUser.name || "",
//                 email: editingUser.email || "",
//                 password: "",
//                 password_confirmation: "",
//                 image: null,
//                 roles: editingUser.roles || "User",
//             });
//             // Set image preview if editing user has an image
//             if (editingUser.image) {
//                 setImagePreview(`/storage/${editingUser.image}`);
//             } else {
//                 setImagePreview("/images/placeholder.png");
//             }
//         } else {
//             setUserForm({
//                 name: "",
//                 email: "",
//                 password: "",
//                 password_confirmation: "",
//                 image: null,
//                 roles: "User",
//             });
//             setImagePreview("/images/placeholder.png");
//         }
//     }, [editingUser]);

//     // Clean up object URLs to prevent memory leaks
//     useEffect(() => {
//         return () => {
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);

//     // Handle Create User
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourusers.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         } catch (error) {
//             console.log("Error creating user", error);
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validation
//         if (!userForm.name.trim()) {
//             alert("Name is required");
//             return;
//         }

//         if (!userForm.email.trim()) {
//             alert("Email is required");
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(userForm.email)) {
//             alert("Please enter a valid email address");
//             return;
//         }

//         // Password validation for new users
//         if (!editingUser) {
//             if (!userForm.password) {
//                 alert("Password is required");
//                 return;
//             }

//             if (userForm.password.length < 6) {
//                 alert("Password must be at least 6 characters");
//                 return;
//             }

//             if (userForm.password !== userForm.password_confirmation) {
//                 alert("Passwords do not match");
//                 return;
//             }
//         }

//         const formData = new FormData();
        
//         // Append all form data except image if it's empty
//         for (const key in userForm) {
//             if (key === 'image') {
//                 // Only append image if a new file was selected
//                 if (userForm[key] instanceof File) {
//                     formData.append(key, userForm[key]);
//                 }
//             } else if (userForm[key] !== null && userForm[key] !== "") {
//                 formData.append(key, userForm[key]);
//             }
//         }

//         // For edit mode, don't send password if empty
//         if (editingUser && !userForm.password) {
//             formData.delete('password');
//             formData.delete('password_confirmation');
//         }

//         try {
//             setSubmitting(true);

//             if (editingUser) {
//                 // Editing existing user
//                 await handleUpdate(formData, editingUser.id);
//                 alert('User updated successfully!');
//             } else {
//                 // Creating new user
//                 await handleCreate(formData);
//                 alert('User created successfully!');
//             }
            
//             // Call success callback - this will reload the table
//             if (onSuccess) {
//                 onSuccess();
//             }
            
//         } catch (error) {
//             console.log("Error saving data", error);
            
//             // Show more detailed error message
//             let errorMessage = 'Error saving user. Please check the form and try again.';
            
//             if (error.response) {
//                 if (error.response.data && error.response.data.message) {
//                     errorMessage = error.response.data.message;
//                 } else if (error.response.status === 422) {
//                     errorMessage = 'Validation error. Please check your input.';
//                 }
//             }
            
//             alert(errorMessage);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for text fields
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
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
//             setUserForm((prev) => ({
//                 ...prev,
//                 image: file,
//             }));
            
//             const previewUrl = URL.createObjectURL(file);
//             setImagePreview(previewUrl);
//         }
//     };

//     // Handle cancel
//     const handleCancel = () => {
//         // Clean up image preview URL
//         if (imagePreview && imagePreview.startsWith("blob:")) {
//             URL.revokeObjectURL(imagePreview);
//         }
        
//         if (onCancel) {
//             onCancel();
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-50 px-4 md:px-6 flex items-center justify-center bg-black/40">
//             <div className="relative w-full max-w-2xl rounded-xl shadow-2xl bg-white max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 text-gray-800">
//                     <div className="flex justify-between items-center mb-6">
//                         <div className="flex items-center space-x-3">
//                             <h2 className="text-2xl font-bold">
//                                 {editingUser ? 'Edit User' : 'Add New User'}
//                             </h2>
//                         </div>
//                         <button
//                             onClick={handleCancel}
//                             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                             type="button"
//                             disabled={submitting}
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Profile Image Upload */}
//                         <div className="flex flex-col items-center">
//                             <div className="relative mb-4">
//                                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                                     <img
//                                         src={imagePreview || "/images/placeholder.png"}
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
//                                     name="image"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                     disabled={submitting}
//                                 />
//                             </div>
//                             <p className="text-sm text-gray-500">
//                                 Click the camera icon to upload a profile picture
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
//                                     name="name"
//                                     value={userForm.name}
//                                     onChange={handleChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Enter user name"
//                                     disabled={submitting}
//                                     required
//                                 />
//                             </div>

//                             {/* Email Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Email *
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={userForm.email}
//                                     onChange={handleChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Enter email address"
//                                     disabled={submitting}
//                                     required
//                                 />
//                             </div>

//                             {/* Role Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Role *
//                                 </label>
//                                 <select
//                                     name="roles"
//                                     value={userForm.roles}
//                                     onChange={handleChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     disabled={submitting}
//                                     required
//                                 >
//                                     <option value="User">User</option>
//                                     <option value="Admin">Admin</option>
//                                 </select>
//                             </div>

//                             {/* Password Field */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Password {!editingUser && "*"}
//                                     {editingUser && (
//                                         <span className="text-gray-500 text-xs ml-1">
//                                             (Leave blank to keep current password)
//                                         </span>
//                                     )}
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         value={userForm.password}
//                                         onChange={handleChange}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Enter password"
//                                         disabled={submitting}
//                                         required={!editingUser}
//                                         autoComplete="new-password"
//                                     />
//                                     <button
//                                         type="button"
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         disabled={submitting}
//                                     >
//                                         {showPassword ? (
//                                             <EyeOff className="h-5 w-5 text-gray-500" />
//                                         ) : (
//                                             <Eye className="h-5 w-5 text-gray-500" />
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Password Confirmation Field (only for new users) */}
//                             {!editingUser && (
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Confirm Password *
//                                     </label>
//                                     <div className="relative">
//                                         <input
//                                             type="password"
//                                             name="password_confirmation"
//                                             value={userForm.password_confirmation}
//                                             onChange={handleChange}
//                                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             placeholder="Confirm password"
//                                             disabled={submitting}
//                                             required
//                                             autoComplete="new-password"
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Form Actions */}
//                         <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                             <button
//                                 type="button"
//                                 onClick={handleCancel}
//                                 className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={submitting}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
//                                         {editingUser ? 'Updating...' : 'Creating...'}
//                                     </span>
//                                 ) : (
//                                     <span>{editingUser ? 'Update User' : 'Create User'}</span>
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