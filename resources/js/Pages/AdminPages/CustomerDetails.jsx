import React, { useState, useEffect, useMemo, useContext } from "react";
import { Edit2, Trash2, Plus, Edit, Eye, X, Search } from "lucide-react";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import AddCustomerForm from "@/AddFormComponents/AddCustomerForm";
import MyTable from "./MyTable";
import { MainContextData } from "@/Context/MainContext";
import { Head } from "@inertiajs/react";

const CustomerDetails = () => {
    const [allCustomers, setAllCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    // const [reloadCustomerTrigger, setReloadCustomerTrigger] = useState(false);
    // const [editingCustomer, setEditingCustomer] = useState(null);
    // const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const {
        showForm,
        setShowForm,
        editingCustomer,
        setEditingCustomer,
        setReloadCustomerTrigger,
        reloadCustomerTrigger,
        handleAddNew,
    } = useContext(MainContextData);

    // Add this effect after your other useEffect hooks
    useEffect(() => {
        if (showDetailsPopup) {
            // Prevent scrolling on mount
            document.body.style.overflow = "hidden";
        } else {
            // Re-enable scrolling on unmount
            document.body.style.overflow = "unset";
        }

        // Cleanup function to ensure scroll is re-enabled when component unmounts
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showDetailsPopup]);

    // For fetching the customer data
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourcustomers.index"));
                const customers = response.data.data || response.data || [];
                setAllCustomers(customers);
                setFilteredCustomers(customers);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [reloadCustomerTrigger]);

    // Search functionality
    useEffect(() => {
        const searchCustomers = () => {
            if (!searchQuery.trim()) {
                setFilteredCustomers(allCustomers);
                return;
            }

            setSearchLoading(true);

            const query = searchQuery.toLowerCase().trim();
            const filtered = allCustomers.filter((customer) => {
                const name = customer.name?.toLowerCase() || "";
                const experience = customer.experience?.toLowerCase() || "";
                const permanentAddress =
                    customer.permanent_address?.toLowerCase() || "";
                const temporaryAddress =
                    customer.temporary_address?.toLowerCase() || "";
                const referenceBy = customer.reference_by?.toLowerCase() || "";

                return (
                    name.includes(query) ||
                    experience.includes(query) ||
                    permanentAddress.includes(query) ||
                    temporaryAddress.includes(query) ||
                    referenceBy.includes(query)
                );
            });

            setFilteredCustomers(filtered);
            setSearchLoading(false);
        };

        // Debounce search to prevent excessive filtering
        const timer = setTimeout(() => {
            searchCustomers();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, allCustomers]);

    // For delete the Customer
    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            try {
                await axios.delete(route("ourcustomers.destroy", { id: id }));
                setReloadCustomerTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
                alert("Failed to delete customer");
            }
        }
    };

    // handleedit
    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };

    const handleViewDetails = (customer) => {
        setSelectedCustomer(customer);
        setShowDetailsPopup(true);
    };

    // const handleAddNew = () => {
    //     setEditingCustomer(null);
    //     setShowForm(true);
    // };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingCustomer(null);
    };

    const handleDetailsClose = () => {
        setShowDetailsPopup(false);
        setSelectedCustomer(null);
    };

    const handleSuccess = () => {
        setReloadCustomerTrigger((prev) => !prev);
        handleFormClose();
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
    };
    console.log(showForm);
    console.log(editingCustomer);
    console.log(reloadCustomerTrigger);
    console.log(handleAddNew);

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Image",
                accessor: "avatar",
                Cell: ({ row }) => (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {row.original.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </div>
                ),
                width: 80,
                disableSortBy: true,
            },
            {
                Header: "Customer Name",
                accessor: "name",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-800">{value}</span>
                ),
            },
            {
                Header: "Contact Number",
                accessor: "contact_number",
                Cell: ({ value }) => (
                    <a
                        href={`tel:${value}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {value}
                    </a>
                ),
            },
            {
                Header: "Experience",
                accessor: "experience",
                Cell: ({ value }) => (
                    <span className="text-gray-700">{value}</span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleViewDetails(row.original)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
                width: 120,
                disableSortBy: true,
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Customer Details" />
            <div className="py-4 ">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Customer Details
                        </h1>
                    </div>

                    {/* Add New Button */}
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        <span>Create</span>
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
                            placeholder="Search by name, experience, address, or reference..."
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                            Showing {filteredCustomers.length} of {allCustomers.length} customers
                        </span>
                        {searchQuery && (
                            <span className="flex items-center gap-1">
                                <Search size={14} />
                                Searching for: "{searchQuery}"
                            </span>
                        )}
                        {searchLoading && (
                            <span className="text-blue-600 flex items-center gap-1">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                Searching...
                            </span>
                        )}
                    </div> */}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">
                            Loading customers...
                        </p>
                    </div>
                )}

                {/* Table View */}
                {!loading && filteredCustomers.length > 0 && (
                    <div className="mt-6">
                        <div className="bg-white rounded-xl shadow-sm boverflow-hidden">
                            <MyTable
                                columns={columns}
                                data={filteredCustomers}
                            />
                        </div>
                    </div>
                )}

                {/* No Search Results State */}
                {!loading && searchQuery && filteredCustomers.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <Search
                            size={48}
                            className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-gray-400 text-lg mb-2">
                            No customers found for "{searchQuery}"
                        </p>
                        <p className="text-gray-500 mb-4">
                            Try searching with different keywords
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleClearSearch}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear search
                            </button>
                            {/* <span className="text-gray-300">|</span>
                            <button
                                onClick={handleAddNew}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Add new customer
                            </button> */}
                        </div>
                    </div>
                )}

                {/* Empty State (when no data at all) */}
                {!loading && !searchQuery && allCustomers.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-400 text-lg">
                            No customers added yet
                        </p>
                        <button
                            onClick={handleAddNew}
                            className="mt-4 flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-colors font-medium"
                        >
                            <Plus size={20} />
                            Add Your First Customer
                        </button>
                    </div>
                )}

                {/* Popup Form Overlay */}
                {showForm && (
                    <AddCustomerForm
                        editingCustomer={editingCustomer}
                        onClose={handleFormClose}
                        onSuccess={handleSuccess}
                    />
                )}

                {/* Details Popup Overlay - Card Style */}
                {showDetailsPopup && selectedCustomer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
                            {/* Header with X icon on right */}
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {selectedCustomer.name}
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
                                            Permanent Address :
                                        </span>{" "}
                                        {selectedCustomer.permanent_address ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Temporary Address :
                                        </span>{" "}
                                        {selectedCustomer.temporary_address ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Contact Number :
                                        </span>{" "}
                                        {selectedCustomer.contact_number ? (
                                            <a
                                                href={`tel:${selectedCustomer.contact_number}`}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                {
                                                    selectedCustomer.contact_number
                                                }
                                            </a>
                                        ) : (
                                            "N/A"
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Experience :
                                        </span>{" "}
                                        {selectedCustomer.experience || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Interested In :
                                        </span>{" "}
                                        {selectedCustomer.interested_in ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">
                                            Reference by :
                                        </span>{" "}
                                        {selectedCustomer.reference_by || "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Optional footer if needed */}
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
            </div>
        </AdminWrapper>
    );
};

export default CustomerDetails;
