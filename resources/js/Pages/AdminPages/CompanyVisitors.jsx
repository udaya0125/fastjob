// import React, { useState, useEffect, useMemo } from 'react'
// import axios from 'axios'
// import MyTable from './MyTable'
// import AddCompanyVisitorForm from '@/AddFormComponents/AddCompanyVisitorForm';
// import AdminWrapper from '@/AdminWrapper/AdminWrapper';
// import { Edit, Search, Trash2, X } from 'lucide-react';

// const CompanyVisitors = () => {
//     const [allVisitor, setAllVisitor] = useState([]);
//     const [allCustomers, setAllCustomers] = useState([]);
//     const [allEmployers, setAllEmployers] = useState([]);
//     const [confirmedVisitors, setConfirmedVisitors] = useState([]);
//     const [otherVisitors, setOtherVisitors] = useState([]);
//     const [filteredOtherVisitors, setFilteredOtherVisitors] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingVisitor, setEditingVisitor] = useState(null);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [selectedConfirmedVisitor, setSelectedConfirmedVisitor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchLoading, setSearchLoading] = useState(false);

//     // For fetching the visitor data and separating confirmed visitors
//     useEffect(() => {
//         const fetchVisitor = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourvisitors.index"));
//                 setAllVisitor(response.data);

//                 // Separate confirmed visitors from others
//                 const confirmed = response.data.filter(visitor => visitor.status === 'Confirm');
//                 const others = response.data.filter(visitor => visitor.status !== 'Confirm');

//                 setConfirmedVisitors(confirmed);
//                 setOtherVisitors(others);
//                 setFilteredOtherVisitors(others);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchVisitor();
//         const fetchCustomers = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ourcustomername.indexname")
//                 );
//                 setAllCustomers(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching customers:", error);
//                 setAllCustomers([]);
//             }
//         };
//         fetchCustomers();
//          const fetchEmployers = async () => {
//             try {
//                 const response = await axios.get(
//                     route("ouremployersdetails.employeeindex")
//                 );
//                 setAllEmployers(response.data.data || []);
//             } catch (error) {
//                 console.error("Error fetching company:", error);
//                 setAllEmployers([]);
//             }
//         };
//         fetchEmployers();
//     }, [reloadTrigger]);

//     // console.log("All Customers:", allCustomers);
//     // console.log("All Employers:", allEmployers);
//     // console.log("All Visitors:", allVisitor);

//     // Search functionality for other visitors
//     useEffect(() => {
//         const searchVisitors = () => {
//             if (!searchQuery.trim()) {
//                 setFilteredOtherVisitors(otherVisitors);
//                 return;
//             }

//             setSearchLoading(true);

//             const query = searchQuery.toLowerCase().trim();
//             const filtered = otherVisitors.filter(visitor => {
//                 const name = visitor.name?.toLowerCase() || '';
//                 const companyName = visitor.companyname?.toLowerCase() || '';

//                 return (
//                     name.includes(query) ||
//                     companyName.includes(query)
//                 );
//             });

//             setFilteredOtherVisitors(filtered);
//             setSearchLoading(false);
//         };

//         // Debounce search to prevent excessive filtering
//         const timer = setTimeout(() => {
//             searchVisitors();
//         }, 300);

//         return () => clearTimeout(timer);
//     }, [searchQuery, otherVisitors]);

//     // For delete the visitor
//     const handleDelete = async (id) => {
//         if (!window.confirm('Are you sure you want to delete this visitor?')) return;

//         try {
//             const response = await axios.delete(
//                 route("ourvisitors.destroy", { id: id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//             if (selectedConfirmedVisitor?.id === id) {
//                 setSelectedConfirmedVisitor(null);
//             }
//         } catch (error) {
//             console.log(error);
//             alert('Failed to delete visitor');
//         }
//     };

//     // handleedit
//     const handleEdit = (visitor) => {
//         setEditingVisitor(visitor);
//         setShowAddForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourvisitors.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating visitor", error);
//             throw error;
//         }
//     };

//     // Handle view confirmed visitor details
//     const handleViewConfirmedDetails = (visitor) => {
//         setSelectedConfirmedVisitor(visitor);
//     };

//     // Close confirmed visitor details
//     const handleCloseConfirmedDetails = () => {
//         setSelectedConfirmedVisitor(null);
//     };

//     // Update confirmed visitor details
//     const handleUpdateConfirmedVisitor = async (updatedData) => {
//         try {
//             const formData = new FormData();
//             Object.keys(updatedData).forEach(key => {
//                 if (updatedData[key] !== null && updatedData[key] !== undefined) {
//                     formData.append(key, updatedData[key]);
//                 }
//             });

