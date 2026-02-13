// import AdminWrapper from '@/AdminWrapper/AdminWrapper'
// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";

// import { Calendar, Clock, X } from "lucide-react";
// import MyTable from '../AdminPages/MyTable';

// const PendingReports = () => {
//     const [pendingVisitors, setPendingVisitors] = useState([]);
//     const [filteredVisitors, setFilteredVisitors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [isFiltered, setIsFiltered] = useState(false);

//     // Fetch only pending visitors
//     useEffect(() => {
//         const fetchPendingVisitors = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(route("ourvisitors.pending"));
//                 setPendingVisitors(response.data);
//                 setFilteredVisitors(response.data);
//             } catch (error) {
//                 console.error("Error fetching pending visitors", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPendingVisitors();
//     }, []);

//     // Apply date filter function
//     const applyDateFilter = () => {
//         if (!startDate && !endDate) {
//             setFilteredVisitors(pendingVisitors);
//             setIsFiltered(false);
//             return;
//         }

//         const filtered = pendingVisitors.filter((visitor) => {
//             const visitorDate = new Date(visitor.date);
//             visitorDate.setHours(0, 0, 0, 0);

//             let startMatch = true;
//             let endMatch = true;

//             if (startDate) {
//                 const start = new Date(startDate);
//                 start.setHours(0, 0, 0, 0);
//                 startMatch = visitorDate >= start;
//             }

//             if (endDate) {
//                 const end = new Date(endDate);
//                 end.setHours(23, 59, 59, 999);
//                 endMatch = visitorDate <= end;
//             }

//             return startMatch && endMatch;
//         });

//         setFilteredVisitors(filtered);
//         setIsFiltered(true);
//     };

//     // Clear date filters
//     const handleClearFilters = () => {
//         setStartDate("");
//         setEndDate("");
//         setFilteredVisitors(pendingVisitors);
//         setIsFiltered(false);
//     };

//     // Get date range text for display
//     const getDateRangeText = () => {
//         if (!startDate && !endDate) return "";
        
//         if (startDate && endDate) {
//             return `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`;
//         } else if (startDate) {
//             return `From ${formatDateDisplay(startDate)}`;
//         } else if (endDate) {
//             return `Until ${formatDateDisplay(endDate)}`;
//         }
//         return "";
//     };

//     // Format date for display
//     const formatDateDisplay = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//         });
//     };

//     // Define columns for pending reports table
//     const pendingColumns = useMemo(
//         () => [
//             {
//                 Header: "SN",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
            
//             {
//                 Header: "Name",
//                 accessor: "name",
//             },
//             {
//                 Header: "Company Name",
//                 accessor: "companyname",
//             },
//              {
//                 Header: "Salary",
//                 accessor: "salary",
//                 Cell: ({ value }) => {
//                     return value ? `${parseFloat(value).toFixed(2)}` : "-";
//                 },
//             },
//             {
//                 Header:"Percentage",
//                 accessor: "percent",
//                 Cell: ({ value }) => {
//                     return value ? `${parseFloat(value).toFixed(2)}%` : "-";
//                 },
//             },
//             {
//                 Header: "Income",
//                 accessor: "income",
//                 Cell: ({ value }) => {
//                     return value ? `${parseFloat(value).toFixed(2)}` : "-";
//                 },
//             },
//             {
//                 Header: "Payment Method",
//                 accessor: "payment_method",
//                 Cell: ({ value }) => {
//                     return value || "-";
//                 },
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
//                 Header: "Citizenship",
//                 accessor: "citizenship",
//             },
//         ],
//         [],
//     );

//     return (
//         <AdminWrapper>
//             <div>
//                 <div className="flex justify-between items-center mb-6">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">
//                             Pending Report Details
//                         </h1>
//                     </div>
//                 </div>

//                 {/* Date Filter Section - Always Visible */}
//                 <div className="mb-6">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
//                         {/* Right side - Date inputs and buttons */}
//                         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
//                             {/* Date Inputs */}
//                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                                 {/* Start Date */}
//                                 <div className="relative flex-1 sm:flex-none">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Calendar size={16} className="text-gray-400" />
//                                     </div>
//                                     <input
//                                         type="date"
//                                         value={startDate}
//                                         onChange={(e) => setStartDate(e.target.value)}
//                                         className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
//                                         max={endDate || undefined}
//                                         placeholder="Start date"
//                                     />
//                                 </div>

//                                 {/* Separator */}
//                                 <div className="hidden sm:flex items-center">
//                                     <span className="text-gray-400 mx-2">to</span>
//                                 </div>

