// import {
//     ChevronUp,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
// } from "lucide-react";
// import React, { useState, useMemo, useEffect, useCallback } from "react";
// import { useTable, useSortBy, usePagination } from "react-table";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import axios from "axios";

// const UserManagement = () => {
//     const [allUser, setAllUser] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [submitting, setSubmitting] = useState(false);

//     // For fetching the user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(route("ourusers.index"));
//                 setAllUser(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setError("Failed to fetch users");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, [reloadTrigger]);

//     // For delete the user - memoized to prevent recreation on every render
//     const handleDelete = useCallback(async (id) => {
//         if (!confirm("Are you sure you want to delete this user?")) return;

//         try {
//             await axios.delete(route("ourusers.destroy", { id: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//             alert("Failed to delete user");
//         }
//     }, []);

//     // Handle edit click - memoized
//     const handleEditClick = useCallback((user) => {
//         setEditingUser(user);
//         setShowEditModal(true);
//     }, []);

//     // Handle update after the edit - FIXED
//     const handleUpdate = async (formData, id) => {
//         setSubmitting(true);
//         try {
//             // Don't append _method here, let Laravel handle it through route
//             const response = await axios.post(
//                 route("ourusers.update", { ouruser: id }), // Use 'ouruser' parameter name
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             setShowEditModal(false);
//             setEditingUser(null);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating user", error);

//             // Show validation errors if available
//             if (error.response?.data?.errors) {
//                 const errors = error.response.data.errors;
//                 const errorMessages = Object.values(errors).flat().join(", ");
//                 alert(`Validation errors: ${errorMessages}`);
//             } else {
//                 alert(error.response?.data?.message || "Failed to update user");
//             }
//             throw error;
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle add user - FIXED
//     const handleAddUser = async (formData) => {
//         setSubmitting(true);
//         try {
//             const response = await axios.post(
//                 route("ourusers.store"),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             setShowAddModal(false);
//             return response.data;
//         } catch (error) {
//             console.log("Error adding user", error);

//             // Show validation errors if available
//             if (error.response?.data?.errors) {
//                 const errors = error.response.data.errors;
//                 const errorMessages = Object.values(errors).flat().join(", ");
//                 alert(`Validation errors: ${errorMessages}`);
//             } else {
//                 alert(error.response?.data?.message || "Failed to add user");
//             }
//             throw error;
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Close modal
//     const closeModal = useCallback(() => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setEditingUser(null);
//     }, []);

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "ID",
//                 accessor: "id",
//                 width: 60,
//             },
//             {
//                 Header: "Image",
//                 accessor: "image",
//                 Cell: ({ value }) => {
//                     return (
//                         <div className="flex items-center">
//                             <img
//                                 src={`/storage/${value}`}
//                                 alt="User"
//                                 className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
//                             />
//                         </div>
//                     );
//                 },
//                 width: 80,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => {
//                     return (
//                         <div className="flex flex-col">
//                             <span className="font-medium text-gray-900">
//                                 {value || "-"}
//                             </span>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//                 Cell: ({ value }) => {
//                     return <p>{value || "-"}</p>;
//                 },
//             },
//             {
//                 Header: "Role",
//                 accessor: "roles",
//                 Cell: ({ value }) => {
//                     const roleColors = {
//                         admin: "bg-purple-100 text-purple-800",
//                         user: "bg-blue-100 text-blue-800",
//                     };

//                     const colorClass =
//                         roleColors[value] || "bg-gray-100 text-gray-800";

//                     return (
//                         <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}
//                         >
//                             {value
//                                 ? value.charAt(0).toUpperCase() + value.slice(1)
//                                 : "-"}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => {
//                     return (
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={() => handleEditClick(row.original)}
//                                 className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(row.original.id)}
//                                 className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//                             >
//                                 Delete
//                             </button>
//                         </div>
//                     );
//                 },
//             },
//         ],
//         [handleDelete, handleEditClick],
//     );

//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         pageCount,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data: allUser,
//             initialState: { pageIndex: 0, pageSize: 10 },
//         },
//         useSortBy,
//         usePagination,
//     );

