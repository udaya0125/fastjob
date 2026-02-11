import React, { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import { Edit2, Trash2, Plus, Edit, Search, Eye, X } from "lucide-react";
import { MdDelete, MdEdit } from "react-icons/md";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import AddEmployerForm from "@/AddFormComponents/AddEmployerForm";
import MyTable from "./MyTable"; // Adjust the import path as needed
import { MainContextData } from '@/Context/MainContext';
import { Head } from "@inertiajs/react";

const EmployerDetails = () => {
    const [allEmployers, setAllEmployers] = useState([]);
    const [filteredEmployers, setFilteredEmployers] = useState([]);
    // const [reloadEmployerTrigger, setReloadEmployerTrigger] = useState(false);
    // const [editingEmployer, setEditingEmployer] = useState(null);
    // const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const {showAddForm,setShowAddForm, editingEmployer , setEditingEmployer ,reloadEmployerTrigger ,setReloadEmployerTrigger , handleAddNewEmployee}= useContext(MainContextData);

    // For fetching the employer data
    useEffect(() => {
        const fetchEmployer = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ouremployers.index"));
                setAllEmployers(response.data.data || []);
                setFilteredEmployers(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployer();
    }, [reloadEmployerTrigger]);

    // Search functionality
    useEffect(() => {
        const searchEmployers = () => {
            if (!searchQuery.trim()) {
                setFilteredEmployers(allEmployers);
                return;
            }

            setSearchLoading(true);

            const query = searchQuery.toLowerCase().trim();
            const filtered = allEmployers.filter((employer) => {
                const name = employer.name?.toLowerCase() || "";
                const post = employer.post?.toLowerCase() || "";
                const location = employer.location?.toLowerCase() || "";

                return (
                    name.includes(query) ||
                    post.includes(query) ||
                    location.includes(query)
                );
            });

            setFilteredEmployers(filtered);
            setSearchLoading(false);
        };

        // Debounce search to prevent excessive filtering
        const timer = setTimeout(() => {
            searchEmployers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, allEmployers]);

    // For delete the employer
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this employer?")) {
            return;
        }

        try {
            await axios.delete(route("ouremployers.destroy", { id: id }));
            setReloadEmployerTrigger((prev) => !prev);
        } catch (error) {
            console.log("Delete error:", error);
            alert("Failed to delete employer");
        }
    };

    // handle edit
    const handleEdit = (employer) => {
        setEditingEmployer(employer);
        setShowAddForm(true);
    };

    // Handle view details
    const handleViewDetails = (employer) => {
        setSelectedEmployer(employer);
        setShowDetailsPopup(true);
    };

    // Handle close details popup
    const handleDetailsClose = () => {
        setShowDetailsPopup(false);
        setSelectedEmployer(null);
    };

    // const handleAddNewEmployee = () => {
    //     setEditingEmployer(null);
    //     setShowAddForm(true);
    // };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ouremployers.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadEmployerTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating employer", error);
            throw error;
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Company",
                accessor: "name",
                Cell: ({ value }) => (
                    <div className="flex items-center">
                        <span className="font-medium">{value}</span>
                    </div>
                ),
            },
            {
                Header: "Position",
                accessor: "post",
            },
            {
                Header: "Location",
                accessor: "location",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        {/* View Details Button */}
                        <button
                            onClick={() => handleViewDetails(row.original)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="View details"
                        >
                            <Eye size={16} />
                        </button>

                        {/* Edit Button */}
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit this record"
                        >
                            <Edit size={16} />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete this record"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    // Prepare table data
    const tableData = useMemo(
        () =>
            filteredEmployers.map((employer) => ({
                ...employer,
                actions: null, // Actions will be handled in the Cell renderer
            })),
        [filteredEmployers],
    );

    return (
        <AdminWrapper>
            <Head title="Employer Details" />
            <div className="py-4 ">
                {/* Header with Add Button */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Employer Details
                        </h1>
                    </div>
                    <button
                        onClick={handleAddNewEmployee}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        Create
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by company, position, or location..."
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                title="Clear search"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Search Info */}
                    {/* <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>
                            Showing {filteredEmployers.length} of {allEmployers.length} employers
                        </span>
                        {searchQuery && (
                            <span className="flex items-center gap-1">
                                <Search size={14} />
                                Searching for: "{searchQuery}"
                            </span>
                        )}
                        {searchLoading && (
                            <span className="text-indigo-600 flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                Searching...
                            </span>
                        )}
                    </div> */}
                </div>

                {/* Add/Edit Form Modal */}
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

                {/* Details Popup Overlay - Card Style */}
                {showDetailsPopup && selectedEmployer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                            {/* Header with X icon on right */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedEmployer.name}
                                </h2>
                                <button
                                    onClick={handleDetailsClose}
                                    className="text-gray-500 hover:text-gray-700 transition-colors rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content - Simple text layout */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Post :
                                        </span>{" "}
                                        {selectedEmployer.post || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Location :
                                        </span>{" "}
                                        {selectedEmployer.location || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Salary :
                                        </span>{" "}
                                        {selectedEmployer.salary || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Time :
                                        </span>{" "}
                                        {selectedEmployer.time || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Contact Number :
                                        </span>{" "}
                                        {selectedEmployer.contact_number ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Experience :
                                        </span>{" "}
                                        {selectedEmployer.experience || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Footer with close button */}
                            <div className="p-4 border-t flex justify-end">
                                <button
                                    onClick={handleDetailsClose}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600">
                            Loading employers...
                        </p>
                    </div>
                )}

                {/* Table Component */}
                {!loading && filteredEmployers.length > 0 && (
                    <MyTable columns={columns} data={tableData} />
                )}

                {/* No Search Results State */}
                {!loading && searchQuery && filteredEmployers.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <Search
                            size={48}
                            className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-gray-400 text-lg mb-2">
                            No employers found for "{searchQuery}"
                        </p>
                        <p className="text-gray-500 mb-4">
                            Try searching with different keywords or check your
                            spelling
                        </p>
                        <button
                            onClick={handleClearSearch}
                            className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* Empty State (when no data at all) */}
                {!loading && !searchQuery && allEmployers.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-400 text-lg">
                            No employer records found
                        </p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition-colors mx-auto"
                        >
                            <Plus size={20} />
                            Add Your First Employer
                        </button>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default EmployerDetails;
