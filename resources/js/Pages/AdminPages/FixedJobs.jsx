// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import MyTable from "./MyTable";
// import EditFixedJobForm from "@/EditFormComponents/EditFixedJobForm";
// import { Edit, Search, Trash2, X } from "lucide-react";

// const FixedJobs = () => {
//     const [confirmedVisitors, setConfirmedVisitors] = useState([]);
//     const [filteredVisitors, setFilteredVisitors] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingVisitor, setEditingVisitor] = useState(null);
//     const [showEditForm, setShowEditForm] = useState(false);
//     const [selectedConfirmedVisitor, setSelectedConfirmedVisitor] =
//         useState(null);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchLoading, setSearchLoading] = useState(false);

//     // For fetching the confirmed visitors data
//     useEffect(() => {
//         const fetchConfirmedVisitors = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourvisitors.index"));
//                 // Filter only confirmed visitors
//                 const confirmed = response.data.filter(
//                     (visitor) => visitor.status === "Confirm",
//                 );
//                 setConfirmedVisitors(confirmed);
//                 setFilteredVisitors(confirmed);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchConfirmedVisitors();
//     }, [reloadTrigger]);

//     // Search functionality
//     useEffect(() => {
//         const searchVisitors = () => {
//             if (!searchQuery.trim()) {
//                 setFilteredVisitors(confirmedVisitors);
//                 return;
//             }

//             setSearchLoading(true);

//             const query = searchQuery.toLowerCase().trim();
//             const filtered = confirmedVisitors.filter((visitor) => {
//                 const name = visitor.name?.toLowerCase() || "";
//                 const companyName = visitor.companyname?.toLowerCase() || "";
//                 const position = visitor.position?.toLowerCase() || "";
//                 const contact = visitor.customer_number?.toLowerCase() || "";

//                 return (
//                     name.includes(query) ||
//                     companyName.includes(query) ||
//                     position.includes(query) ||
//                     contact.includes(query)
//                 );
//             });

//             setFilteredVisitors(filtered);
//             setSearchLoading(false);
//         };

//         // Debounce search to prevent excessive filtering
//         const timer = setTimeout(() => {
//             searchVisitors();
//         }, 300);

//         return () => clearTimeout(timer);
//     }, [searchQuery, confirmedVisitors]);

//     // For delete the visitor
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this visitor?"))
//             return;

//         try {
//             const response = await axios.delete(
//                 route("ourvisitors.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//             if (selectedConfirmedVisitor?.id === id) {
//                 setSelectedConfirmedVisitor(null);
//             }
//         } catch (error) {
//             console.log(error);
//             alert("Failed to delete visitor");
//         }
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
//                 },
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
//             Object.keys(updatedData).forEach((key) => {
//                 if (
//                     updatedData[key] !== null &&
//                     updatedData[key] !== undefined
//                 ) {
//                     formData.append(key, updatedData[key]);
//                 }
//             });

//             const response = await handleUpdate(
//                 formData,
//                 selectedConfirmedVisitor.id,
//             );
//             setSelectedConfirmedVisitor(null); // Close the form
//             setReloadTrigger((prev) => !prev); // Trigger table reload
//             return response;
//         } catch (error) {
//             console.error("Error updating confirmed visitor", error);
//             throw error;
//         }
//     };

//     // Clear search
//     const handleClearSearch = () => {
//         setSearchQuery("");
//     };

