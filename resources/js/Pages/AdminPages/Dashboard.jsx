// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Head, Link } from "@inertiajs/react";
// import {
//     BuildingOffice2Icon,
//     UserIcon,
//     UsersIcon,
//     ClipboardDocumentCheckIcon,
// } from "@heroicons/react/24/outline";

// const cards = [
//     {
//         title: "Employer Details",
//         breadcrumb: "Employer",
//         icon: BuildingOffice2Icon,
//         link: "/employer-details",
//     },
//     {
//         title: "Customer Details",
//         breadcrumb: "Customer",
//         icon: UserIcon,
//         link: "/customer-details",
//     },
//     {
//         title: "Company Visitors",
//         breadcrumb: "Visitors",
//         icon: UsersIcon,
//         link: "/company-visitor-details",
//     },
//     {
//         title: "Fixed Jobs",
//         breadcrumb: "Fixed Jobs",
//         icon: ClipboardDocumentCheckIcon,
//         link: "/fixed-job-details",
//     },
// ];

// const Dashboard = () => {
//     return (
//         <AdminWrapper>
//             <Head title="Dashboard" />
//             <div className="max-w-7xl mx-auto py-4">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-10">
//                     Dashboard
//                 </h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {cards.map((card, index) => {
//                         const Icon = card.icon;

//                         return (
//                             <Link
//                                 key={index}
//                                 href={card.link}
//                                 className="block"
//                             >
//                                 <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//                                     {/* Card Top Breadcrumb */}
//                                     <div className="flex items-center gap-2 mb-6">
//                                         <span className="text-xl font-semibold text-gray-800">
//                                             Home
//                                         </span>
//                                         <span className="text-sm text-gray-500">
//                                             | {card.breadcrumb}
//                                         </span>
//                                     </div>

//                                     {/* Card Content */}
//                                     <div className="flex items-center gap-6">
//                                         <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
//                                             <Icon className="w-7 h-7 text-gray-700" />
//                                         </div>

//                                         <h3 className="text-lg font-medium text-gray-800">
//                                             {card.title}
//                                         </h3>
//                                     </div>
//                                 </div>
//                             </Link>
//                         );
//                     })}
//                 </div>
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Users,
    DollarSign,
    CreditCard,
    Smartphone,
    Clock,
    CheckCircle,
    TrendingUp,
    PieChart as PieChartIcon,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import {
    BuildingOffice2Icon,
    UserIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Head, Link, usePage } from "@inertiajs/react";