//     return (
//         <AdminWrapper>
//             <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
//                 <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
//                     <div className="flex items-center">
//                         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                             User Management
//                         </h1>
//                         <span className="ml-3 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
//                             {allUser.length} users
//                         </span>
//                     </div>
//                     <div className="mt-4 md:mt-0">
//                         <button
//                             onClick={() => setShowAddModal(true)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
//                         >
//                             <svg
//                                 className="w-5 h-5 mr-2"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M12 4v16m8-8H4"
//                                 />
//                             </svg>
//                             Add New User
//                         </button>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="text-center py-8">
//                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                         <p className="mt-2 text-gray-600">Loading users...</p>
//                     </div>
//                 ) : error ? (
//                     <div className="text-center py-8">
//                         <div className="text-red-500 mb-2">⚠️ {error}</div>
//                         <button
//                             onClick={() => setReloadTrigger((prev) => !prev)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                         >
//                             Retry
//                         </button>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="overflow-x-auto rounded-lg border border-gray-200">
//                             <table
//                                 {...getTableProps()}
//                                 className="min-w-full divide-y divide-gray-200"
//                             >
//                                 <thead className="bg-gray-50">
//                                     {headerGroups.map((headerGroup) => (
//                                         <tr
//                                             {...headerGroup.getHeaderGroupProps()}
//                                         >
//                                             {headerGroup.headers.map(
//                                                 (column) => (
//                                                     <th
//                                                         {...column.getHeaderProps(
//                                                             column.getSortByToggleProps(),
//                                                         )}
//                                                         className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                                                     >
//                                                         <div className="flex items-center">
//                                                             {column.render(
//                                                                 "Header",
//                                                             )}
//                                                             {column.isSorted ? (
//                                                                 column.isSortedDesc ? (
//                                                                     <ChevronDown
//                                                                         size={
//                                                                             16
//                                                                         }
//                                                                         className="ml-1"
//                                                                     />
//                                                                 ) : (
//                                                                     <ChevronUp
//                                                                         size={
//                                                                             16
//                                                                         }
//                                                                         className="ml-1"
//                                                                     />
//                                                                 )
//                                                             ) : (
//                                                                 ""
//                                                             )}
//                                                         </div>
//                                                     </th>
//                                                 ),
//                                             )}
//                                         </tr>
//                                     ))}
//                                 </thead>
//                                 <tbody
//                                     {...getTableBodyProps()}
//                                     className="bg-white divide-y divide-gray-200"
//                                 >
//                                     {page.length > 0 ? (
//                                         page.map((row) => {
//                                             prepareRow(row);
//                                             return (
//                                                 <tr
//                                                     {...row.getRowProps()}
//                                                     className="hover:bg-gray-50 transition-colors"
//                                                 >
//                                                     {row.cells.map((cell) => (
//                                                         <td
//                                                             {...cell.getCellProps()}
//                                                             className="px-4 md:px-6 py-3 whitespace-nowrap"
//                                                         >
//                                                             {cell.render(
//                                                                 "Cell",
//                                                             )}
//                                                         </td>
//                                                     ))}
//                                                 </tr>
//                                             );
//                                         })
//                                     ) : (
//                                         <tr>
//                                             <td
//                                                 colSpan={columns.length}
//                                                 className="px-6 py-8 text-center text-gray-500"
//                                             >
//                                                 <div className="flex flex-col items-center">
//                                                     <svg
//                                                         className="w-12 h-12 text-gray-400 mb-4"
//                                                         fill="none"
//                                                         stroke="currentColor"
//                                                         viewBox="0 0 24 24"
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                     >
//                                                         <path
//                                                             strokeLinecap="round"
//                                                             strokeLinejoin="round"
//                                                             strokeWidth="2"
//                                                             d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-.67 3.623h-1.998a9 9 0 01-.67-3.623m-9.33-1.623a10.953 10.953 0 01.67-3.623h1.998a9 9 0 01.67 3.623m-4.328 0a10.953 10.953 0 00.67 3.623h1.998a9 9 0 00.67 3.623"
//                                                         ></path>
//                                                     </svg>
//                                                     <p className="text-lg font-medium text-gray-600">
//                                                         No users found
//                                                     </p>
//                                                     <p className="text-gray-500 mt-1">
//                                                         Add a new user to get
//                                                         started
//                                                     </p>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Pagination */}
//                         <div className="flex items-center justify-between flex-col md:flex-row mt-6 space-y-4 md:space-y-0">
//                             <div className="flex items-center">
//                                 <span className="text-sm text-gray-700 mr-2">
//                                     Show
//                                 </span>
//                                 <select
//                                     value={pageSize}
//                                     onChange={(e) =>
//                                         setPageSize(Number(e.target.value))
//                                     }
//                                     className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 >
//                                     {[5, 10, 15, 20].map((size) => (
//                                         <option key={size} value={size}>
//                                             {size}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <span className="text-sm text-gray-700 ml-2">
//                                     entries per page
//                                 </span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <button
//                                     onClick={() => gotoPage(0)}
//                                     disabled={!canPreviousPage}
//                                     className={`p-2 rounded ${
//                                         !canPreviousPage
//                                             ? "opacity-50 cursor-not-allowed"
//                                             : "hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     <ChevronLeft size={20} />
//                                 </button>
//                                 <button
//                                     onClick={() => previousPage()}
//                                     disabled={!canPreviousPage}
//                                     className={`px-3 py-1 rounded ${
//                                         !canPreviousPage
//                                             ? "opacity-50 cursor-not-allowed"
//                                             : "hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     Previous
//                                 </button>
//                                 <span className="text-sm text-gray-700 px-4">
//                                     Page <strong>{pageIndex + 1}</strong> of{" "}
//                                     <strong>{pageOptions.length}</strong>
//                                 </span>
//                                 <button
//                                     onClick={() => nextPage()}
//                                     disabled={!canNextPage}
//                                     className={`px-3 py-1 rounded ${
//                                         !canNextPage
//                                             ? "opacity-50 cursor-not-allowed"
//                                             : "hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     Next
//                                 </button>
//                                 <button
//                                     onClick={() => gotoPage(pageCount - 1)}
//                                     disabled={!canNextPage}
//                                     className={`p-2 rounded ${
//                                         !canNextPage
//                                             ? "opacity-50 cursor-not-allowed"
//                                             : "hover:bg-gray-200"
//                                     }`}
//                                 >
//                                     <ChevronRight size={20} />
//                                 </button>
//                             </div>
//                             <div className="text-sm text-gray-700">
//                                 Showing {pageIndex * pageSize + 1} to{" "}
//                                 {Math.min(
//                                     (pageIndex + 1) * pageSize,
//                                     allUser.length,
//                                 )}{" "}
//                                 of {allUser.length} users
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Add/Edit User Modal */}
//             {(showAddModal || showEditModal) && (
//                 <AddUserForm
//                     editingUser={editingUser}
//                     handleUpdate={handleUpdate}
//                     handleAddUser={handleAddUser}
//                     setReloadTrigger={setReloadTrigger}
//                     setEditingUser={setEditingUser}
//                     setShowAddModal={setShowAddModal}
//                     setShowEditModal={setShowEditModal}
//                     submitting={submitting}
//                     setSubmitting={setSubmitting}
//                     closeModal={closeModal}
//                 />
//             )}
//         </AdminWrapper>
//     );
// };

