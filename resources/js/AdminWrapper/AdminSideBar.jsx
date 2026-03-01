// import React, { useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import {
//     FiMenu,
//     FiX,
//     FiChevronDown,
//     FiChevronRight,
//     FiUsers,
//     FiUser,
//     FiCreditCard,
//     FiBookOpen,
// } from "react-icons/fi";
// import { Building, LayoutDashboard } from "lucide-react";

// const AdminSideBar = ({
//     isMobileOpen,
//     onMobileToggle,
//     isCollapsed,
//     onToggleCollapse,
// }) => {
//     const { url } = usePage();
//     const currentPath = url.split("/")[1];
//     const [isReportsOpen, setIsReportsOpen] = useState(false);

//     const isActive = (href) => {
//         const path = href.replace("/", "");
//         return currentPath === path || url.startsWith(href);
//     };

//     // Check if any report route is active
//     const isReportActive = () => {
//         const reportRoutes = [
//             "income-reports",
//             "pending-reports",
//             "cash-reports",
//             "bank-income",
//             "user-logs"
//         ];
//         return reportRoutes.some(route => currentPath === route || url.includes(route));
//     };

//     const toggleReports = () => {
//         setIsReportsOpen(!isReportsOpen);
//     };

//     const reportItems = [
//         {
//             href: "/income-reports",
//             label: "Income Reports",
//         },
//         {
//             href: "/pending-reports",
//             label: "Pending Reports",
//         },
//         {
//             href: "/cash-reports",
//             label: "Cash Reports",
//         },
//         {
//             href: "/bank-income",
//             label: "Bank Income",
//         },
//         {
//             href: "/user-logs",
//             label: "User Logs",
//         },
//     ];

//     return (
//         <>
//             {isMobileOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={onMobileToggle}
//                 />
//             )}

//             <div
//                 className={`
//                     fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
//                     ${isCollapsed ? "w-16" : "w-64"}
//                     ${
//                         isMobileOpen
//                             ? "translate-x-0"
//                             : "-translate-x-full lg:translate-x-0"
//                     }
//                 `}
//                 style={{
//                     backgroundColor: "#ffffff",
//                     borderColor: "#e5e7eb",
//                 }}
//             >
//                 {/* Content Container */}
//                 <div className="relative z-10 h-full">
//                     {/* Header */}
//                     <div
//                         className={`flex items-center justify-between p-4 border-b h-16 ${
//                             isCollapsed ? "px-3" : ""
//                         }`}
//                         style={{ borderColor: "#e5e7eb" }}
//                     >
//                         {!isCollapsed && (
//                             <div className="text-xl font-bold text-gray-800 whitespace-nowrap">
//                                 Fast Job
//                             </div>
//                         )}
//                         <div className="flex items-center space-x-1">
//                             {/* Collapse Toggle Button - Only show on desktop */}
//                             <button
//                                 onClick={onToggleCollapse}
//                                 className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                                 title={
//                                     isCollapsed
//                                         ? "Expand sidebar"
//                                         : "Collapse sidebar"
//                                 }
//                             >
//                                 <FiMenu className="w-4 h-4 text-gray-600" />
//                             </button>

//                             {/* Mobile Close Button */}
//                             <button
//                                 onClick={onMobileToggle}
//                                 className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
//                             >
//                                 <FiX className="w-4 h-4 text-gray-600" />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Menu Items */}
//                     <div
//                         className={`p-2 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] ${
//                             isCollapsed ? "px-2" : "px-3"
//                         }`}
//                     >
//                         {/* Dashboard Link */}
//                         <Link
//                             href="/dashboard"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/dashboard")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Dashboard" : ""}
//                         >
//                             <LayoutDashboard
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/dashboard")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Dashboard
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow:
//                                             "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Dashboard
//                                 </div>
//                             )}
//                         </Link>

//                         {/* Section Header */}
//                         {!isCollapsed && (
//                             <div className="pt-4 px-3">
//                                 <h1 className="font-medium text-gray-500 text-xs uppercase tracking-wider">
//                                     Pages
//                                 </h1>
//                             </div>
//                         )}