//                                 {/* End Date */}
//                                 <div className="relative flex-1 sm:flex-none">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Calendar size={16} className="text-gray-400" />
//                                     </div>
//                                     <input
//                                         type="date"
//                                         value={endDate}
//                                         onChange={(e) => setEndDate(e.target.value)}
//                                         className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
//                                         min={startDate || undefined}
//                                         placeholder="End date"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Buttons */}
//                             <div className="flex items-center gap-2">
//                                 {/* Apply Filter Button */}
//                                 <button
//                                     onClick={applyDateFilter}
//                                     disabled={!startDate && !endDate}
//                                     className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
//                                         startDate || endDate
//                                             ? "bg-yellow-600 hover:bg-yellow-700 text-white"
//                                             : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                     }`}
//                                 >
//                                     <Calendar size={16} />
//                                     <span className="hidden sm:inline">Filter</span>
//                                 </button>

//                                 {/* Clear Button - Only show when filters are active */}
//                                 {isFiltered && (
//                                     <button
//                                         onClick={handleClearFilters}
//                                         className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                                         title="Clear filters"
//                                     >
//                                         <X size={16} />
//                                         <span className="hidden sm:inline">Clear</span>
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="text-center py-16">
//                         <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
//                         <p className="mt-4 text-gray-600">
//                             Loading pending reports...
//                         </p>
//                     </div>
//                 )}

//                 {/* Table View */}
//                 {!loading && filteredVisitors.length > 0 && (
//                     <div className="mb-8">
//                         <MyTable
//                             columns={pendingColumns}
//                             data={filteredVisitors}
//                             tableClassName="border-2 border-yellow-200 rounded-lg overflow-hidden"
//                         />
//                     </div>
//                 )}

//                 {/* No Results for Date Filter State */}
//                 {!loading && isFiltered && filteredVisitors.length === 0 && (
//                     <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                         <Calendar
//                             size={48}
//                             className="mx-auto text-gray-300 mb-4"
//                         />
//                         <p className="text-gray-400 text-lg mb-2">
//                             No pending visitors found for the selected date range
//                         </p>
//                         <button
//                             onClick={handleClearFilters}
//                             className="text-yellow-600 hover:text-yellow-700 font-medium"
//                         >
//                             Clear date filters
//                         </button>
//                     </div>
//                 )}

//                 {/* Empty State (when no data at all) */}
//                 {!loading && !isFiltered && pendingVisitors.length === 0 && (
//                     <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
//                         <Clock size={48} className="mx-auto text-yellow-300 mb-4" />
//                         <p className="text-gray-400 text-lg">
//                             No pending payments found
//                         </p>
//                         <p className="text-gray-500 mt-2">
//                             Visitors with "Pending" payment status will appear here
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default PendingReports;


import AdminWrapper from '@/AdminWrapper/AdminWrapper'
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar, Clock, Download, X } from "lucide-react";
import MyTable from '../AdminPages/MyTable';
import { Head } from '@inertiajs/react';

