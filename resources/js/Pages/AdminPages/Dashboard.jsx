// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//     Users,
//     DollarSign,
//     CreditCard,
//     Smartphone,
//     Clock,
//     CheckCircle,
//     TrendingUp,
//     PieChart as PieChartIcon,
//     Calendar,
//     X,
//     ChevronDown,
// } from "lucide-react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     ResponsiveContainer,
//     Legend,
//     Tooltip,
// } from "recharts";
// import {
//     BuildingOffice2Icon,
//     UserIcon,
//     UsersIcon,
//     ClipboardDocumentCheckIcon,
// } from "@heroicons/react/24/outline";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Head, Link, usePage } from "@inertiajs/react";

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
//     const [allVisitors, setAllVisitors] = useState([]);
//     const [paidVisitors, setPaidVisitors] = useState([]);
//     const [pendingVisitors, setPendingVisitors] = useState([]);
//     const [cashVisitors, setCashVisitors] = useState([]);
//     const [phonePayVisitors, setPhonePayVisitors] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(0);

//     // Date filter states
//     const [filteredVisitors, setFilteredVisitors] = useState([]);
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");
//     const [isFiltered, setIsFiltered] = useState(false);
//     const [filteredData, setFilteredData] = useState({
//         allVisitors: [],
//         paidVisitors: [],
//         pendingVisitors: [],
//         cashVisitors: [],
//         phonePayVisitors: [],
//     });

//     const user = usePage().props.auth.user;
//     const isAdmin = user?.roles === "Admin";
//     const isUser = user?.roles === "User";

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);

//                 // Fetch all data in parallel
//                 const [
//                     allResponse,
//                     paidResponse,
//                     pendingResponse,
//                     cashResponse,
//                     phonePayResponse,
//                 ] = await Promise.all([
//                     axios.get(route("ourvisitors.index")),
//                     axios.get(route("ourvisitors.paid")),
//                     axios.get(route("ourvisitors.pending")),
//                     axios.get(route("ourvisitors.cash")),
//                     axios.get(route("ourvisitors.phone-pay")),
//                 ]);

//                 const allData = allResponse.data;
//                 const paidData = paidResponse.data;
//                 const pendingData = pendingResponse.data;
//                 const cashData = cashResponse.data;
//                 const phonePayData = phonePayResponse.data;

//                 setAllVisitors(allData);
//                 setPaidVisitors(paidData);
//                 setPendingVisitors(pendingData);
//                 setCashVisitors(cashData);
//                 setPhonePayVisitors(phonePayData);

//                 // Initialize filtered data with all data
//                 setFilteredData({
//                     allVisitors: allData,
//                     paidVisitors: paidData,
//                     pendingVisitors: pendingData,
//                     cashVisitors: cashData,
//                     phonePayVisitors: phonePayData,
//                 });

//                 setFilteredVisitors(allData);
//             } catch (error) {
//                 console.error("Fetching error", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [reloadTrigger]);

//     // Function to calculate date range for predefined filters
//     const getDateRange = (days) => {
//         const end = new Date();
//         const start = new Date();
//         start.setDate(start.getDate() - days);

//         return {
//             start: start.toISOString().split('T')[0],
//             end: end.toISOString().split('T')[0]
//         };
//     };

//     // Apply predefined date filter (Last 7 days, Last 30 days)
//     const applyPredefinedFilter = (days) => {
//         const { start, end } = getDateRange(days);
//         setStartDate(start);
//         setEndDate(end);

//         // Trigger filter after setting dates
//         setTimeout(() => {
//             applyDateFilter();
//         }, 100);
//     };

//     // Apply date filter function
//     const applyDateFilter = () => {
//         if (!startDate && !endDate) {
//             // Reset to original data
//             setFilteredData({
//                 allVisitors: allVisitors,
//                 paidVisitors: paidVisitors,
//                 pendingVisitors: pendingVisitors,
//                 cashVisitors: cashVisitors,
//                 phonePayVisitors: phonePayVisitors,
//             });
//             setFilteredVisitors(allVisitors);
//             setIsFiltered(false);
//             return;
//         }

//         const filterDataByDate = (dataArray) => {
//             return dataArray.filter((visitor) => {
//                 if (!visitor.date) return false;

//                 const visitorDate = new Date(visitor.date);
//                 visitorDate.setHours(0, 0, 0, 0);

//                 let startMatch = true;
//                 let endMatch = true;

//                 if (startDate) {
//                     const start = new Date(startDate);
//                     start.setHours(0, 0, 0, 0);
//                     startMatch = visitorDate >= start;
//                 }

//                 if (endDate) {
//                     const end = new Date(endDate);
//                     end.setHours(23, 59, 59, 999);
//                     endMatch = visitorDate <= end;
//                 }

//                 return startMatch && endMatch;
//             });
//         };

