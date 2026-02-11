import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    Calendar,
    Smartphone,
    X,
    CreditCard,
    BarChart,
    DollarSign,
    TrendingUp,
    Calendar as CalendarIcon,
    Download,
} from "lucide-react";
import MyTable from "../AdminPages/MyTable";
import { Head } from "@inertiajs/react";

const BankIncome = () => {
    const [phonePayVisitors, setPhonePayVisitors] = useState([]);
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [yearlyIncome, setYearlyIncome] = useState(0);
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentYear, setCurrentYear] = useState("");

    // Fetch only phone pay visitors
    useEffect(() => {
        const fetchPhonePayVisitors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    route("ourvisitors.phone-pay"),
                );
                setPhonePayVisitors(response.data);
                setFilteredVisitors(response.data);

                // Calculate income statistics (only from income field, not salary)
                const total = response.data.reduce((sum, visitor) => {
                    return sum + (parseFloat(visitor.income) || 0);
                }, 0);
                setTotalIncome(total);

                // Get current date for monthly and yearly calculations
                const now = new Date();
                const currentMonthNum = now.getMonth() + 1; // 1-12
                const currentYearNum = now.getFullYear();

                // Set display values
                setCurrentMonth(
                    now.toLocaleDateString("en-US", { month: "long" }),
                );
                setCurrentYear(currentYearNum.toString());

                // Calculate monthly income (current month) - only from income field
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
                setMonthlyIncome(monthlyTotal);

                // Calculate yearly income (current year) - only from income field
                const yearlyTotal = response.data.reduce((sum, visitor) => {
                    if (!visitor.date) return sum;

                    const visitorDate = new Date(visitor.date);
                    const visitorYear = visitorDate.getFullYear();

                    if (visitorYear === currentYearNum) {
                        return sum + (parseFloat(visitor.income) || 0);
                    }
                    return sum;
                }, 0);
                setYearlyIncome(yearlyTotal);
            } catch (error) {
                console.error("Error fetching phone pay visitors", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhonePayVisitors();
    }, []);

    // Apply date filter function
    const applyDateFilter = () => {
        if (!startDate && !endDate) {
            setFilteredVisitors(phonePayVisitors);
            setIsFiltered(false);
            return;
        }

        const filtered = phonePayVisitors.filter((visitor) => {
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
        setFilteredVisitors(phonePayVisitors);
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

    // Calculate filtered total income
    const calculateFilteredTotal = useMemo(() => {
        return filteredVisitors.reduce((sum, visitor) => {
            return sum + (parseFloat(visitor.income) || 0);
        }, 0);
    }, [filteredVisitors]);

    // Calculate filtered monthly income based on date filter
    const calculateFilteredMonthlyIncome = useMemo(() => {
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

    // Calculate filtered yearly income based on date filter
    const calculateFilteredYearlyIncome = useMemo(() => {
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

    // Get payment method breakdown with income
    const paymentMethodBreakdown = useMemo(() => {
        const methods = filteredVisitors.reduce((acc, visitor) => {
            const method = visitor.payment_method || "Other";
            const amount = parseFloat(visitor.income) || 0;

            if (!acc[method]) {
                acc[method] = {
                    count: 0,
                    total: 0,
                };
            }

            acc[method].count += 1;
            acc[method].total += amount;

            return acc;
        }, {});

        return Object.entries(methods)
            .map(([method, data]) => ({
                method,
                count: data.count,
                total: data.total,
            }))
            .sort((a, b) => b.total - a.total);
    }, [filteredVisitors]);

    // Handle PDF download for bank income report
    const handleDownloadPDF = () => {
        const doc = new jsPDF({
            orientation: "landscape", // wide table
            unit: "mm",
            format: "a4",
        });

        // Title
        doc.setFontSize(16);
        doc.text("Bank Income", 14, 15);

        // Subtitle (date + filter info)
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        if (isFiltered && startDate && endDate) {
            doc.text(`Filtered Range: ${startDate} → ${endDate}`, 14, 28);
        }

        // Summary
        doc.text(
            `Total Income: ${
                isFiltered ? calculateFilteredTotal : totalIncome
            }`,
            200,
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
                fillColor: [31, 41, 55], // dark gray
                textColor: 255,
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
        });

        doc.save("bank-income-report.pdf");
    };

    // Define columns for phone pay reports table
    const phonePayColumns = useMemo(
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
                Header: "Company",
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
                Header: "Percentage",
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
            {
                Header: "Payment Method",
                accessor: "payment_method",
                Cell: ({ value }) => value || "-",
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
                Header: "Citizenship",
                accessor: "citizenship",
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <Head title="Bank Income Report" />
            <div className="py-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Bank Report Details
                        </h1>
                    </div>
                </div>

                {/* Summary Cards - Simple Design */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Total Income Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">
                                Total Income
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {isFiltered ? calculateFilteredTotal : totalIncome}
                        </p>
                    </div>

                    {/* Monthly Income Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">
                                    {isFiltered
                                        ? "Filtered Monthly"
                                        : ` Monthly Income (${currentMonth})`}
                                </p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {isFiltered
                                ? calculateFilteredMonthlyIncome
                                : monthlyIncome}
                        </p>
                    </div>

                    {/* Yearly Income Card */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">
                                    {isFiltered
                                        ? "Filtered Yearly"
                                        : ` Yearly Income (${currentYear})`}
                                </p>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {isFiltered
                                ? calculateFilteredYearlyIncome
                                : yearlyIncome}
                        </p>
                    </div>
                </div>

                {/* Date Filter Section */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        {/* Right side - Date inputs and buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                            {/* Date Inputs */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {/* Start Date */}
                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                        max={endDate || undefined}
                                        placeholder="Start date"
                                    />
                                </div>

                                {/* Separator */}
                                <div className="hidden sm:flex items-center">
                                    <span className="text-gray-400 mx-2">
                                        to
                                    </span>
                                </div>

                                {/* End Date */}
                                <div className="relative flex-1 sm:flex-none">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar
                                            size={16}
                                            className="text-gray-400"
                                        />
                                    </div>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                        min={startDate || undefined}
                                        placeholder="End date"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                {/* Apply Filter Button */}
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
                                    <span className="hidden sm:inline">
                                        Filter
                                    </span>
                                </button>

                                {/* Clear Button - Only show when filters are active */}
                                {isFiltered && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        title="Clear filters"
                                    >
                                        <X size={16} />
                                        <span className="hidden sm:inline">
                                            Clear
                                        </span>
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
                            Loading digital payment reports...
                        </p>
                    </div>
                )}

                {/* Table View */}
                {!loading && filteredVisitors.length > 0 && (
                    <div className="mb-8">
                        <MyTable
                            columns={phonePayColumns}
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
                            No digital payments found for the selected date
                            range
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
                {!loading && !isFiltered && phonePayVisitors.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                        <Smartphone
                            size={48}
                            className="mx-auto text-gray-300 mb-4"
                        />
                        <p className="text-gray-400 text-lg">
                            No digital payment transactions found
                        </p>
                        <p className="text-gray-500 mt-2">
                            Transactions with Phone Pay, UPI, or mobile payments
                            will appear here
                        </p>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default BankIncome;