//             const response = await handleUpdate(formData, selectedConfirmedVisitor.id);
//             setSelectedConfirmedVisitor(response.data);
//             setReloadTrigger((prev) => !prev);
//             return response;
//         } catch (error) {
//             console.error("Error updating confirmed visitor", error);
//             throw error;
//         }
//     };

//     // Clear search
//     const handleClearSearch = () => {
//         setSearchQuery('');
//     };

//     // Define columns for main table (other visitors)
//     const columns = useMemo(() => [
//         {
//                 Header: "ID",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//         {
//             Header: 'Date',
//             accessor: 'date',
//             Cell: ({ value }) => {
//                 if (!value) return '-';
//                 const date = new Date(value);
//                 return date.toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric'
//                 });
//             }
//         },
//         {
//             Header: 'Name',
//             accessor: 'name',
//         },
//         {
//             Header: 'Contact',
//             accessor: 'customer_number',
//         },
//         {
//             Header: 'Company Name',
//             accessor: 'companyname',
//         },
//         {
//             Header: 'Position',
//             accessor: 'position',
//         },
//         {
//             Header: 'Status',
//             accessor: 'status',
//             Cell: ({ value }) => {
//                 const statusColors = {
//                     Pending: 'bg-yellow-100 text-yellow-800',
//                     Confirm: 'bg-green-100 text-green-800',
//                     Training: 'bg-blue-100 text-blue-800',
//                     Rejected: 'bg-red-100 text-red-800',
//                 };
//                 return (
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
//                         {value?.charAt(0).toUpperCase() + value?.slice(1)}
//                     </span>
//                 );
//             }
//         },
//         {
//             Header: 'Actions',
//             accessor: 'actions',
//             Cell: ({ row }) => (
//                 <div className="flex space-x-2">
//                     <button
//                         onClick={() => handleEdit(row.original)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="Edit"
//                     >
//                        <Edit size={18} />
//                     </button>
//                     <button
//                         onClick={() => handleDelete(row.original.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                          title="Delete"
//                     >
//                        <Trash2 size={18} />
//                     </button>
//                 </div>
//             ),
//         },
//     ], []);

//     return (
//         <AdminWrapper>
//             <div>
//                 <div className="flex justify-between items-center mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Company Visitors</h1>
//                         {/* <div className="text-sm text-gray-500">
//                             Total: {allVisitor.length} visitors • Confirmed: {confirmedVisitors.length} • Others: {otherVisitors.length}
//                         </div> */}
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingVisitor(null);
//                             setShowAddForm(true);
//                         }}
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//                     >
//                         Create
//                     </button>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="mb-6">
//                     <div className="relative max-w-md">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Search size={20} className="text-gray-400" />
//                         </div>
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Search by name or company name..."
//                             className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                         />
//                         {searchQuery && (
//                             <button
//                                 onClick={handleClearSearch}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                 title="Clear search"
//                             >
//                                 <X size={20} />
//                             </button>
//                         )}
//                     </div>

//                     {/* Search Info */}
//                     {/* <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
//                         <span>
//                             Showing {filteredOtherVisitors.length} of {otherVisitors.length} visitors
//                         </span>
//                         {searchQuery && (
//                             <span className="flex items-center gap-1">
//                                 <Search size={14} />
//                                 Searching for: "{searchQuery}"
//                             </span>
//                         )}
//                         {searchLoading && (
//                             <span className="text-blue-600 flex items-center gap-1">
//                                 <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
//                                 Searching...
//                             </span>
//                         )}
//                     </div> */}
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="text-center py-16">
//                         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                         <p className="mt-4 text-gray-600">
//                             Loading visitors...
//                         </p>
//                     </div>
//                 )}

//                 {/* Table View */}
//                 {!loading && filteredOtherVisitors.length > 0 && (
//                     <div>
//                         <MyTable
//                             columns={columns}
//                             data={filteredOtherVisitors}
//                             tableClassName="border-2 border-gray-200 rounded-lg overflow-hidden"
//                         />
//                     </div>
//                 )}