//         const filteredAll = filterDataByDate(allVisitors);
//         const filteredPaid = filterDataByDate(paidVisitors);
//         const filteredPending = filterDataByDate(pendingVisitors);
//         const filteredCash = filterDataByDate(cashVisitors);
//         const filteredPhonePay = filterDataByDate(phonePayVisitors);

//         setFilteredData({
//             allVisitors: filteredAll,
//             paidVisitors: filteredPaid,
//             pendingVisitors: filteredPending,
//             cashVisitors: filteredCash,
//             phonePayVisitors: filteredPhonePay,
//         });
//         setFilteredVisitors(filteredAll);
//         setIsFiltered(true);
//     };

//     // Clear date filters
//     const handleClearFilters = () => {
//         setStartDate("");
//         setEndDate("");
//         setFilteredData({
//             allVisitors: allVisitors,
//             paidVisitors: paidVisitors,
//             pendingVisitors: pendingVisitors,
//             cashVisitors: cashVisitors,
//             phonePayVisitors: phonePayVisitors,
//         });
//         setFilteredVisitors(allVisitors);
//         setIsFiltered(false);
//     };

//     // Calculate dashboard data from filtered visitors
//     const calculateDashboardData = () => {
//         const totalVisitors = filteredData.allVisitors.length;
//         const confirmedVisitors = filteredData.allVisitors.filter(
//             (v) => v.status === "Confirm",
//         ).length;

//         // Calculate total income from paid visitors
//         const totalIncome = filteredData.paidVisitors.reduce(
//             (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
//             0,
//         );

//         // Calculate pending income
//         const pendingIncome = filteredData.pendingVisitors.reduce(
//             (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
//             0,
//         );

//         // Calculate PhonePay income
//         const phonePayIncome = filteredData.phonePayVisitors.reduce(
//             (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
//             0,
//         );

//         // Calculate Cash income
//         const cashIncome = filteredData.cashVisitors.reduce(
//             (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
//             0,
//         );

//         // Calculate this month's income (assuming 'date' field exists)
//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();
//         const thisMonthIncome = filteredData.paidVisitors
//             .filter((visitor) => {
//                 if (!visitor.date) return false;
//                 const visitorDate = new Date(visitor.date);
//                 return (
//                     visitorDate.getMonth() === currentMonth &&
//                     visitorDate.getFullYear() === currentYear
//                 );
//             })
//             .reduce(
//                 (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
//                 0,
//             );

//         // Calculate total paid income (excluding pending)
//         const paidIncome = totalIncome - pendingIncome;

//         return {
//             visitors: {
//                 total: totalVisitors,
//                 confirmed: confirmedVisitors,
//                 pending: totalVisitors - confirmedVisitors,
//             },
//             payments: {
//                 total: filteredData.paidVisitors.length + filteredData.pendingVisitors.length,
//                 paid: filteredData.paidVisitors.length,
//                 pending: filteredData.pendingVisitors.length,
//             },
//             income: {
//                 total: totalIncome,
//                 pending: pendingIncome,
//                 paid: paidIncome,
//                 phonePay: phonePayIncome,
//                 cash: cashIncome,
//                 thisMonth: thisMonthIncome,
//             },
//         };
//     };

//     const dashboardData = calculateDashboardData();