//                         {/* User Management Link */}
//                         <Link
//                             href="/users"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/users")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Users" : ""}
//                         >
//                             <FiUsers
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/users")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Users
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Users
//                                 </div>
//                             )}
//                         </Link>

//                         {/* Employer Details Link */}
//                         <Link
//                             href="/employer-details"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/employer-details")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Employer Details" : ""}
//                         >
//                             <Building
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/employer-details")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Employer Details
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow:
//                                             "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Employer Details
//                                 </div>
//                             )}
//                         </Link>

//                         {/* Customer Details Link */}
//                         <Link
//                             href="/customer-details"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/customer-details")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Customer Details" : ""}
//                         >
//                             <FiUser
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/customer-details")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Customer Details
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow:
//                                             "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Customer Details
//                                 </div>
//                             )}
//                         </Link>

//                         {/* Company Visitors Link */}
//                         <Link
//                             href="/company-visitor-details"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/company-visitor-details")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Company Visitors" : ""}
//                         >
//                             <FiUsers
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/company-visitor-details")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Company Visitors
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow:
//                                             "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Company Visitors
//                                 </div>
//                             )}
//                         </Link>

//                         {/* Fixed Jobs */}
//                         <Link
//                             href="/fixed-job-details"
//                             className={`
//                                 flex items-center rounded-lg transition-colors duration-200 group relative
//                                 ${isCollapsed ? "p-3 justify-center" : "p-3"}
//                                 ${
//                                     isActive("/fixed-job-details")
//                                         ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
//                                         : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//                                 }
//                             `}
//                             title={isCollapsed ? "Fixed Jobs" : ""}
//                         >
//                             <FiCreditCard
//                                 className={`
//                                 ${isCollapsed ? "w-5 h-5" : "w-5 h-5"}
//                                 ${
//                                     isActive("/fixed-job-details")
//                                         ? "text-blue-600"
//                                         : "text-gray-500 group-hover:text-blue-600"
//                                 }
//                             `}
//                             />
//                             {!isCollapsed && (
//                                 <span className="ml-3 font-medium whitespace-nowrap">
//                                     Fixed Jobs
//                                 </span>
//                             )}
//                             {isCollapsed && (
//                                 <div
//                                     className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                     style={{
//                                         backgroundColor: "#ffffff",
//                                         border: "1px solid #e5e7eb",
//                                         color: "#374151",
//                                         boxShadow:
//                                             "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                     }}
//                                 >
//                                     Fixed Jobs
//                                 </div>
//                             )}
//                         </Link>

//                         {/* Reports Section */}
//                         {!isCollapsed ? (
//                             // Expanded view with dropdown
//                             <div className="space-y-1">
//                                 <button
//                                     onClick={toggleReports}
//                                     className={`
//                                         flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-200 group
//                                         ${isReportActive() ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                                     `}
//                                 >
//                                     <div className="flex items-center">
//                                         <FiBookOpen className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
//                                         <span className="ml-3 font-medium whitespace-nowrap">
//                                             Reports
//                                         </span>
//                                     </div>
//                                     {isReportsOpen ? (
//                                         <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
//                                     ) : (
//                                         <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
//                                     )}
//                                 </button>

//                                 {/* Dropdown Content */}
//                                 {isReportsOpen && (
//                                     <div className="ml-8 space-y-1">
//                                         {reportItems.map((item) => {

//                                             const active = isActive(item.href);
//                                             return (
//                                                 <Link
//                                                     key={item.href}
//                                                     href={item.href}
//                                                     className={`
//                                                         flex items-center p-2.5 rounded-lg transition-colors duration-200 group
//                                                         ${active ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                                                     `}
//                                                 >
//                                                     <span className="text-sm whitespace-nowrap">
//                                                         {item.label}
//                                                     </span>
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             // Collapsed view
//                             <div className="relative">
//                                 <button
//                                     onClick={toggleReports}
//                                     className={`
//                                         flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
//                                         ${isReportActive() ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                                     `}
//                                     title="Reports"
//                                 >
//                                     <FiBookOpen className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
//                                     <div
//                                         className="absolute left-full ml-2 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
//                                         style={{
//                                             backgroundColor: "#ffffff",
//                                             border: "1px solid #e5e7eb",
//                                             color: "#374151",
//                                             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//                                         }}
//                                     >
//                                         Reports
//                                     </div>
//                                 </button>