//                 {/* No Search Results State */}
//                 {!loading && searchQuery && filteredOtherVisitors.length === 0 && (
//                     <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                         <Search size={48} className="mx-auto text-gray-300 mb-4" />
//                         <p className="text-gray-400 text-lg mb-2">
//                             No visitors found for "{searchQuery}"
//                         </p>
//                         <p className="text-gray-500 mb-4">
//                             Try searching with different keywords
//                         </p>
//                         <div className="flex gap-3 justify-center">
//                             <button
//                                 onClick={handleClearSearch}
//                                 className="text-blue-600 hover:text-blue-700 font-medium"
//                             >
//                                 Clear search
//                             </button>
//                             <span className="text-gray-300">|</span>
//                             <button
//                                 onClick={() => {
//                                     setEditingVisitor(null);
//                                     setShowAddForm(true);
//                                 }}
//                                 className="text-blue-600 hover:text-blue-700 font-medium"
//                             >
//                                 Add new visitor
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Empty State (when no data at all) */}
//                 {!loading && !searchQuery && otherVisitors.length === 0 && (
//                     <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                         <p className="text-gray-400 text-lg">
//                             No visitors added yet
//                         </p>
//                         <button
//                             onClick={() => {
//                                 setEditingVisitor(null);
//                                 setShowAddForm(true);
//                             }}
//                             className="mt-4 flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
//                         >
//                             Add Your First Visitor
//                         </button>
//                     </div>
//                 )}

//                 {/* Add/Edit Form Modal */}
//                 {showAddForm && (

//                             <AddCompanyVisitorForm
//                                 editingVisitor={editingVisitor}
//                                 setEditingVisitor={setEditingVisitor}
//                                 setReloadTrigger={setReloadTrigger}
//                                 onClose={() => {
//                                     setShowAddForm(false);
//                                     setEditingVisitor(null);
//                                 }}
//                                 handleUpdate={handleUpdate}
//                             />

//                 )}
//             </div>
//         </AdminWrapper>
//     )
// }

// export default CompanyVisitors



import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import MyTable from "./MyTable";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import EditCompanyVisitorForm from "@/EditFormComponents/EditCompanyVisitorForm";
import AddCompanyVisitorForm from "@/AddFormComponents/AddCompanyVisitorForm";
import { Head } from "@inertiajs/react";