const cards = [
    {
        title: "Employer Details",
        breadcrumb: "Employer",
        icon: BuildingOffice2Icon,
        link: "/employer-details",
    },
    {
        title: "Customer Details",
        breadcrumb: "Customer",
        icon: UserIcon,
        link: "/customer-details",
    },
    {
        title: "Company Visitors",
        breadcrumb: "Visitors",
        icon: UsersIcon,
        link: "/company-visitor-details",
    },
    {
        title: "Fixed Jobs",
        breadcrumb: "Fixed Jobs",
        icon: ClipboardDocumentCheckIcon,
        link: "/fixed-job-details",
    },
];
const Dashboard = () => {
    const [allVisitors, setAllVisitors] = useState([]);
    const [paidVisitors, setPaidVisitors] = useState([]);
    const [pendingVisitors, setPendingVisitors] = useState([]);
    const [cashVisitors, setCashVisitors] = useState([]);
    const [phonePayVisitors, setPhonePayVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const user = usePage().props.auth.user;

    const isAdmin = user?.roles === "Admin";
    const isUser = user?.roles === "User";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [
                    allResponse,
                    paidResponse,
                    pendingResponse,
                    cashResponse,
                    phonePayResponse,
                ] = await Promise.all([
                    axios.get(route("ourvisitors.index")),
                    axios.get(route("ourvisitors.paid")),
                    axios.get(route("ourvisitors.pending")),
                    axios.get(route("ourvisitors.cash")),
                    axios.get(route("ourvisitors.phone-pay")),
                ]);

                setAllVisitors(allResponse.data);
                setPaidVisitors(paidResponse.data);
                setPendingVisitors(pendingResponse.data);
                setCashVisitors(cashResponse.data);
                setPhonePayVisitors(phonePayResponse.data);
            } catch (error) {
                console.error("Fetching error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reloadTrigger]);

    // Calculate dashboard data from fetched visitors
    const calculateDashboardData = () => {
        const totalVisitors = allVisitors.length;
        const confirmedVisitors = allVisitors.filter(
            (v) => v.status === "Confirm",
        ).length;

        // Calculate total income from paid visitors
        const totalIncome = paidVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate pending income
        const pendingIncome = pendingVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate PhonePay income
        const phonePayIncome = phonePayVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate Cash income
        const cashIncome = cashVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate this month's income (assuming 'date' field exists)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthIncome = paidVisitors
            .filter((visitor) => {
                if (!visitor.date) return false;
                const visitorDate = new Date(visitor.date);
                return (
                    visitorDate.getMonth() === currentMonth &&
                    visitorDate.getFullYear() === currentYear
                );
            })
            .reduce(
                (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
                0,
            );

        // Calculate total paid income (excluding pending)
        const paidIncome = totalIncome - pendingIncome;

        return {
            visitors: {
                total: totalVisitors,
                confirmed: confirmedVisitors,
                pending: totalVisitors - confirmedVisitors,
            },
            payments: {
                total: paidVisitors.length + pendingVisitors.length,
                paid: paidVisitors.length,
                pending: pendingVisitors.length,
            },
            income: {
                total: totalIncome,
                pending: pendingIncome,
                paid: paidIncome,
                phonePay: phonePayIncome,
                cash: cashIncome,
                thisMonth: thisMonthIncome,
            },
        };
    };

    const dashboardData = calculateDashboardData();

    // Format currency for PhonePay and other non-cash amounts (without currency symbol)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format cash amounts without currency symbol
    const formatCash = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate percentages
    const pendingPercentage =
        dashboardData.payments.total > 0
            ? Math.round(
                  (dashboardData.payments.pending /
                      dashboardData.payments.total) *
                      100,
              )
            : 0;

    const paidPercentage =
        dashboardData.payments.total > 0
            ? Math.round(
                  (dashboardData.payments.paid / dashboardData.payments.total) *
                      100,
              )
            : 0;

    const phonePayPercentage =
        dashboardData.income.paid > 0
            ? Math.round(
                  (dashboardData.income.phonePay / dashboardData.income.paid) *
                      100,
              )
            : 0;

    const cashPercentage =
        dashboardData.income.paid > 0
            ? Math.round(
                  (dashboardData.income.cash / dashboardData.income.paid) * 100,
              )
            : 0;

    // Data for Pie Chart - Payment Methods (Income Distribution)
    const paymentMethodData = [
        {
            name: "PhonePay",
            value: dashboardData.income.phonePay,
            amount: dashboardData.income.phonePay,
            color: "#3B82F6",
            formatted: formatCurrency(dashboardData.income.phonePay),
        },
        {
            name: "Cash",
            value: dashboardData.income.cash,
            amount: dashboardData.income.cash,
            color: "#10B981",
            formatted: formatCash(dashboardData.income.cash),
        },
        {
            name: "Pending",
            value: dashboardData.income.pending,
            amount: dashboardData.income.pending,
            color: "#F59E0B",
            formatted: formatCurrency(dashboardData.income.pending),
        },
    ].filter((item) => item.value > 0);

    // Data for Pie Chart - Payment Status (Count)
    const paymentStatusData = [
        {
            name: "Paid",
            value: dashboardData.payments.paid,
            count: dashboardData.payments.paid,
            color: "#8B5CF6",
        },
        {
            name: "Pending",
            value: dashboardData.payments.pending,
            count: dashboardData.payments.pending,
            color: "#F59E0B",
        },
    ].filter((item) => item.value > 0);

    // Custom tooltip for payment method pie chart
    const PaymentMethodTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = dashboardData.income.total;
            const percentage =
                total > 0 ? Math.round((data.amount / total) * 100) : 0;

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex items-center mb-2">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: data.color }}
                        ></div>
                        <p className="font-semibold text-gray-800">
                            {data.name}
                        </p>
                    </div>
                    <p className="text-gray-600">
                        Amount:{" "}
                        <span className="font-semibold">{data.formatted}</span>
                    </p>
                    <p className="text-gray-600">
                        Percentage:{" "}
                        <span className="font-semibold">{percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for payment status pie chart
    const PaymentStatusTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = dashboardData.payments.total;
            const percentage =
                total > 0 ? Math.round((data.count / total) * 100) : 0;

            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex items-center mb-2">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: data.color }}
                        ></div>
                        <p className="font-semibold text-gray-800">
                            {data.name}
                        </p>
                    </div>
                    <p className="text-gray-600">
                        Count:{" "}
                        <span className="font-semibold">
                            {data.count.toLocaleString()}
                        </span>
                    </p>
                    <p className="text-gray-600">
                        Percentage:{" "}
                        <span className="font-semibold">{percentage}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color,
        change,
        suffix,
        isCash = false,
    }) => {
        const formattedValue = isCash
            ? formatCash(value)
            : formatCurrency(value);

        return (
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">
                            {title}
                        </p>
                        <div className="flex items-end mt-2">
                            <p className={`text-2xl font-bold ${color}`}>
                                {typeof value === "number" && value >= 1000
                                    ? isCash
                                        ? formattedValue
                                        : formattedValue
                                    : value.toLocaleString()}
                                {suffix && !isCash && (
                                    <span className="text-lg ml-1">
                                        {suffix}
                                    </span>
                                )}
                            </p>
                            {change && (
                                <span className="text-green-500 text-sm font-medium ml-3 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    {change}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={`p-3 rounded-full ${
                            color === "text-blue-600"
                                ? "bg-blue-50"
                                : color === "text-green-600"
                                  ? "bg-green-50"
                                  : color === "text-red-600"
                                    ? "bg-red-50"
                                    : color === "text-purple-600"
                                      ? "bg-purple-50"
                                      : color === "text-yellow-600"
                                        ? "bg-yellow-50"
                                        : "bg-gray-50"
                        }`}
                    >
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                </div>
            </div>
        );
    };

    const ProgressCard = ({
        title,
        current,
        total,
        percentage,
        type,
        color,
        isCash = false,
    }) => {
        const formattedCurrent =
            type === "currency"
                ? isCash
                    ? formatCash(current)
                    : formatCurrency(current)
                : current.toLocaleString();

        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">{title}</h3>
                    <span className={`font-bold ${color}`}>{percentage}%</span>
                </div>
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
                                {type === "currency"
                                    ? isCash
                                        ? formatCash(current)
                                        : formatCurrency(current)
                                    : current.toLocaleString()}{" "}
                                of{" "}
                                {type === "currency"
                                    ? isCash
                                        ? formatCash(total)
                                        : formatCurrency(total)
                                    : total.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-600">
                                {formattedCurrent}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                        <div
                            style={{ width: `${percentage}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color.replace("text-", "bg-")}`}
                        ></div>
                    </div>
                </div>
            </div>
        );
    };

    const PieChartCard = ({ title, data, total, isPaymentMethod = true }) => {
        const hasData = data.length > 0;

        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {title}
                    </h3>
                    <div className="p-2 rounded-full bg-gray-50">
                        <PieChartIcon className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
                {hasData ? (
                    <div className="flex flex-col lg:flex-row items-center">
                        <div className="w-full lg:w-1/2 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(1)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={
                                            isPaymentMethod
                                                ? PaymentMethodTooltip
                                                : PaymentStatusTooltip
                                        }
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value, entry) => {
                                            const dataItem = data.find(
                                                (item) => item.name === value,
                                            );
                                            return (
                                                <span className="text-sm text-gray-600">
                                                    {value} (
                                                    {isPaymentMethod
                                                        ? dataItem?.formatted
                                                        : `${dataItem?.count} payments`}
                                                    )
                                                </span>
                                            );
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-6">
                            <div className="space-y-4">
                                {data.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:shadow transition-shadow"
                                        style={{
                                            backgroundColor: `${item.color}15`,
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className="w-4 h-4 rounded-full mr-3 border border-white"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            ></div>
                                            <div>
                                                <span className="font-medium text-gray-700 block">
                                                    {item.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {isPaymentMethod
                                                        ? item.formatted
                                                        : `${item.count} payments`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800 text-lg">
                                                {total > 0
                                                    ? Math.round(
                                                          (item.value / total) *
                                                              100,
                                                      )
                                                    : 0}
                                                %
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">
                                            Total{" "}
                                            {isPaymentMethod
                                                ? "Income"
                                                : "Payments"}
                                        </span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {isPaymentMethod
                                                ? formatCurrency(total)
                                                : total.toLocaleString()}
                                        </span>
                                    </div>
                                    {isPaymentMethod && (
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-sm text-gray-500">
                                                (Paid:{" "}
                                                {formatCurrency(
                                                    dashboardData.income.paid,
                                                )}
                                                )
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Cash:{" "}
                                                {formatCash(
                                                    dashboardData.income.cash,
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-2">
                            <PieChartIcon className="w-16 h-16 mx-auto" />
                        </div>
                        <p className="text-gray-500">
                            No data available for this chart
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <AdminWrapper>
                 <Head title="Dashboard" />
                {isAdmin && (
                    <>
                        <div className=" p-4 md:p-6">
                            <div className="max-w-7xl mx-auto">
                                {/* Header */}
                                <div className="mb-8">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        Dashboard Overview
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        Welcome back! Here's what's happening
                                        with your business.
                                    </p>
                                </div>

                                {loading ? (
                                    <div className="min-h-screen  p-4 md:p-6 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                            <p className="mt-4 text-gray-600">
                                                Loading dashboard data...
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Main Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                            <StatCard
                                                title="Total Visitors"
                                                value={
                                                    dashboardData.visitors.total
                                                }
                                                icon={Users}
                                                color="text-blue-600"
                                                suffix="visitors"
                                            />

                                            <StatCard
                                                title="Total Income"
                                                value={
                                                    dashboardData.income.total
                                                }
                                                icon={DollarSign}
                                                color="text-green-600"
                                            />

                                            <StatCard
                                                title="Pending Payments"
                                                value={
                                                    dashboardData.payments
                                                        .pending
                                                }
                                                icon={Clock}
                                                color="text-yellow-600"
                                                suffix="payments"
                                            />

                                            <StatCard
                                                title="Completed Payments"
                                                value={
                                                    dashboardData.payments.paid
                                                }
                                                icon={CheckCircle}
                                                color="text-purple-600"
                                                suffix="payments"
                                            />
                                        </div>

                                        {/* Pie Charts Section */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                            <PieChartCard
                                                title="Income Distribution by Payment Method"
                                                data={paymentMethodData}
                                                total={
                                                    dashboardData.income.total
                                                }
                                                isPaymentMethod={true}
                                            />

                                            <PieChartCard
                                                title="Payment Status Overview"
                                                data={paymentStatusData}
                                                total={
                                                    dashboardData.payments.total
                                                }
                                                isPaymentMethod={false}
                                            />
                                        </div>

                                        {/* Second Row - Payment Methods Income */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                            <StatCard
                                                title="PhonePay Income"
                                                value={
                                                    dashboardData.income
                                                        .phonePay
                                                }
                                                icon={Smartphone}
                                                color="text-blue-600"
                                            />

                                            <StatCard
                                                title="Cash Income"
                                                value={
                                                    dashboardData.income.cash
                                                }
                                                icon={DollarSign}
                                                color="text-green-600"
                                                isCash={true}
                                            />

                                            <StatCard
                                                title="Pending Income"
                                                value={
                                                    dashboardData.income.pending
                                                }
                                                icon={CreditCard}
                                                color="text-red-600"
                                            />
                                        </div>

                                        {/* Progress Sections */}
                                        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <ProgressCard
                                        title="Payment Completion Rate"
                                        current={dashboardData.payments.paid}
                                        total={dashboardData.payments.total}
                                        percentage={paidPercentage}
                                        type="count"
                                        color="text-green-600"
                                    />

                                    <ProgressCard
                                        title="PhonePay vs Total Paid Income"
                                        current={dashboardData.income.phonePay}
                                        total={dashboardData.income.paid}
                                        percentage={phonePayPercentage}
                                        type="currency"
                                        color="text-blue-600"
                                    />
                                </div> */}

                                        {/* Detailed Summary */}
                                        {/* <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Detailed Summary
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Confirmed Visitors
                                                </div>
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {dashboardData.visitors.confirmed.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {dashboardData.visitors.total > 0 
                                                        ? Math.round((dashboardData.visitors.confirmed / dashboardData.visitors.total) * 100)
                                                        : 0
                                                    }% of total
                                                </div>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Pending Visitors
                                                </div>
                                                <div className="text-2xl font-bold text-green-600">
                                                    {dashboardData.visitors.pending.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Pending Payments
                                                </div>
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {dashboardData.payments.pending.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Amount: {formatCurrency(dashboardData.income.pending)}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Completed Payments
                                                </div>
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {dashboardData.payments.paid.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    This Month Income
                                                </div>
                                                <div className="text-2xl font-bold text-indigo-600">
                                                    {formatCurrency(dashboardData.income.thisMonth)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    From {dashboardData.payments.paid} payments
                                                </div>
                                            </div>
                                            <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Total Paid Income
                                                </div>
                                                <div className="text-2xl font-bold text-pink-600">
                                                    {formatCurrency(dashboardData.income.paid)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    Cash Income
                                                </div>
                                                <div className="text-2xl font-bold text-teal-600">
                                                    {formatCash(dashboardData.income.cash)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {cashPercentage}% of paid amount
                                                </div>
                                            </div>
                                            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
                                                <div className="text-sm text-gray-600 mb-1">
                                                    PhonePay Income
                                                </div>
                                                <div className="text-2xl font-bold text-cyan-600">
                                                    {formatCurrency(dashboardData.income.phonePay)}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {phonePayPercentage}% of paid amount
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {isUser && (
                    <>
                        <div className="max-w-7xl mx-auto py-4">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                                Dashboard
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cards.map((card, index) => {
                                    const Icon = card.icon;

                                    return (
                                        <Link
                                            key={index}
                                            href={card.link}
                                            className="block"
                                        >
                                            <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
                                                {/* Card Top Breadcrumb */}
                                                <div className="flex items-center gap-2 mb-6">
                                                    <span className="text-xl font-semibold text-gray-800">
                                                        Home
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        | {card.breadcrumb}
                                                    </span>
                                                </div>

                                                {/* Card Content */}
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
                                                        <Icon className="w-7 h-7 text-gray-700" />
                                                    </div>

                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {card.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </AdminWrapper>
        </>
    );
};

export default Dashboard;
