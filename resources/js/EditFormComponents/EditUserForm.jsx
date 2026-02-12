// import React, { useState, useEffect } from "react";
// import { X, Eye, EyeOff } from "lucide-react";

// const EditUserForm = ({
//     editingUser,
//     handleUpdate,
//     onSuccess,
//     onCancel,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [userForm, setUserForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//         password_confirmation: "",
//         image: null,
//         roles: "User",
//     });
//      const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     // Initialize form with user data
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
//                 setImagePreview(`${imgurl}/${editingUser.image}`);
//             } else {
//                 setImagePreview("/images/placeholder.png");
//             }
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

//         // Password validation only if password is provided
//         if (userForm.password && userForm.password.length < 6) {
//             alert("Password must be at least 6 characters");
//             return;
//         }

//         if (userForm.password && userForm.password !== userForm.password_confirmation) {
//             alert("Passwords do not match");
//             return;
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

//         // Don't send password fields if they're empty
//         if (!userForm.password) {
//             formData.delete('password');
//             formData.delete('password_confirmation');
//         }

//         try {
//             setSubmitting(true);

//             // Update existing user
//             await handleUpdate(formData, editingUser.id);
//             alert('User updated successfully!');

//             // Call success callback
//             if (onSuccess) {
//                 onSuccess();
//             }

//         } catch (error) {
//             console.log("Error updating user", error);

//             let errorMessage = 'Error updating user. Please check the form and try again.';

//             if (error.response) {
//                 if (error.response.data && error.response.data.message) {
//                     errorMessage = error.response.data.message;
//                 } else if (error.response.status === 422) {
//                     errorMessage = 'Validation error. Please check your input.';
//                 } else if (error.response.status === 500) {
//                     errorMessage = 'Server error. Please try again later.';
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

//     if (!editingUser) return null;

//     return (
//         <div className="p-6 text-gray-800">
//             <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center space-x-3">
//                     <h2 className="text-2xl font-bold">
//                         Edit User
//                     </h2>
//                 </div>
//                 <button
//                     onClick={handleCancel}
//                     className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     type="button"
//                     disabled={submitting}
//                 >
//                     <X className="w-6 h-6" />
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Profile Image Upload */}
//                 <div className="flex flex-col items-center">
//                     <div className="relative mb-4">
//                         <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
//                             <img
//                                 src={imagePreview || "/images/placeholder.png"}
//                                 alt="Profile"
//                                 className="w-full h-full object-cover"
//                             />
//                         </div>
//                         <label
//                             htmlFor="image-upload"
//                             className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors"
//                         >
//                             <svg
//                                 className="w-5 h-5"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                                 />
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                             </svg>
//                         </label>
//                         <input
//                             id="image-upload"
//                             type="file"
//                             name="image"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="hidden"
//                             disabled={submitting}
//                         />
//                     </div>
//                     <p className="text-sm text-gray-500">
//                         Click the camera icon to change profile picture
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Name Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={userForm.name}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Enter user name"
//                             disabled={submitting}
//                             required
//                         />
//                     </div>

//                     {/* Email Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email *
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={userForm.email}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Enter email address"
//                             disabled={submitting}
//                             required
//                         />
//                     </div>

//                     {/* Role Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Role *
//                         </label>
//                         <select
//                             name="roles"
//                             value={userForm.roles}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             disabled={submitting}
//                             required
//                         >
//                             <option value="User">User</option>
//                             <option value="Admin">Admin</option>
//                         </select>
//                     </div>

//                     {/* Password Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Password
//                             <span className="text-gray-500 text-xs ml-1">
//                                 (Leave blank to keep current password)
//                             </span>
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={userForm.password}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 placeholder="Enter new password"
//                                 disabled={submitting}
//                                 autoComplete="new-password"
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 disabled={submitting}
//                             >
//                                 {showPassword ? (
//                                     <EyeOff className="h-5 w-5 text-gray-500" />
//                                 ) : (
//                                     <Eye className="h-5 w-5 text-gray-500" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Password Confirmation Field (only if password is being changed) */}
//                     {userForm.password && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Confirm Password
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type="password"
//                                     name="password_confirmation"
//                                     value={userForm.password_confirmation}
//                                     onChange={handleChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Confirm new password"
//                                     disabled={submitting}
//                                     autoComplete="new-password"
//                                 />
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                     <button
//                         type="button"
//                         onClick={handleCancel}
//                         className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={submitting}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                         disabled={submitting}
//                     >
//                         {submitting ? (
//                             <span className="flex items-center">
//                                 <svg
//                                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                     />
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                     />
//                                 </svg>
//                                 Updating...
//                             </span>
//                         ) : (
//                             <span>Update User</span>
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditUserForm;

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditUserForm = ({ editingUser, handleUpdate, onSuccess, onCancel }) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        image: null,
        roles: "User",
    });
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // Initialize form with user data
    useEffect(() => {
        if (editingUser) {
            setUserForm({
                name: editingUser.name || "",
                email: editingUser.email || "",
                image: null,
                roles: editingUser.roles || "User",
            });

            // Set image preview if editing user has an image
            if (editingUser.image) {
                setImagePreview(`${imgurl}/${editingUser.image}`);
            } else {
                setImagePreview("/images/placeholder.png");
            }
        }
    }, [editingUser]);

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for required fields
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

        const formData = new FormData();

        // Append all form data
        formData.append("name", userForm.name);
        formData.append("email", userForm.email);
        formData.append("roles", userForm.roles);

        // Only append image if a new file was selected
        if (userForm.image instanceof File) {
            formData.append("image", userForm.image);
        }

        try {
            setSubmitting(true);

            // Update existing user
            await handleUpdate(formData, editingUser.id);
            alert("User updated successfully!");

            // Call success callback
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.log("Error updating user", error);

            let errorMessage =
                "Error updating user. Please check the form and try again.";

            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 422) {
                    errorMessage = "Validation error. Please check your input.";
                } else if (error.response.status === 500) {
                    errorMessage = "Server error. Please try again later.";
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

    // Handle cancel
    const handleCancel = () => {
        // Clean up image preview URL
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        if (onCancel) {
            onCancel();
        }
    };

    if (!editingUser) return null;

    return (
        <div className="p-6 text-gray-800">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold">Edit User</h2>
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
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                                src={imagePreview || "/images/placeholder.png"}
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
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={submitting}
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        Click the camera icon to change profile picture
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            disabled={true}
                            value={userForm.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter user name"
                            // disabled={submitting}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            disabled={true}
                            value={userForm.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter email address"
                            // disabled={submitting}
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
                                Updating...
                            </span>
                        ) : (
                            <span>Update User</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUserForm;