const CompanyVisitors = () => {
    const [allVisitor, setAllVisitor] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [allEmployers, setAllEmployers] = useState([]);
    const [confirmedVisitors, setConfirmedVisitors] = useState([]);
    const [otherVisitors, setOtherVisitors] = useState([]);
    const [filteredOtherVisitors, setFilteredOtherVisitors] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingVisitor, setEditingVisitor] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedConfirmedVisitor, setSelectedConfirmedVisitor] =
        useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    // For fetching the visitor data and separating confirmed visitors
    useEffect(() => {
        const fetchVisitor = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourvisitors.index"));
                setAllVisitor(response.data);

                // Separate confirmed visitors from others
                const confirmed = response.data.filter(
                    (visitor) => visitor.status === "Confirm",
                );
                const others = response.data.filter(
                    (visitor) => visitor.status !== "Confirm",
                );

                setConfirmedVisitors(confirmed);
                setOtherVisitors(others);
                setFilteredOtherVisitors(others);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVisitor();
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(
                    route("ourcustomername.indexname"),
                );
                setAllCustomers(response.data.data || []);
            } catch (error) {
                console.error("Error fetching customers:", error);
                setAllCustomers([]);
            }
        };
        fetchCustomers();
        const fetchEmployers = async () => {
            try {
                const response = await axios.get(
                    route("ouremployersdetails.employeeindex"),
                );
                setAllEmployers(response.data.data || []);
            } catch (error) {
                console.error("Error fetching company:", error);
                setAllEmployers([]);
            }
        };
        fetchEmployers();
    }, [reloadTrigger]);

    // console.log("All Customers:", allCustomers);
    // console.log("All Employers:", allEmployers);
    // console.log("All Visitors:", allVisitor);

    // Search functionality for other visitors
    useEffect(() => {
        const searchVisitors = () => {
            if (!searchQuery.trim()) {
                setFilteredOtherVisitors(otherVisitors);
                return;
            }

            setSearchLoading(true);

            const query = searchQuery.toLowerCase().trim();
            const filtered = otherVisitors.filter((visitor) => {
                const name = visitor.name?.toLowerCase() || "";
                const companyName = visitor.companyname?.toLowerCase() || "";

                return name.includes(query) || companyName.includes(query);
            });

            setFilteredOtherVisitors(filtered);
            setSearchLoading(false);
        };

        // Debounce search to prevent excessive filtering
        const timer = setTimeout(() => {
            searchVisitors();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, otherVisitors]);

    // For delete the visitor
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this visitor?"))
            return;

        try {
            const response = await axios.delete(
                route("ourvisitors.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
            if (selectedConfirmedVisitor?.id === id) {
                setSelectedConfirmedVisitor(null);
            }
        } catch (error) {
            console.log(error);
            alert("Failed to delete visitor");
        }
    };

    // handleedit
    const handleEdit = (visitor) => {
        setEditingVisitor(visitor);
        setShowEditForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourvisitors.update", { id }),
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
            console.log("Error updating visitor", error);
            throw error;
        }
    };

    // Handle view confirmed visitor details
    const handleViewConfirmedDetails = (visitor) => {
        setSelectedConfirmedVisitor(visitor);
    };

    // Close confirmed visitor details
    const handleCloseConfirmedDetails = () => {
        setSelectedConfirmedVisitor(null);
    };

    // Update confirmed visitor details
    const handleUpdateConfirmedVisitor = async (updatedData) => {
        try {
            const formData = new FormData();
            Object.keys(updatedData).forEach((key) => {
                if (
                    updatedData[key] !== null &&
                    updatedData[key] !== undefined
                ) {
                    formData.append(key, updatedData[key]);
                }
            });

            const response = await handleUpdate(
                formData,
                selectedConfirmedVisitor.id,
            );
            setSelectedConfirmedVisitor(response.data);
            setReloadTrigger((prev) => !prev);
            return response;
        } catch (error) {
            console.error("Error updating confirmed visitor", error);
            throw error;
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
    };

    // Define columns for main table (other visitors)
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Date",
                accessor: "date",
                Cell: ({ value }) => {
                    if (!value) return "-";
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                },
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Contact",
                accessor: "customer_number",
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
                Header: "Company Name",
                accessor: "companyname",
            },
            {
                Header: "Position",
                accessor: "position",
            },
            {
                Header: "Status",
                accessor: "status",
                Cell: ({ value }) => {
                    const statusColors = {
                        Pending: "bg-yellow-100 text-yellow-800",
                        Confirm: "bg-green-100 text-green-800",
                        Training: "bg-blue-100 text-blue-800",
                        Rejected: "bg-red-100 text-red-800",
                    };
                    return (
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value] || "bg-gray-100 text-gray-800"}`}
                        >
                            {value?.charAt(0).toUpperCase() + value?.slice(1)}
                        </span>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
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
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Company Visitors" />
            <div className="py-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Company Visitors
                        </h1>
                        {/* <div className="text-sm text-gray-500">
                            Total: {allVisitor.length} visitors • Confirmed: {confirmedVisitors.length} • Others: {otherVisitors.length}
                        </div> */}
                    </div>
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200"
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
                            placeholder="Search by name or company name..."
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                title="Clear search"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Search Info */}
                    {/* <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span>
                            Showing {filteredOtherVisitors.length} of {otherVisitors.length} visitors
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
                            Loading visitors...
                        </p>
                    </div>
                )}

                {/* Table View */}
                {!loading && filteredOtherVisitors.length > 0 && (
                    <div>
                        <MyTable
                            columns={columns}
                            data={filteredOtherVisitors}
                            tableClassName="border-2 border-gray-200 rounded-lg overflow-hidden"
                        />
                    </div>
                )}

                {/* No Search Results State */}
                {!loading &&
                    searchQuery &&
                    filteredOtherVisitors.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <Search
                                size={48}
                                className="mx-auto text-gray-300 mb-4"
                            />
                            <p className="text-gray-400 text-lg mb-2">
                                No visitors found for "{searchQuery}"
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
                                onClick={() => {
                                    setShowAddForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Add new visitor
                            </button> */}
                            </div>
                        </div>
                    )}

                {/* Empty State (when no data at all) */}
                {!loading && !searchQuery && otherVisitors.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-400 text-lg">
                            No visitors added yet
                        </p>
                        <button
                            onClick={() => {
                                setShowAddForm(true);
                            }}
                            className="mt-4 flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                        >
                            Add Your First Visitor
                        </button>
                    </div>
                )}

                {/* Add Form Modal */}
                {showAddForm && (
                    <AddCompanyVisitorForm
                        setReloadTrigger={setReloadTrigger}
                        onClose={() => {
                            setShowAddForm(false);
                        }}
                    />
                )}

                {/* Edit Form Modal */}
                {showEditForm && (
                    <EditCompanyVisitorForm
                        editingVisitor={editingVisitor}
                        setReloadTrigger={setReloadTrigger}
                        onClose={() => {
                            setShowEditForm(false);
                            setEditingVisitor(null);
                        }}
                        handleUpdate={handleUpdate}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default CompanyVisitors;
