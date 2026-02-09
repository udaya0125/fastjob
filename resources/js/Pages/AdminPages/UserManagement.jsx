import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import MyTable from "./MyTable";

const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // For fetching the user data
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourusers.index"));
                setAllUser(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
                alert("Error loading users");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // For delete the user
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const response = await axios.delete(
                route("ourusers.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
            alert("Error deleting user");
        }
    };

    // Handle Edit - Open modal with user data
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowFormModal(true);
    };

    // Handle Update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourusers.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            return response.data;
        } catch (error) {
            console.log("Error updating user", error);
            throw error;
        }
    };

    // Handle successful form submission
    const handleFormSuccess = () => {
        setShowFormModal(false);
        setEditingUser(null);
        setReloadTrigger((prev) => !prev);
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "Image",
                accessor: "image",
                Cell: ({ row }) => (
                    <div className="flex justify-center">
                        <img
                            src={
                                row.original.image
                                    ? `/storage/${row.original.image}`
                                    : "/images/placeholder.png"
                            }
                            alt={row.original.name || "User"}
                            className="w-10 h-10 rounded-full object-cover border"
                            onError={(e) => {
                                e.target.src = "/images/placeholder.png";
                            }}
                        />
                    </div>
                ),
                disableSortBy: true,
            },

            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Role",
                accessor: "roles",
                Cell: ({ value }) => value || "N/A",
            },
            {
                Header: "Actions",
                accessor: "id",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                ),
                disableSortBy: true,
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setShowFormModal(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                         Create
                    </button>
                </div>

                {/* Users Table */}
                <div className="mt-8">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading users...</p>
                        </div>
                    ) : allUser.length > 0 ? (
                        <MyTable columns={columns} data={allUser} />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No users found
                        </div>
                    )}
                </div>

                {/* Modal Popup */}
                {showFormModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={() => {
                                setShowFormModal(false);
                                setEditingUser(null);
                            }}
                        />

                        {/* Modal Content */}
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
                                <AddUserForm
                                    editingUser={editingUser}
                                    setEditingUser={setEditingUser}
                                    handleUpdate={handleUpdate}
                                    onSuccess={handleFormSuccess}
                                    onCancel={() => {
                                        setShowFormModal(false);
                                        setEditingUser(null);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default UserManagement;