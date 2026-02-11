// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "./MyTable"; // Adjust the import path as needed

// const ActivityLogs = () => {
//     const [activityLogs, setActivityLogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLogs = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 const response = await axios.get(route("ourlogs.index"));

//                 // Access the data property of the response
//                 const responseData = response.data;

//                 // Check if the response has the expected structure
//                 if (responseData.success && Array.isArray(responseData.data)) {
//                     setActivityLogs(responseData.data);
//                 } else {
//                     console.error(
//                         "Unexpected response structure:",
//                         responseData,
//                     );
//                     setActivityLogs([]);
//                     setError("Unexpected data format received from server.");
//                 }
//             } catch (error) {
//                 console.error("Error fetching logs:", error);
//                 setError("Failed to fetch logs. Please try again later.");
//                 setActivityLogs([]);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchLogs();
//     }, []);

//     const columns = React.useMemo(
//         () => [
//             {
//                 Header: "ID",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//             },
//             {
//                 Header: "IP Address",
//                 accessor: "ip_address",
//             },
//             {
//                 Header: "Title",
//                 accessor: "title",
//                 Cell: ({ value }) => {
//                     // Slice the title to 50 characters and add ellipsis if longer
//                     const maxLength = 50;
//                     if (value && value.length > maxLength) {
//                         return value.slice(0, maxLength) + "...";
//                     }
//                     return value || "-";
//                 },
//             },
//             {
//                 Header: "Date",
//                 accessor: "created_at",
//                 Cell: ({ value }) => {
//                     return value ? new Date(value).toLocaleString() : "-";
//                 },
//             },
//         ],
//         [],
//     );

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="flex flex-wrap items-center justify-between mb-6 md:mb-8">
//                     <div className="flex items-center">
//                         <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                             Activity Logs
//                         </h1>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="text-center py-8">Loading...</div>
//                 ) : error ? (
//                     <div className="text-center py-8 text-red-500">{error}</div>
//                 ) : (
//                     <>
//                         <MyTable columns={columns} data={activityLogs} />

//                         {/* Total Records Display */}
//                         <div className="mt-4 text-sm text-gray-600">
//                             Total: {activityLogs.length} records
//                         </div>
//                     </>
//                 )}
//             </AdminWrapper>
//         </>
//     );
// };

// export default ActivityLogs;

import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "./MyTable";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ActivityLogs = () => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(route("ourlogs.index"));

                // Access the data property of the response
                const responseData = response.data;

                // Check if the response has the expected structure
                if (responseData.success && Array.isArray(responseData.data)) {
                    setActivityLogs(responseData.data);
                } else {
                    console.error(
                        "Unexpected response structure:",
                        responseData,
                    );
                    setActivityLogs([]);
                    setError("Unexpected data format received from server.");
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
                setError("Failed to fetch logs. Please try again later.");
                setActivityLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // PDF Download Function
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(16);
        doc.text("Activity Logs", 14, 15);

        // Subtitle / date
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        // Table
        autoTable(doc, {
            startY: 28,
            head: [["SN", "Name", "IP Address", "Title", "Date"]],
            body: activityLogs.map((log, index) => [
                index + 1,
                log.name || "-",
                log.ip_address || "-",
                log.title || "-",
                log.created_at
                    ? new Date(log.created_at).toLocaleString()
                    : "-",
            ]),
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [31, 41, 55], // dark gray
                textColor: 255,
            },
        });

        doc.save("activity-logs.pdf");
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "IP Address",
                accessor: "ip_address",
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => {
                    // Slice the title to 50 characters and add ellipsis if longer
                    const maxLength = 50;
                    if (value && value.length > maxLength) {
                        return value.slice(0, maxLength) + "...";
                    }
                    return value || "-";
                },
            },
            {
                Header: "Date",
                accessor: "created_at",
                Cell: ({ value }) => {
                    return value ? new Date(value).toLocaleString() : "-";
                },
            },
        ],
        [],
    );

    return (
        <>
            <AdminWrapper>
                <div className="py-4">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Activity Logs
                            </h1>
                        </div>

                        {/* <button
                            type="button"
                            aria-label="Download activity logs"
                            onClick={handleDownloadPDF}
                            className="p-2 rounded-md hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            <Download className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                        </button> */}
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <Download className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                                PDF
                            </span>
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                            <p className="mt-4 text-gray-600">
                                Loading activity logs...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="text-center py-8 text-red-500">
                            {error}
                        </div>
                    )}

                    {/* Data Display */}
                    {!loading && !error && (
                        <>
                            {activityLogs.length > 0 ? (
                                <>
                                    <MyTable
                                        columns={columns}
                                        data={activityLogs}
                                    />

                                    {/* Total Records Display */}
                                    <div className="mt-4 text-sm text-gray-600">
                                        Total: {activityLogs.length} records
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                                    <div className="mx-auto text-gray-300 mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-lg">
                                        No activity logs found
                                    </p>
                                    <p className="text-gray-500 mt-2">
                                        User activities will appear here
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default ActivityLogs;