//                                 {/* Collapsed dropdown - appears on hover */}
//                                 {isReportsOpen && (
//                                     <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[180px]">
//                                         {reportItems.map((item) => {
//                                             const Icon = item.icon;
//                                             const active = isActive(item.href);
//                                             return (
//                                                 <Link
//                                                     key={item.href}
//                                                     href={item.href}
//                                                     className={`
//                                                         flex items-center px-3 py-2.5 text-sm transition-colors duration-200
//                                                         ${active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
//                                                     `}
//                                                 >
//                                                     <Icon
//                                                         className={`
//                                                             w-4 h-4 mr-3
//                                                             ${active ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
//                                                         `}
//                                                     />
//                                                     <span className="whitespace-nowrap">
//                                                         {item.label}
//                                                     </span>
//                                                 </Link>
//                                             );
//                                         })}
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdminSideBar;

import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    FiMenu,
    FiX,
    FiChevronDown,
    FiChevronRight,
    FiUsers,
    FiUser,
    FiCreditCard,
    FiBookOpen,
} from "react-icons/fi";
import { Building, LayoutDashboard } from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isReportsHovered, setIsReportsHovered] = useState(false);
    const user = usePage().props.auth.user;

    const isAdmin = user?.roles === "Admin";
    const isUser = user?.roles === "User";

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path || url.startsWith(href);
    };

    const isReportActive = () => {
        const reportRoutes = [
            "income-reports",
            "pending-reports",
            "cash-reports",
            "bank-income",
            "user-logs",
        ];
        return reportRoutes.some(
            (route) => currentPath === route || url.includes(route),
        );
    };

    const toggleReports = () => {
        if (!isCollapsed) {
            setIsReportsOpen(!isReportsOpen);
        }
    };

    const reportItems = [
        {
            href: "/income-reports",
            label: "Income Reports",
        },
        {
            href: "/pending-reports",
            label: "Pending Reports",
        },
        {
            href: "/cash-reports",
            label: "Cash Reports",
        },
        {
            href: "/bank-income",
            label: "Bank Income",
        },
        {
            href: "/user-logs",
            label: "User Logs",
        },
    ];

    // Common link styles
    const linkBaseClasses =
        "flex items-center rounded-lg transition-colors duration-200 group relative";
    const linkCollapsedClasses = isCollapsed ? "p-3 justify-center" : "p-3";
    const linkActiveClasses = (href) =>
        isActive(href)
            ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700";

    // Icon style function
    const iconClasses = (href, iconClass = "w-5 h-5") => `
        ${isCollapsed ? iconClass : iconClass}
        ${isActive(href) ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
    `;

    // Tooltip for collapsed state
    const Tooltip = ({ children }) => (
        <div
            className="fixed left-12 ml-6 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#374151",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
        >
            {children}
        </div>
    );

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
                style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                }}
            >
                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${isCollapsed ? "px-3" : ""}`}
                        style={{ borderColor: "#e5e7eb" }}
                    >
                        {!isCollapsed && (
                            <Link
                                href="/dashboard"
                                className="text-xl font-bold text-gray-800 whitespace-nowrap"
                            >
                                Fast Job
                            </Link>
                        )}
                        <div className="flex items-center space-x-1">
                            {/* Collapse Toggle Button - Only show on desktop */}
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title={
                                    isCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <FiMenu className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                <FiX className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items - Flex container for proper alignment */}
                    <div
                        className={`flex-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-3"} py-2`}
                    >
                        <div className="space-y-1">
                            {/* Dashboard Link */}
                            <Link
                                href="/dashboard"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/dashboard")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses("/dashboard")}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Dashboard
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Dashboard</Tooltip>}
                            </Link>

                            {/* Section Header */}
                            {!isCollapsed && (
                                <div className="pt-4 px-3">
                                    <h1 className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                                        Pages
                                    </h1>
                                </div>
                            )}

                            {isAdmin && (
                                <>
                                    {/* User Management Link */}
                                    <Link
                                        href="/users"
                                        className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/users")}
                                `}
                                    >
                                        <FiUsers
                                            className={iconClasses("/users")}
                                        />
                                        {!isCollapsed && (
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Users
                                            </span>
                                        )}
                                        {isCollapsed && (
                                            <Tooltip>Users</Tooltip>
                                        )}
                                    </Link>
                                </>
                            )}

                            {/* Employer Details Link */}
                            <Link
                                href="/employer-details"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/employer-details")}
                                `}
                            >
                                <Building
                                    className={iconClasses("/employer-details")}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Employer Details
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>Employer Details</Tooltip>
                                )}
                            </Link>

                            {/* Customer Details Link */}
                            <Link
                                href="/customer-details"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/customer-details")}
                                `}
                            >
                                <FiUser
                                    className={iconClasses("/customer-details")}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Customer Details
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>Customer Details</Tooltip>
                                )}
                            </Link>

                            {/* Company Visitors Link */}
                            <Link
                                href="/company-visitor-details"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/company-visitor-details")}
                                `}
                            >
                                <FiUsers
                                    className={iconClasses(
                                        "/company-visitor-details",
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Company Visitors
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>Company Visitors</Tooltip>
                                )}
                            </Link>

                            {/* Fixed Jobs */}
                            <Link
                                href="/fixed-job-details"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/fixed-job-details")}
                                `}
                            >
                                <FiCreditCard
                                    className={iconClasses(
                                        "/fixed-job-details",
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Fixed Jobs
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Fixed Jobs</Tooltip>}
                            </Link>

                            {isAdmin && (
                                <>
                                    {/* Reports Section */}
                                    {!isCollapsed ? (
                                        // Expanded view with dropdown
                                        <div className="space-y-1">
                                            <button
                                                onClick={toggleReports}
                                                className={`
                                            flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-200
                                            ${isReportActive() ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                            >
                                                <div className="flex items-center">
                                                    <FiBookOpen
                                                        className={iconClasses(
                                                            "#",
                                                            isReportActive()
                                                                ? "text-blue-600"
                                                                : "text-gray-500 group-hover:text-blue-600",
                                                        )}
                                                    />
                                                    <span className="ml-3 font-medium whitespace-nowrap">
                                                        Reports
                                                    </span>
                                                </div>
                                                {isReportsOpen ? (
                                                    <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                                ) : (
                                                    <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                                )}
                                            </button>

                                            {/* Dropdown Content */}
                                            {isReportsOpen && (
                                                <div className="ml-9 space-y-0.5">
                                                    {reportItems.map((item) => {
                                                        const active = isActive(
                                                            item.href,
                                                        );
                                                        return (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className={`
                                                            flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                            ${active ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                        `}
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                                <span className="text-sm whitespace-nowrap">
                                                                    {item.label}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        // Collapsed view with hover dropdown
                                        <div
                                            className="relative"
                                            onMouseEnter={() =>
                                                setIsReportsHovered(true)
                                            }
                                            onMouseLeave={() =>
                                                setIsReportsHovered(false)
                                            }
                                        >
                                            <button
                                                onClick={() => {
                                                    if (isCollapsed) {
                                                        setIsReportsHovered(
                                                            !isReportsHovered,
                                                        );
                                                    }
                                                }}
                                                className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200
                                            ${isReportActive() ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                            >
                                                <FiBookOpen
                                                    className={iconClasses(
                                                        "#",
                                                        isReportActive()
                                                            ? "text-blue-600"
                                                            : "text-gray-500 group-hover:text-blue-600",
                                                    )}
                                                />
                                            </button>

                                            {/* Collapsed dropdown - appears on hover */}
                                            {isReportsHovered && (
                                                <div
                                                    className="fixed left-10 bottom-44 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] py-1"
                                                    onMouseEnter={() =>
                                                        setIsReportsHovered(
                                                            true,
                                                        )
                                                    }
                                                    onMouseLeave={() =>
                                                        setIsReportsHovered(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    {reportItems.map((item) => {
                                                        const active = isActive(
                                                            item.href,
                                                        );
                                                        return (
                                                            <Link
                                                                key={item.href}
                                                                href={item.href}
                                                                className={`
                                                            flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                            ${active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                        `}
                                                            >
                                                                <span className="whitespace-nowrap">
                                                                    {item.label}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