const PendingReports = () => {
    const [pendingVisitors, setPendingVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);
    const [totalPending, setTotalPending] = useState(0);
    const [monthlyPending, setMonthlyPending] = useState(0);
    const [yearlyPending, setYearlyPending] = useState(0);
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentYear, setCurrentYear] = useState("");

    // Fetch only pending visitors
    useEffect(() => {
        const fetchPendingVisitors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourvisitors.pending"));
                setPendingVisitors(response.data);
                setFilteredVisitors(response.data);

                // Calculate pending statistics (only from income field, not salary) - SAME LOGIC
                const total = response.data.reduce((sum, visitor) => {
                    return sum + (parseFloat(visitor.income) || 0);
                }, 0);
                setTotalPending(total);

                // Get current date for monthly and yearly calculations
                const now = new Date();
                const currentMonthNum = now.getMonth() + 1; // 1-12
                const currentYearNum = now.getFullYear();

                // Set display values
                setCurrentMonth(
                    now.toLocaleDateString("en-US", { month: "long" }),
                );
                setCurrentYear(currentYearNum.toString());

                // Calculate monthly pending (current month) - only from income field - SAME LOGIC
                const monthlyTotal = response.data.reduce((sum, visitor) => {
                    if (!visitor.date) return sum;

                    const visitorDate = new Date(visitor.date);
                    const visitorMonth = visitorDate.getMonth() + 1;
                    const visitorYear = visitorDate.getFullYear();

                    if (
                        visitorMonth === currentMonthNum &&
                        visitorYear === currentYearNum
                    ) {
                        return sum + (parseFloat(visitor.income) || 0);
                    }
                    return sum;
                }, 0);
                setMonthlyPending(monthlyTotal);

                // Calculate yearly pending (current year) - only from income field - SAME LOGIC
                const yearlyTotal = response.data.reduce((sum, visitor) => {
                    if (!visitor.date) return sum;

                    const visitorDate = new Date(visitor.date);
                    const visitorYear = visitorDate.getFullYear();

                    if (visitorYear === currentYearNum) {
                        return sum + (parseFloat(visitor.income) || 0);
                    }
                    return sum;
                }, 0);
                setYearlyPending(yearlyTotal);
            } catch (error) {
                console.error("Error fetching pending visitors", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingVisitors();
    }, []);

    // Apply date filter function
    const applyDateFilter = () => {
        if (!startDate && !endDate) {
            setFilteredVisitors(pendingVisitors);
            setIsFiltered(false);
            return;
        }

        const filtered = pendingVisitors.filter((visitor) => {
            const visitorDate = new Date(visitor.date);
            visitorDate.setHours(0, 0, 0, 0);

            let startMatch = true;
            let endMatch = true;

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                startMatch = visitorDate >= start;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                endMatch = visitorDate <= end;
            }

            return startMatch && endMatch;
        });

        setFilteredVisitors(filtered);
        setIsFiltered(true);
    };

    // Clear date filters
    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setFilteredVisitors(pendingVisitors);
        setIsFiltered(false);
    };

    // Format date for display
    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Calculate filtered total pending - SAME LOGIC
    const calculateFilteredTotal = useMemo(() => {
        return filteredVisitors.reduce((sum, visitor) => {
            return sum + (parseFloat(visitor.income) || 0);
        }, 0);
    }, [filteredVisitors]);

    // Calculate filtered monthly pending based on date filter - SAME LOGIC
    const calculateFilteredMonthlyPending = useMemo(() => {
        if (!isFiltered || !startDate || !endDate) return 0;

        // Extract month and year from startDate
        const start = new Date(startDate);
        const month = start.getMonth() + 1;
        const year = start.getFullYear();

        return filteredVisitors.reduce((sum, visitor) => {
            if (!visitor.date) return sum;

            const visitorDate = new Date(visitor.date);
            const visitorMonth = visitorDate.getMonth() + 1;
            const visitorYear = visitorDate.getFullYear();

            if (visitorMonth === month && visitorYear === year) {
                return sum + (parseFloat(visitor.income) || 0);
            }
            return sum;
        }, 0);
    }, [filteredVisitors, isFiltered, startDate, endDate]);

    // Calculate filtered yearly pending based on date filter - SAME LOGIC
    const calculateFilteredYearlyPending = useMemo(() => {
        if (!isFiltered || !startDate || !endDate) return 0;

        // Extract year from startDate
        const start = new Date(startDate);
        const year = start.getFullYear();

        return filteredVisitors.reduce((sum, visitor) => {
            if (!visitor.date) return sum;

            const visitorDate = new Date(visitor.date);
            const visitorYear = visitorDate.getFullYear();

            if (visitorYear === year) {
                return sum + (parseFloat(visitor.income) || 0);
            }
            return sum;
        }, 0);
    }, [filteredVisitors, isFiltered, startDate, endDate]);

    // PDF Download Function 
    const handleDownloadPDF = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        // Title
        doc.setFontSize(16);
        doc.text("Pending Reports", 14, 15);

        // Meta info
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        if (isFiltered && startDate && endDate) {
            doc.text(`Date Range: ${startDate} → ${endDate}`, 14, 28);
        }

        // Summary
        doc.text(
            `Total Pending: ${
                isFiltered
                    ? calculateFilteredTotal.toFixed(2)
                    : totalPending.toFixed(2)
            }`,
            220,
            22,
        );

        // Table
        autoTable(doc, {
            startY: isFiltered ? 34 : 30,
            head: [
                [
                    "SN",
                    "Name",
                    "Company",
                    "Salary",
                    "Percent",
                    "Income",
                    "Payment Method",
                    "Date",
                    "Citizenship",
                ],
            ],
            body: filteredVisitors.map((v, index) => [
                index + 1,
                v.name || "-",
                v.companyname || "-",
                v.salary ? parseFloat(v.salary).toFixed(2) : "-",
                v.percent ? `${parseFloat(v.percent).toFixed(2)}%` : "-",
                v.income ? parseFloat(v.income).toFixed(2) : "-",
                v.payment_method || "-",
                v.date ? new Date(v.date).toLocaleDateString("en-US") : "-",
                v.citizenship || "-",
            ]),
            styles: {
                fontSize: 8,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [31, 41, 55],
                textColor: 255,
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
        });

        doc.save("pending-reports.pdf");
    };

    // Define columns for pending reports table
    const pendingColumns = useMemo(
        () => [
            {
                Header: "SN",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Company Name",
                accessor: "companyname",
            },
             {
                Header: "Salary",
                accessor: "salary",
                Cell: ({ value }) => {
                    return value ? `${parseFloat(value).toFixed(2)}` : "-";
                },
            },
            {
                Header:"Percentage",
                accessor: "percent",
                Cell: ({ value }) => {
                    return value ? `${parseFloat(value).toFixed(2)}%` : "-";
                },
            },
            {
                Header: "Income",
                accessor: "income",
                Cell: ({ value }) => {
                    return value ? `${parseFloat(value).toFixed(2)}` : "-";
                },
            },
            // {
            //     Header: "Payment Method",
            //     accessor: "payment_method",
            //     Cell: ({ value }) => {
            //         return value || "-";
            //     },
            // },
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
                Header: "Citizenship",
                accessor: "citizenship",
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Pending Report" />
            <div className='py-4'>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                            Pending Report Details
                        </h1>
                    </div>
                </div>

                {/* Summary Cards - EXACT SAME Design as BankIncome */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Total Pending Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                Total Pending
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                           NPR {isFiltered ? calculateFilteredTotal.toFixed(2) : totalPending.toFixed(2)}
                        </p>
                    </div>

                    {/* Monthly Pending Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">
                                    NPR {isFiltered
                                        ? "Filtered Monthly"
                                        : ` Monthly Pending (${currentMonth})`}
                                </p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                           NPR {isFiltered
                                ? calculateFilteredMonthlyPending.toFixed(2)
                                : monthlyPending.toFixed(2)}
                        </p>
                    </div>

                    {/* Yearly Pending Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">
                                   NPR {isFiltered
                                        ? "Filtered Yearly"
                                        : ` Yearly Pending (${currentYear})`}
                                </p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                           NPR {isFiltered
                                ? calculateFilteredYearlyPending.toFixed(2)
                                : yearlyPending.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Date Filter Section - EXACT SAME Design as BankIncome */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        {/* Right side - Date inputs and buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            {/* Date Inputs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {/* Start Date */}
                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                        max={endDate || undefined}
                                        placeholder="Start date"
                                    />
                                </div>

                                {/* Separator */}
                                <div className="hidden sm:flex items-center">
                                    <span className="text-gray-400 mx-2">to</span>
                                </div>

                                {/* End Date */}
                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                        min={startDate || undefined}
                                        placeholder="End date"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                {/* Apply Filter Button - EXACT SAME Color as BankIncome */}
                                <button
                                    onClick={applyDateFilter}
                                    disabled={!startDate && !endDate}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                                        startDate || endDate
                                            ? "bg-gray-800 hover:bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    <Calendar size={16} />
                                    <span className="hidden sm:inline">Filter</span>
                                </button>

                                {/* Clear Button - Only show when filters are active */}
                                {isFiltered && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        title="Clear filters"
                                    >
                                        <X size={16} />
                                        <span className="hidden sm:inline">Clear</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Left side - Download */}
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
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
                        <p className="mt-4 text-gray-600">
                            Loading pending reports...
                        </p>
                    </div>
                )}

                {/* Table View */}
                {!loading && filteredVisitors.length > 0 && (
                    <div className="mb-8">
                        <MyTable
                            columns={pendingColumns}
                            data={filteredVisitors}
                            tableClassName="border border-gray-200 rounded-lg overflow-hidden"
                        />
                    </div>
                )}

                {/* No Results for Date Filter State */}
                {!loading && isFiltered && filteredVisitors.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <Calendar
                            size={48}
                            className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-gray-400 text-lg mb-2">
                            No pending visitors found for the selected date range
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Clear date filters
                        </button>
                    </div>
                )}

                {/* Empty State (when no data at all) */}
                {!loading && !isFiltered && pendingVisitors.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 text-lg">
                            No pending payments found
                        </p>
                        <p className="text-gray-500 mt-2">
                            Visitors with "Pending" payment status will appear here
                        </p>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default PendingReports;