// export default UserManagement;

// import {
//     ChevronUp,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     Edit,
//     Trash2,
// } from "lucide-react";
// import React, { useState, useMemo, useEffect, useCallback } from "react";

// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import axios from "axios";
// import MyTable from "./MyTable";

// const UserManagement = () => {
//     const [allUser, setAllUser] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [submitting, setSubmitting] = useState(false);

//     // For fetching the user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(route("ourusers.index"));
//                 setAllUser(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setError("Failed to fetch users");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, [reloadTrigger]);

//     // For delete the user - memoized to prevent recreation on every render
//     const handleDelete = useCallback(async (id) => {
//         if (!confirm("Are you sure you want to delete this user?")) return;

//         try {
//             await axios.delete(route("ourusers.destroy", { id: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//             alert("Failed to delete user");
//         }
//     }, []);

//     // Handle edit click - memoized
//     const handleEditClick = useCallback((user) => {
//         setEditingUser(user);
//         setShowEditModal(true);
//     }, []);

//     // Handle update after the edit - FIXED
//     const handleUpdate = async (formData, id) => {
//         setSubmitting(true);
//         try {
//             // Don't append _method here, let Laravel handle it through route
//             const response = await axios.post(
//                 route("ourusers.update", { ouruser: id }), // Use 'ouruser' parameter name
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             setShowEditModal(false);
//             setEditingUser(null);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating user", error);

//             // Show validation errors if available
//             if (error.response?.data?.errors) {
//                 const errors = error.response.data.errors;
//                 const errorMessages = Object.values(errors).flat().join(", ");
//                 alert(`Validation errors: ${errorMessages}`);
//             } else {
//                 alert(error.response?.data?.message || "Failed to update user");
//             }
//             throw error;
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle add user - FIXED
//     const handleAddUser = async (formData) => {
//         setSubmitting(true);
//         try {
//             const response = await axios.post(
//                 route("ourusers.store"),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             setShowAddModal(false);
//             return response.data;
//         } catch (error) {
//             console.log("Error adding user", error);