//     // Define columns for confirmed visitors table
//     const confirmedColumns = useMemo(
//         () => [
//             {
//                 Header: "ID",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Date",
//                 accessor: "date",
//                 Cell: ({ value }) => {
//                     if (!value) return "-";
//                     const date = new Date(value);
//                     return date.toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                     });
//                 },
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//             },
//             {
//                 Header: "Contact",
//                 accessor: "customer_number",
//             },
//             {
//                 Header: "Company Name",
//                 accessor: "companyname",
//             },
//             {
//                 Header: "Position",
//                 accessor: "position",
//             },
//             {
//                 Header: "Payment Status",
//                 accessor: "payment_status",
//                 Cell: ({ value }) => {
//                     const paymentColors = {
//                         Paid: "bg-green-100 text-green-800",
//                         Unpaid: "bg-red-100 text-red-800",
//                         Pending: "bg-blue-100 text-blue-800",
//                     };
//                     return (
//                         <div className="flex justify-center">
//                             <span
//                                 className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                     paymentColors[value]
//                                 }`}
//                             >
//                                 {value || "-"}
//                             </span>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex space-x-2">
//                         <button
//                             onClick={() =>
//                                 handleViewConfirmedDetails(row.original)
//                             }
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                             title="Edit"
//                         >
//                             <Edit size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Delete"
//                         >
//                             <Trash2 size={18} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <>
//             <AdminWrapper>
//                 <div>
//                     <div className="flex justify-between items-center mb-6">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-800">
//                                 Fixed Jobs - Confirmed Visitors
//                             </h1>
//                             {/* <div className="text-sm text-gray-500">
//                                 Total: {confirmedVisitors.length} confirmed visitors
//                             </div> */}
//                         </div>
//                     </div>

//                     {/* Search Bar */}
//                     <div className="mb-6">
//                         <div className="relative max-w-md">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Search size={20} className="text-gray-400" />
//                             </div>
//                             <input
//                                 type="text"
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 placeholder="Search by name, company name, position, or contact..."
//                                 className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                             />
//                             {searchQuery && (
//                                 <button
//                                     onClick={handleClearSearch}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                     title="Clear search"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             )}
//                         </div>

//                         {/* Search Info */}
//                         {/* <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
//                             <span>
//                                 Showing {filteredVisitors.length} of {confirmedVisitors.length} visitors
//                             </span>
//                             {searchQuery && (
//                                 <span className="flex items-center gap-1">
//                                     <Search size={14} />
//                                     Searching for: "{searchQuery}"
//                                 </span>
//                             )}
//                             {searchLoading && (
//                                 <span className="text-blue-600 flex items-center gap-1">
//                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
//                                     Searching...
//                                 </span>
//                             )}
//                         </div> */}
//                     </div>

//                     {/* Loading State */}
//                     {loading && (
//                         <div className="text-center py-16">
//                             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                             <p className="mt-4 text-gray-600">
//                                 Loading confirmed visitors...
//                             </p>
//                         </div>
//                     )}

//                     {/* Table View */}
//                     {!loading && filteredVisitors.length > 0 && (
//                         <div className="mb-8">
//                             <MyTable
//                                 columns={confirmedColumns}
//                                 data={filteredVisitors}
//                                 tableClassName="border-2 border-green-200 rounded-lg overflow-hidden"
//                             />
//                         </div>
//                     )}

//                     {/* No Search Results State */}
//                     {!loading &&
//                         searchQuery &&
//                         filteredVisitors.length === 0 && (
//                             <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                                 <Search
//                                     size={48}
//                                     className="mx-auto text-gray-300 mb-4"
//                                 />
//                                 <p className="text-gray-400 text-lg mb-2">
//                                     No visitors found for "{searchQuery}"
//                                 </p>
//                                 <p className="text-gray-500 mb-4">
//                                     Try searching with different keywords
//                                 </p>
//                                 <button
//                                     onClick={handleClearSearch}
//                                     className="text-blue-600 hover:text-blue-700 font-medium"
//                                 >
//                                     Clear search
//                                 </button>
//                             </div>
//                         )}

//                     {/* Empty State (when no data at all) */}
//                     {!loading &&
//                         !searchQuery &&
//                         confirmedVisitors.length === 0 && (
//                             <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                                 <p className="text-gray-400 text-lg">
//                                     No confirmed visitors found
//                                 </p>
//                             </div>
//                         )}

//                     {selectedConfirmedVisitor && (
//                         <EditFixedJobForm
//                             visitor={selectedConfirmedVisitor}
//                             onClose={handleCloseConfirmedDetails}
//                             onUpdate={handleUpdateConfirmedVisitor}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default FixedJobs;


import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import MyTable from "./MyTable";
import EditFixedJobForm from "@/EditFormComponents/EditFixedJobForm";
import { Edit, Search, Trash2, X } from "lucide-react";
import { Head } from "@inertiajs/react";