//     // Format currency for PhonePay and other non-cash amounts (without currency symbol)
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat("en-IN", {
//             maximumFractionDigits: 0,
//         }).format(amount);
//     };

//     // Format cash amounts without currency symbol
//     const formatCash = (amount) => {
//         return new Intl.NumberFormat("en-IN", {
//             maximumFractionDigits: 0,
//         }).format(amount);
//     };

//     // Calculate percentages
//     const pendingPercentage =
//         dashboardData.payments.total > 0
//             ? Math.round(
//                   (dashboardData.payments.pending /
//                       dashboardData.payments.total) *
//                       100,
//               )
//             : 0;

//     const paidPercentage =
//         dashboardData.payments.total > 0
//             ? Math.round(
//                   (dashboardData.payments.paid / dashboardData.payments.total) *
//                       100,
//               )
//             : 0;

//     const phonePayPercentage =
//         dashboardData.income.paid > 0
//             ? Math.round(
//                   (dashboardData.income.phonePay / dashboardData.income.paid) *
//                       100,
//               )
//             : 0;

//     const cashPercentage =
//         dashboardData.income.paid > 0
//             ? Math.round(
//                   (dashboardData.income.cash / dashboardData.income.paid) * 100,
//               )
//             : 0;

//     // Data for Pie Chart - Payment Methods (Income Distribution)
//     const paymentMethodData = [
//         {
//             name: "PhonePay",
//             value: dashboardData.income.phonePay,
//             amount: dashboardData.income.phonePay,
//             color: "#3B82F6",
//             formatted: formatCurrency(dashboardData.income.phonePay),
//         },
//         {
//             name: "Cash",
//             value: dashboardData.income.cash,
//             amount: dashboardData.income.cash,
//             color: "#10B981",
//             formatted: formatCash(dashboardData.income.cash),
//         },
//         {
//             name: "Pending",
//             value: dashboardData.income.pending,
//             amount: dashboardData.income.pending,
//             color: "#F59E0B",
//             formatted: formatCurrency(dashboardData.income.pending),
//         },
//     ].filter((item) => item.value > 0);

//     // Data for Pie Chart - Payment Status (Count)
//     const paymentStatusData = [
//         {
//             name: "Paid",
//             value: dashboardData.payments.paid,
//             count: dashboardData.payments.paid,
//             color: "#8B5CF6",
//         },
//         {
//             name: "Pending",
//             value: dashboardData.payments.pending,
//             count: dashboardData.payments.pending,
//             color: "#F59E0B",
//         },
//     ].filter((item) => item.value > 0);

//     // Custom tooltip for payment method pie chart
//     const PaymentMethodTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             const total = dashboardData.income.total;
//             const percentage =
//                 total > 0 ? Math.round((data.amount / total) * 100) : 0;

//             return (
//                 <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//                     <div className="flex items-center mb-2">
//                         <div
//                             className="w-3 h-3 rounded-full mr-2"
//                             style={{ backgroundColor: data.color }}
//                         ></div>
//                         <p className="font-semibold text-gray-800">
//                             {data.name}
//                         </p>
//                     </div>
//                     <p className="text-gray-600">
//                         Amount:{" "}
//                         <span className="font-semibold">{data.formatted}</span>
//                     </p>
//                     <p className="text-gray-600">
//                         Percentage:{" "}
//                         <span className="font-semibold">{percentage}%</span>
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     // Custom tooltip for payment status pie chart
//     const PaymentStatusTooltip = ({ active, payload }) => {
//         if (active && payload && payload.length) {
//             const data = payload[0].payload;
//             const total = dashboardData.payments.total;
//             const percentage =
//                 total > 0 ? Math.round((data.count / total) * 100) : 0;

//             return (
//                 <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
//                     <div className="flex items-center mb-2">
//                         <div
//                             className="w-3 h-3 rounded-full mr-2"
//                             style={{ backgroundColor: data.color }}
//                         ></div>
//                         <p className="font-semibold text-gray-800">
//                             {data.name}
//                         </p>
//                     </div>
//                     <p className="text-gray-600">
//                         Count:{" "}
//                         <span className="font-semibold">
//                             {data.count.toLocaleString()}
//                         </span>
//                     </p>
//                     <p className="text-gray-600">
//                         Percentage:{" "}
//                         <span className="font-semibold">{percentage}%</span>
//                     </p>
//                 </div>
//             );
//         }
//         return null;
//     };

//     const StatCard = ({
//         title,
//         value,
//         icon: Icon,
//         color,
//         change,
//         suffix,
//         isCash = false,
//     }) => {
//         const formattedValue = isCash
//             ? formatCash(value)
//             : formatCurrency(value);

//         return (
//             <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-gray-500 text-sm font-medium">
//                             {title}
//                         </p>
//                         <div className="flex items-end mt-2">
//                             <p className={`text-2xl font-bold ${color}`}>
//                                 {typeof value === "number" && value >= 1000
//                                     ? isCash
//                                         ? formattedValue
//                                         : formattedValue
//                                     : value.toLocaleString()}
//                                 {suffix && !isCash && (
//                                     <span className="text-lg ml-1">
//                                         {suffix}
//                                     </span>
//                                 )}
//                             </p>
//                             {change && (
//                                 <span className="text-green-500 text-sm font-medium ml-3 flex items-center">
//                                     <TrendingUp className="w-4 h-4 mr-1" />
//                                     {change}%
//                                 </span>
//                             )}
//                         </div>
//                     </div>
//                     <div
//                         className={`p-3 rounded-full ${
//                             color === "text-blue-600"
//                                 ? "bg-blue-50"
//                                 : color === "text-green-600"
//                                   ? "bg-green-50"
//                                   : color === "text-red-600"
//                                     ? "bg-red-50"
//                                     : color === "text-purple-600"
//                                       ? "bg-purple-50"
//                                       : color === "text-yellow-600"
//                                         ? "bg-yellow-50"
//                                         : "bg-gray-50"
//                         }`}
//                     >
//                         <Icon className={`w-6 h-6 ${color}`} />
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const ProgressCard = ({
//         title,
//         current,
//         total,
//         percentage,
//         type,
//         color,
//         isCash = false,
//     }) => {
//         const formattedCurrent =
//             type === "currency"
//                 ? isCash
//                     ? formatCash(current)
//                     : formatCurrency(current)
//                 : current.toLocaleString();

//         return (
//             <div className="bg-white rounded-xl shadow-md p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h3 className="font-semibold text-gray-700">{title}</h3>
//                     <span className={`font-bold ${color}`}>{percentage}%</span>
//                 </div>
//                 <div className="relative pt-1">
//                     <div className="flex mb-2 items-center justify-between">
//                         <div>
//                             <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-100">
//                                 {type === "currency"
//                                     ? isCash
//                                         ? formatCash(current)
//                                         : formatCurrency(current)
//                                     : current.toLocaleString()}{" "}
//                                 of{" "}
//                                 {type === "currency"
//                                     ? isCash
//                                         ? formatCash(total)
//                                         : formatCurrency(total)
//                                     : total.toLocaleString()}
//                             </span>
//                         </div>
//                         <div className="text-right">
//                             <span className="text-xs font-semibold inline-block text-gray-600">
//                                 {formattedCurrent}
//                             </span>
//                         </div>
//                     </div>
//                     <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
//                         <div
//                             style={{ width: `${percentage}%` }}
//                             className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${color.replace("text-", "bg-")}`}
//                         ></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const PieChartCard = ({ title, data, total, isPaymentMethod = true }) => {
//         const hasData = data.length > 0;

//         return (
//             <div className="bg-white rounded-xl shadow-md p-6">
//                 <div className="flex items-center justify-between mb-6">
//                     <h3 className="font-semibold text-gray-800 text-lg">
//                         {title}
//                     </h3>
//                     <div className="p-2 rounded-full bg-gray-50">
//                         <PieChartIcon className="w-5 h-5 text-gray-600" />
//                     </div>
//                 </div>
//                 {hasData ? (
//                     <div className="flex flex-col lg:flex-row items-center">
//                         <div className="w-full lg:w-1/2 h-64">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={data}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={50}
//                                         outerRadius={70}
//                                         paddingAngle={2}
//                                         dataKey="value"
//                                         label={({ name, percent }) =>
//                                             `${name}: ${(percent * 100).toFixed(1)}%`
//                                         }
//                                         labelLine={false}
//                                     >
//                                         {data.map((entry, index) => (
//                                             <Cell
//                                                 key={`cell-${index}`}
//                                                 fill={entry.color}
//                                                 stroke="#fff"
//                                                 strokeWidth={2}
//                                             />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip
//                                         content={
//                                             isPaymentMethod
//                                                 ? PaymentMethodTooltip
//                                                 : PaymentStatusTooltip
//                                         }
//                                     />
//                                     <Legend
//                                         verticalAlign="bottom"
//                                         height={36}
//                                         formatter={(value, entry) => {
//                                             const dataItem = data.find(
//                                                 (item) => item.name === value,
//                                             );
//                                             return (
//                                                 <span className="text-sm text-gray-600">
//                                                     {value} (
//                                                     {isPaymentMethod
//                                                         ? dataItem?.formatted
//                                                         : `${dataItem?.count} payments`}
//                                                     )
//                                                 </span>
//                                             );
//                                         }}
//                                     />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-6">
//                             <div className="space-y-4">
//                                 {data.map((item, index) => (
//                                     <div
//                                         key={index}
//                                         className="flex items-center justify-between p-3 rounded-lg hover:shadow transition-shadow"
//                                         style={{
//                                             backgroundColor: `${item.color}15`,
//                                         }}
//                                     >
//                                         <div className="flex items-center">
//                                             <div
//                                                 className="w-4 h-4 rounded-full mr-3 border border-white"
//                                                 style={{
//                                                     backgroundColor: item.color,
//                                                 }}
//                                             ></div>
//                                             <div>
//                                                 <span className="font-medium text-gray-700 block">
//                                                     {item.name}
//                                                 </span>
//                                                 <span className="text-xs text-gray-500">
//                                                     {isPaymentMethod
//                                                         ? item.formatted
//                                                         : `${item.count} payments`}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="font-bold text-gray-800 text-lg">
//                                                 {total > 0
//                                                     ? Math.round(
//                                                           (item.value / total) *
//                                                               100,
//                                                       )
//                                                     : 0}
//                                                 %
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <div className="pt-4 border-t border-gray-200">
//                                     <div className="flex justify-between items-center">
//                                         <span className="font-semibold text-gray-800">
//                                             Total{" "}
//                                             {isPaymentMethod
//                                                 ? "Income"
//                                                 : "Payments"}
//                                         </span>
//                                         <span className="text-xl font-bold text-gray-900">
//                                             {isPaymentMethod
//                                                 ? formatCurrency(total)
//                                                 : total.toLocaleString()}
//                                         </span>
//                                     </div>
//                                     {isPaymentMethod && (
//                                         <div className="flex justify-between items-center mt-1">
//                                             <span className="text-sm text-gray-500">
//                                                 (Paid:{" "}
//                                                 {formatCurrency(
//                                                     dashboardData.income.paid,
//                                                 )}
//                                                 )
//                                             </span>
//                                             <span className="text-sm text-gray-500">
//                                                 Cash:{" "}
//                                                 {formatCash(
//                                                     dashboardData.income.cash,
//                                                 )}
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="text-center py-12">
//                         <div className="text-gray-400 mb-2">
//                             <PieChartIcon className="w-16 h-16 mx-auto" />
//                         </div>
//                         <p className="text-gray-500">
//                             No data available for this chart
//                         </p>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <Head title="Dashboard" />
//                 {isAdmin && (
//                     <>
//                         <div className="">
//                             <div className="">
//                                 {/* Header */}
//                                 <div className="mb-8">
//                                     <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                                         Dashboard Overview
//                                     </h1>
//                                     {/* <p className="text-gray-600 mt-2">
//                                         Welcome back! Here's what's happening with your business.
//                                         {isFiltered && startDate && endDate && (
//                                             <span className="ml-2 text-blue-600 font-medium">
//                                                 (Filtered: {startDate} to {endDate})
//                                             </span>
//                                         )}
//                                     </p> */}
//                                 </div>

//                                 {/* Date Filter Section */}
//                                 <div className="mb-6">
//                                     <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
//                                         {/* Quick Filter Buttons */}
//                                         <div className="flex flex-wrap gap-3">
//                                             <button
//                                                 onClick={() => applyPredefinedFilter(7)}
//                                                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                                             >
//                                                 <Calendar size={16} />
//                                                 Last 7 Days
//                                             </button>
//                                             <button
//                                                 onClick={() => applyPredefinedFilter(30)}
//                                                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                                             >
//                                                 <Calendar size={16} />
//                                                 Last 30 Days
//                                             </button>
//                                             {isFiltered && (
//                                                 <button
//                                                     onClick={handleClearFilters}
//                                                     className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                                                 >
//                                                     <X size={16} />
//                                                     Clear Filter
//                                                 </button>
//                                             )}
//                                         </div>

//                                         {/* Custom Date Range */}
//                                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
//                                             <h3 className="text-sm font-medium text-gray-700">
//                                                 Custom Date Range:
//                                             </h3>
//                                             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                                                 {/* Start Date */}
//                                                 <div className="relative flex-1 sm:flex-none">
//                                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                         <Calendar
//                                                             size={16}
//                                                             className="text-gray-400"
//                                                         />
//                                                     </div>
//                                                     <input
//                                                         type="date"
//                                                         value={startDate}
//                                                         onChange={(e) =>
//                                                             setStartDate(e.target.value)
//                                                         }
//                                                         className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
//                                                         max={endDate || undefined}
//                                                         placeholder="Start date"
//                                                     />
//                                                 </div>

//                                                 {/* Separator */}
//                                                 <div className="hidden sm:flex items-center">
//                                                     <span className="text-gray-400 mx-2">
//                                                         to
//                                                     </span>
//                                                 </div>

//                                                 {/* End Date */}
//                                                 <div className="relative flex-1 sm:flex-none">
//                                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                         <Calendar
//                                                             size={16}
//                                                             className="text-gray-400"
//                                                         />
//                                                     </div>
//                                                     <input
//                                                         type="date"
//                                                         value={endDate}
//                                                         onChange={(e) =>
//                                                             setEndDate(e.target.value)
//                                                         }
//                                                         className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
//                                                         min={startDate || undefined}
//                                                         placeholder="End date"
//                                                     />
//                                                 </div>

//                                                 {/* Apply Button */}
//                                                 <button
//                                                     onClick={applyDateFilter}
//                                                     disabled={!startDate && !endDate}
//                                                     className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
//                                                         startDate || endDate
//                                                             ? "bg-gray-800 hover:bg-gray-900 text-white"
//                                                             : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                                     }`}
//                                                 >
//                                                     <Calendar size={16} />
//                                                     Apply Filter
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {loading ? (
//                                     <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
//                                         <div className="text-center">
//                                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                                             <p className="mt-4 text-gray-600">
//                                                 Loading dashboard data...
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         {/* Main Stats Grid */}
//                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                                             <StatCard
//                                                 title="Total Visitors"
//                                                 value={
//                                                     dashboardData.visitors.total
//                                                 }
//                                                 icon={Users}
//                                                 color="text-blue-600"
//                                                 suffix="visitors"
//                                             />

//                                             <StatCard
//                                                 title="Total Income"
//                                                 value={
//                                                     dashboardData.income.total
//                                                 }
//                                                 icon={DollarSign}
//                                                 color="text-green-600"
//                                             />

//                                             <StatCard
//                                                 title="Pending Payments"
//                                                 value={
//                                                     dashboardData.payments
//                                                         .pending
//                                                 }
//                                                 icon={Clock}
//                                                 color="text-yellow-600"
//                                                 suffix="payments"
//                                             />

//                                             <StatCard
//                                                 title="Completed Payments"
//                                                 value={
//                                                     dashboardData.payments.paid
//                                                 }
//                                                 icon={CheckCircle}
//                                                 color="text-purple-600"
//                                                 suffix="payments"
//                                             />
//                                         </div>

//                                         {/* Pie Charts Section */}
//                                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                                             <PieChartCard
//                                                 title="Income Distribution by Payment Method"
//                                                 data={paymentMethodData}
//                                                 total={
//                                                     dashboardData.income.total
//                                                 }
//                                                 isPaymentMethod={true}
//                                             />

//                                             <PieChartCard
//                                                 title="Payment Status Overview"
//                                                 data={paymentStatusData}
//                                                 total={
//                                                     dashboardData.payments.total
//                                                 }
//                                                 isPaymentMethod={false}
//                                             />
//                                         </div>

//                                         {/* Second Row - Payment Methods Income */}
//                                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                                             <StatCard
//                                                 title="PhonePay Income"
//                                                 value={
//                                                     dashboardData.income
//                                                         .phonePay
//                                                 }
//                                                 icon={Smartphone}
//                                                 color="text-blue-600"
//                                             />

//                                             <StatCard
//                                                 title="Cash Income"
//                                                 value={
//                                                     dashboardData.income.cash
//                                                 }
//                                                 icon={DollarSign}
//                                                 color="text-green-600"
//                                                 isCash={true}
//                                             />

//                                             <StatCard
//                                                 title="Pending Income"
//                                                 value={
//                                                     dashboardData.income.pending
//                                                 }
//                                                 icon={CreditCard}
//                                                 color="text-red-600"
//                                             />
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 {isUser && (
//                     <>
//                         <div className="max-w-7xl mx-auto py-4">
//                             <h2 className="text-2xl font-semibold text-gray-800 mb-10">
//                                 Dashboard
//                             </h2>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {cards.map((card, index) => {
//                                     const Icon = card.icon;

//                                     return (
//                                         <Link
//                                             key={index}
//                                             href={card.link}
//                                             className="block"
//                                         >
//                                             <div className="bg-white rounded-2xl p-6 min-h-[180px] cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
//                                                 {/* Card Top Breadcrumb */}
//                                                 <div className="flex items-center gap-2 mb-6">
//                                                     <span className="text-xl font-semibold text-gray-800">
//                                                         Home
//                                                     </span>
//                                                     <span className="text-sm text-gray-500">
//                                                         | {card.breadcrumb}
//                                                     </span>
//                                                 </div>

//                                                 {/* Card Content */}
//                                                 <div className="flex items-center gap-6">
//                                                     <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100">
//                                                         <Icon className="w-7 h-7 text-gray-700" />
//                                                     </div>

//                                                     <h3 className="text-lg font-medium text-gray-800">
//                                                         {card.title}
//                                                     </h3>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     );
//                                 })}
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </AdminWrapper>
//         </>
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
    Calendar,
    X,
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

    // Date filter states
    const [filteredVisitors, setFilteredVisitors] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);
    const [filteredData, setFilteredData] = useState({
        allVisitors: [],
        paidVisitors: [],
        pendingVisitors: [],
        cashVisitors: [],
        phonePayVisitors: [],
    });

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

                const allData = allResponse.data;
                const paidData = paidResponse.data;
                const pendingData = pendingResponse.data;
                const cashData = cashResponse.data;
                const phonePayData = phonePayResponse.data;

                setAllVisitors(allData);
                setPaidVisitors(paidData);
                setPendingVisitors(pendingData);
                setCashVisitors(cashData);
                setPhonePayVisitors(phonePayData);

                // Initialize filtered data with all data
                setFilteredData({
                    allVisitors: allData,
                    paidVisitors: paidData,
                    pendingVisitors: pendingData,
                    cashVisitors: cashData,
                    phonePayVisitors: phonePayData,
                });

                setFilteredVisitors(allData);
            } catch (error) {
                console.error("Fetching error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reloadTrigger]);

    // Function to calculate date range for predefined filters
    const getDateRange = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        };
    };

    // Apply predefined date filter (Last 7 days, Last 30 days)
    const applyPredefinedFilter = (days) => {
        const { start, end } = getDateRange(days);
        setStartDate(start);
        setEndDate(end);

        // Trigger filter after setting dates
        setTimeout(() => {
            applyDateFilter();
        }, 100);
    };

    // Apply date filter function
    const applyDateFilter = () => {
        if (!startDate && !endDate) {
            // Reset to original data
            setFilteredData({
                allVisitors: allVisitors,
                paidVisitors: paidVisitors,
                pendingVisitors: pendingVisitors,
                cashVisitors: cashVisitors,
                phonePayVisitors: phonePayVisitors,
            });
            setFilteredVisitors(allVisitors);
            setIsFiltered(false);
            return;
        }

        const filterDataByDate = (dataArray) => {
            return dataArray.filter((visitor) => {
                if (!visitor.date) return false;

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
        };

        const filteredAll = filterDataByDate(allVisitors);
        const filteredPaid = filterDataByDate(paidVisitors);
        const filteredPending = filterDataByDate(pendingVisitors);
        const filteredCash = filterDataByDate(cashVisitors);
        const filteredPhonePay = filterDataByDate(phonePayVisitors);

        setFilteredData({
            allVisitors: filteredAll,
            paidVisitors: filteredPaid,
            pendingVisitors: filteredPending,
            cashVisitors: filteredCash,
            phonePayVisitors: filteredPhonePay,
        });
        setFilteredVisitors(filteredAll);
        setIsFiltered(true);
    };

    // Clear date filters
    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setFilteredData({
            allVisitors: allVisitors,
            paidVisitors: paidVisitors,
            pendingVisitors: pendingVisitors,
            cashVisitors: cashVisitors,
            phonePayVisitors: phonePayVisitors,
        });
        setFilteredVisitors(allVisitors);
        setIsFiltered(false);
    };

    // Calculate dashboard data from filtered visitors
    const calculateDashboardData = () => {
        const totalVisitors = filteredData.allVisitors.length;
        const confirmedVisitors = filteredData.allVisitors.filter(
            (v) => v.status === "Confirm",
        ).length;

        // Calculate total income from paid visitors
        const totalIncome = filteredData.paidVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate pending income
        const pendingIncome = filteredData.pendingVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate PhonePay income
        const phonePayIncome = filteredData.phonePayVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate Cash income
        const cashIncome = filteredData.cashVisitors.reduce(
            (sum, visitor) => sum + (parseFloat(visitor.income) || 0),
            0,
        );

        // Calculate this month's income (assuming 'date' field exists)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthIncome = filteredData.paidVisitors
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

        // Calculate total paid income (only paid, not including pending)
        const paidIncome = totalIncome;

        return {
            visitors: {
                total: totalVisitors,
                confirmed: confirmedVisitors,
                pending: totalVisitors - confirmedVisitors,
            },
            payments: {
                total:
                    filteredData.paidVisitors.length +
                    filteredData.pendingVisitors.length,
                paid: filteredData.paidVisitors.length,
                pending: filteredData.pendingVisitors.length,
            },
            income: {
                total: totalIncome + pendingIncome, // Total includes both paid and pending
                paid: totalIncome, // Only paid income
                pending: pendingIncome,
                phonePay: phonePayIncome,
                cash: cashIncome,
                thisMonth: thisMonthIncome,
            },
        };
    };

    const dashboardData = calculateDashboardData();

    // Format currency for PhonePay (without NPR symbol for chart display)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NP", {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format cash amounts with NPR symbol for display
    const formatCashWithSymbol = (amount) => {
        return new Intl.NumberFormat("en-NP", {
            style: "currency",
            currency: "NPR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format cash amounts without symbol for chart display
    const formatCash = (amount) => {
        return new Intl.NumberFormat("en-NP", {
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Data for Pie Chart - Payment Methods (Income Distribution)
    // Only include actual payment methods (PhonePay and Cash) - exclude Pending
    const paymentMethodData = [
        {
            name: "FonePay",
            value: dashboardData.income.phonePay,
            amount: dashboardData.income.phonePay,
            color: "#3B82F6",
            formatted: formatCurrency(dashboardData.income.phonePay),
            formattedWithSymbol: formatCashWithSymbol(
                dashboardData.income.phonePay,
            ),
        },
        {
            name: "Cash",
            value: dashboardData.income.cash,
            amount: dashboardData.income.cash,
            color: "#10B981",
            formatted: formatCash(dashboardData.income.cash),
            formattedWithSymbol: formatCashWithSymbol(
                dashboardData.income.cash,
            ),
        },
    ].filter((item) => item.value > 0);

    // Data for Pie Chart - Payment Status (Count)
    const paymentStatusData = [
        {
            name: "Paid",
            value: dashboardData.income.paid,
            amount: dashboardData.income.paid,
            color: "#8B5CF6",
            formatted: formatCurrency(dashboardData.income.paid),
            formattedWithSymbol: formatCashWithSymbol(
                dashboardData.income.paid,
            ),
        },
        {
            name: "Pending",
            value: dashboardData.income.pending,
            amount: dashboardData.income.pending,
            color: "#F59E0B",
            formatted: formatCurrency(dashboardData.income.pending),
            formattedWithSymbol: formatCashWithSymbol(
                dashboardData.income.pending,
            ),
        },
    ].filter((item) => item.value > 0);

    // Calculate total values for percentage calculations
    const totalPaymentMethodValue = paymentMethodData.reduce(
        (sum, item) => sum + item.value,
        0,
    );
    const totalPaymentStatusValue = paymentStatusData.reduce(
        (sum, item) => sum + item.value,
        0,
    );

    // Custom tooltip for payment method pie chart
    const PaymentMethodTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = totalPaymentMethodValue;
            const percentage =
                total > 0 ? ((data.amount / total) * 100).toFixed(1) : "0.0";

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
                        <span className="font-semibold">
                            {data.name === "Cash"
                                ? formatCashWithSymbol(data.amount)
                                : `NPR ${data.formatted}`}
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

    // Custom tooltip for payment status pie chart
    const PaymentStatusTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const total = totalPaymentStatusValue;
            const percentage =
                total > 0 ? ((data.amount / total) * 100).toFixed(1) : "0.0";

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
                        <span className="font-semibold">
                            {formatCashWithSymbol(data.amount)}
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
            ? formatCashWithSymbol(value)
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
                                        : `${formattedValue}`
                                    : isCash
                                      ? `NPR ${value.toLocaleString()}`
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

    // Fixed PieChartCard with amounts for payment status
    const PieChartCard = ({ title, data, total, isPaymentMethod = true }) => {
        const hasData = data.length > 0;

        const totalValue = data.reduce((sum, item) => sum + item.value, 0);

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
                                                        ? dataItem?.name ===
                                                          "Cash"
                                                            ? formatCashWithSymbol(
                                                                  dataItem?.amount,
                                                              )
                                                            : `NPR ${dataItem?.formatted}`
                                                        : formatCashWithSymbol(
                                                              dataItem?.amount,
                                                          )}
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
                                {data.map((item, index) => {
                                    const percentage =
                                        totalValue > 0
                                            ? (
                                                  (item.value / totalValue) *
                                                  100
                                              ).toFixed(1)
                                            : "0.0";

                                    return (
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
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                ></div>
                                                <div>
                                                    <span className="font-medium text-gray-700 block">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {isPaymentMethod
                                                            ? item.name ===
                                                              "Cash"
                                                                ? formatCashWithSymbol(
                                                                      item.amount,
                                                                  )
                                                                : `NPR ${item.formatted}`
                                                            : formatCashWithSymbol(
                                                                  item.amount,
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800 text-lg">
                                                    {percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">
                                            Total{" "}
                                            {isPaymentMethod
                                                ? "Paid Income"
                                                : "Income"}
                                        </span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {formatCashWithSymbol(total)}
                                        </span>
                                    </div>
                                    {!isPaymentMethod && (
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-sm text-gray-500">
                                                Paid:{" "}
                                                {formatCashWithSymbol(
                                                    dashboardData.income.paid,
                                                )}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                Pending:{" "}
                                                {formatCashWithSymbol(
                                                    dashboardData.income
                                                        .pending,
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
                        <div className="">
                            <div className="">
                                {/* Header */}
                                <div className="mb-8">
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        Dashboard Overview
                                    </h1>
                                </div>

                                {/* Date Filter Section */}
                                <div className="mb-6">
                                    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        {/* Quick Filter Buttons */}
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() =>
                                                    applyPredefinedFilter(7)
                                                }
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <Calendar size={16} />
                                                Last 7 Days
                                            </button>
                                            <button
                                                onClick={() =>
                                                    applyPredefinedFilter(30)
                                                }
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <Calendar size={16} />
                                                Last 30 Days
                                            </button>
                                            {isFiltered && (
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <X size={16} />
                                                    Clear Filter
                                                </button>
                                            )}
                                        </div>

                                        {/* Custom Date Range */}
                                        <div className=" flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                                            <h3 className="text-sm font-medium text-gray-700">
                                                Custom Date Range:
                                            </h3>
                                            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                                                            setStartDate(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                                        max={
                                                            endDate || undefined
                                                        }
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
                                                            setEndDate(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full sm:w-40 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                                                        min={
                                                            startDate ||
                                                            undefined
                                                        }
                                                        placeholder="End date"
                                                    />
                                                </div>

                                                {/* Apply Button */}
                                                <button
                                                    onClick={applyDateFilter}
                                                    disabled={
                                                        !startDate && !endDate
                                                    }
                                                    className={` flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                        startDate || endDate
                                                            ? "bg-gray-800 hover:bg-gray-900 text-white"
                                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                >
                                                    <Calendar size={16} />
                                                    Apply Filter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
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
                                                value={`NPR ${dashboardData.income.total}`}
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
                                                    dashboardData.income.paid
                                                }
                                                isPaymentMethod={true}
                                            />

                                            <PieChartCard
                                                title="Payment Status Overview"
                                                data={paymentStatusData}
                                                total={
                                                    dashboardData.income.paid +
                                                    dashboardData.income.pending
                                                }
                                                isPaymentMethod={false}
                                            />
                                        </div>

                                        {/* Second Row - Payment Methods Income */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                            <StatCard
                                                title="FonePay Income"
                                                value={`NPR ${dashboardData.income.phonePay}`}
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
                                                value={`NPR ${dashboardData.income.pending}`}
                                                icon={CreditCard}
                                                color="text-red-600"
                                            />
                                        </div>
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