//             // Show validation errors if available
//             if (error.response?.data?.errors) {
//                 const errors = error.response.data.errors;
//                 const errorMessages = Object.values(errors).flat().join(", ");
//                 alert(`Validation errors: ${errorMessages}`);
//             } else {
//                 alert(error.response?.data?.message || "Failed to add user");
//             }
//             throw error;
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Close modal
//     const closeModal = useCallback(() => {
//         setShowAddModal(false);
//         setShowEditModal(false);
//         setEditingUser(null);
//     }, []);

//     const columns = useMemo(
//         () => [
//             {
//                 Header: "ID",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Image",
//                 accessor: "image",
//                 Cell: ({ value }) => {
//                     const imageSrc = value
//                         ? `/storage/${value}`
//                         : "/images/placeholder.png";

//                     return (
//                         <div className="flex items-center">
//                             <img
//                                 src={imageSrc}
//                                 alt="User"
//                                 className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
//                             />
//                         </div>
//                     );
//                 },
//                 width: 80,
//             },

//             {
//                 Header: "Name",
//                 accessor: "name",
//                 Cell: ({ value }) => {
//                     return (
//                         <div className="flex flex-col">
//                             <span className="font-medium text-gray-900">
//                                 {value || "-"}
//                             </span>
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//                 Cell: ({ value }) => {
//                     return <p>{value || "-"}</p>;
//                 },
//             },
//             {
//                 Header: "Role",
//                 accessor: "roles",
//                 Cell: ({ value }) => {
//                     const roleColors = {
//                         admin: "bg-purple-100 text-purple-800",
//                         user: "bg-blue-100 text-blue-800",
//                     };

//                     const colorClass =
//                         roleColors[value] || "bg-gray-100 text-gray-800";

//                     return (
//                         <span
//                             className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}
//                         >
//                             {value
//                                 ? value.charAt(0).toUpperCase() + value.slice(1)
//                                 : "-"}
//                         </span>
//                     );
//                 },
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => {
//                     return (
//                         <div className="flex space-x-2">
//                             <button
//                                 onClick={() => handleEditClick(row.original)}
//                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                 title="Edit this User"
//                             >
//                                 <Edit size={16} />
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(row.original.id)}
//                                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                 title="Delete this User"
//                             >
//                                 <Trash2 size={16} />
//                             </button>
//                         </div>
//                     );
//                 },
//             },
//         ],
//         [handleDelete, handleEditClick],
//     );

//     return (
//         <AdminWrapper>
//             <div className="">
//                 <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
//                     <div className="flex items-center">
//                         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                             User Management
//                         </h1>
//                     </div>
//                     <div className="mt-4 md:mt-0">
//                         <button
//                             onClick={() => setShowAddModal(true)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
//                         >
//                             Create
//                         </button>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="text-center py-8">
//                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                         <p className="mt-2 text-gray-600">Loading users...</p>
//                     </div>
//                 ) : error ? (
//                     <div className="text-center py-8">
//                         <div className="text-red-500 mb-2">⚠️ {error}</div>
//                         <button
//                             onClick={() => setReloadTrigger((prev) => !prev)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                         >
//                             Retry
//                         </button>
//                     </div>
//                 ) : allUser.length > 0 ? (
//                     <MyTable columns={columns} data={allUser} />
//                 ) : (
//                     <div className="text-center py-8">
//                         <div className="flex flex-col items-center">
//                             <svg
//                                 className="w-12 h-12 text-gray-400 mb-4"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-.67 3.623h-1.998a9 9 0 01-.67-3.623m-9.33-1.623a10.953 10.953 0 01.67-3.623h1.998a9 9 0 01.67 3.623m-4.328 0a10.953 10.953 0 00.67 3.623h1.998a9 9 0 00.67 3.623"
//                                 ></path>
//                             </svg>
//                             <p className="text-lg font-medium text-gray-600">
//                                 No users found
//                             </p>
//                             <p className="text-gray-500 mt-1">
//                                 Add a new user to get started
//                             </p>
//                             <button
//                                 onClick={() => setShowAddModal(true)}
//                                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                             >
//                                 Add First User
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Add/Edit User Modal */}
//             {(showAddModal || showEditModal) && (
//                 <AddUserForm
//                     editingUser={editingUser}
//                     handleUpdate={handleUpdate}
//                     handleAddUser={handleAddUser}
//                     setReloadTrigger={setReloadTrigger}
//                     setEditingUser={setEditingUser}
//                     setShowAddModal={setShowAddModal}
//                     setShowEditModal={setShowEditModal}
//                     submitting={submitting}
//                     setSubmitting={setSubmitting}
//                     closeModal={closeModal}
//                 />
//             )}
//         </AdminWrapper>
//     );
// };

// export default UserManagement;