const FixedJobs = () => {
    const [confirmedVisitors, setConfirmedVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingVisitor, setEditingVisitor] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedConfirmedVisitor, setSelectedConfirmedVisitor] =
        useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    // For fetching the confirmed visitors data
    const fetchConfirmedVisitors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(route("ourvisitors.index"));
            // Filter only confirmed visitors
            const confirmed = response.data.filter(
                (visitor) => visitor.status === "Confirm",
            );
            setConfirmedVisitors(confirmed);
            setFilteredVisitors(confirmed);
        } catch (error) {
            console.error("fetching error ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfirmedVisitors();
    }, [reloadTrigger, fetchConfirmedVisitors]);

    // Search functionality
    useEffect(() => {
        const searchVisitors = () => {
            if (!searchQuery.trim()) {
                setFilteredVisitors(confirmedVisitors);
                return;
            }

            setSearchLoading(true);

            const query = searchQuery.toLowerCase().trim();
            const filtered = confirmedVisitors.filter((visitor) => {
                const name = visitor.name?.toLowerCase() || "";
                const companyName = visitor.companyname?.toLowerCase() || "";
                const position = visitor.position?.toLowerCase() || "";
                const contact = visitor.customer_number?.toLowerCase() || "";

                return (
                    name.includes(query) ||
                    companyName.includes(query) ||
                    position.includes(query) ||
                    contact.includes(query)
                );
            });

            setFilteredVisitors(filtered);
            setSearchLoading(false);
        };

        // Debounce search to prevent excessive filtering
        const timer = setTimeout(() => {
            searchVisitors();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, confirmedVisitors]);

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

    // Update confirmed visitor details - FIXED VERSION
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

            // Update the visitor
            const response = await handleUpdate(
                formData,
                selectedConfirmedVisitor.id,
            );
            
            // Clear the selected visitor
            setSelectedConfirmedVisitor(null);
            
            // Trigger table reload
            setReloadTrigger(prev => !prev);
            
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

    // Define columns for confirmed visitors table
    const confirmedColumns = useMemo(
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
                Header: "Payment Status",
                accessor: "payment_status",
                Cell: ({ value }) => {
                    const paymentColors = {
                        Paid: "bg-green-100 text-green-800",
                        Unpaid: "bg-red-100 text-red-800",
                        Pending: "bg-blue-100 text-blue-800",
                    };
                    return (
                        <div className="flex justify-center">
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    paymentColors[value] || "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {value || "-"}
                            </span>
                        </div>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() =>
                                handleViewConfirmedDetails(row.original)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <>
            <AdminWrapper>
                <Head title="Fixed Jobs" />
                <div className="py-4">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                                Fixed Jobs - Confirmed Visitors
                            </h1>
                        </div>
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
                                placeholder="Search by name, company name, position, or contact..."
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
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">
                                Loading confirmed visitors...
                            </p>
                        </div>
                    )}

                    {/* Table View */}
                    {!loading && filteredVisitors.length > 0 && (
                        <div className="mb-8">
                            <MyTable
                                columns={confirmedColumns}
                                data={filteredVisitors}
                                tableClassName="border-2 border-green-200 rounded-lg overflow-hidden"
                            />
                        </div>
                    )}

                    {/* No Search Results State */}
                    {!loading &&
                        searchQuery &&
                        filteredVisitors.length === 0 && (
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
                                <button
                                    onClick={handleClearSearch}
                                    className="text-blue-600 hover:text-blue-700 font-medium "
                                >
                                    Clear search
                                </button>
                            </div>
                        )}

                    {/* Empty State (when no data at all) */}
                    {!loading &&
                        !searchQuery &&
                        confirmedVisitors.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <p className="text-gray-400 text-lg">
                                    No confirmed visitors found
                                </p>
                            </div>
                        )}

                    {/* Edit Form Modal */}
                    {selectedConfirmedVisitor && (
                        <EditFixedJobForm
                            visitor={selectedConfirmedVisitor}
                            onClose={handleCloseConfirmedDetails}
                            onUpdate={handleUpdateConfirmedVisitor}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default FixedJobs;