import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import MyTable from "./MyTable";
import EditUserForm from "@/EditFormComponents/EditUserForm";

import { Edit, Trash2 } from "lucide-react";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // For fetching the user data
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(route("ourusers.index"));
                setAllUser(response.data);
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // For delete the user - memoized to prevent recreation on every render
    const handleDelete = useCallback(async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(route("ourusers.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
            alert("Failed to delete user");
        }
    }, []);

    // Handle edit click - memoized
    const handleEditClick = useCallback((user) => {
        setEditingUser(user);
        setShowEditModal(true);
    }, []);

    // Handle update after the edit - FIXED VERSION
    const handleUpdate = async (formData, id) => {
        setSubmitting(true);
        try {
            // Use PUT method directly with correct parameter name
            const response = await axios.put(
                route("ourusers.update", { id: id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            setShowEditModal(false);
            setEditingUser(null);
            return response.data;
        } catch (error) {
            console.log("Error updating user", error.response || error);

            // Show validation errors if available
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                alert(`Validation errors: ${errorMessages}`);
            } else {
                alert(error.response?.data?.message || "Failed to update user");
            }
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // Handle add user
    const handleAddUser = async (formData) => {
        setSubmitting(true);
        try {
            const response = await axios.post(
                route("ourusers.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            setShowAddModal(false);
            return response.data;
        } catch (error) {
            console.log("Error adding user", error);

            // Show validation errors if available
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                alert(`Validation errors: ${errorMessages}`);
            } else {
                alert(error.response?.data?.message || "Failed to add user");
            }
            throw error;
        } finally {
            setSubmitting(false);
        }
    };

    // Close modal
    const closeModal = useCallback(() => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingUser(null);
    }, []);

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
                accessor: "image",
                Cell: ({ value }) => {
                    const imageSrc = value
                        ? `/storage/${value}`
                        : "/images/placeholder.png";

                    return (
                        <div className="flex items-center">
                            <img
                                src={imageSrc}
                                alt="User"
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                            />
                        </div>
                    );
                },
                width: 80,
            },
            {
                Header: "Name",
                accessor: "name",
                Cell: ({ value }) => {
                    return (
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                                {value || "-"}
                            </span>
                        </div>
                    );
                },
            },
            {
                Header: "Email",
                accessor: "email",
                Cell: ({ value }) => {
                    return <p>{value || "-"}</p>;
                },
            },
            {
                Header: "Role",
                accessor: "roles",
                Cell: ({ value }) => {
                    const roleColors = {
                        Admin: "bg-purple-100 text-purple-800",
                        User: "bg-blue-100 text-blue-800",
                    };

                    const colorClass =
                        roleColors[value] || "bg-gray-100 text-gray-800";

                    return (
                        <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}
                        >
                            {value
                                ? value.charAt(0).toUpperCase() + value.slice(1)
                                : "-"}
                        </span>
                    );
                },
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => {
                    return (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditClick(row.original)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit this User"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(row.original.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete this User"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                },
            },
        ],
        [handleDelete, handleEditClick],
    );

    return (
        <AdminWrapper>
            <div className="">
                <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
                    <div className="flex items-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            User Management
                        </h1>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                        >
                            Create
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-600">Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-8">
                        <div className="text-red-500 mb-2">⚠️ {error}</div>
                        <button
                            onClick={() => setReloadTrigger((prev) => !prev)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                ) : allUser.length > 0 ? (
                    <MyTable columns={columns} data={allUser} />
                ) : (
                    <div className="text-center py-8">
                        <div className="flex flex-col items-center">
                            <svg
                                className="w-12 h-12 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.623a10.953 10.953 0 01-.67 3.623h-1.998a9 9 0 01-.67-3.623m-9.33-1.623a10.953 10.953 0 01.67-3.623h1.998a9 9 0 01.67 3.623m-4.328 0a10.953 10.953 0 00.67 3.623h1.998a9 9 0 00.67 3.623"
                                ></path>
                            </svg>
                            <p className="text-lg font-medium text-gray-600">
                                No users found
                            </p>
                            <p className="text-gray-500 mt-1">
                                Add a new user to get started
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Add First User
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <AddUserForm
                    handleAddUser={handleAddUser}
                    setShowAddModal={setShowAddModal}
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    closeModal={closeModal}
                />
            )}

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <EditUserForm
                    editingUser={editingUser}
                    handleUpdate={handleUpdate}
                    setShowEditModal={setShowEditModal}
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    closeModal={closeModal}
                />
            )}
        </AdminWrapper>
    );
};

export default UserManagement;
