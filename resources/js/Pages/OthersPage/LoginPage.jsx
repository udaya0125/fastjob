import React, { useState } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
} from "react-icons/fa";

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login attempt:", { email, password });
    };

    const handleCall = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const socialLinks = {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        tiktok: "https://tiktok.com",
        youtube: "https://youtube.com",
    };

    return (
        <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT SIDE - Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {/* Welcome */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome Back !!
                            </h1>
                            <p className="text-gray-600">Please login to your account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
                            >
                                Login
                            </button>

                            {/* Forgot Password */}
                            <div className="text-center pt-2">
                                <a
                                    href="#"
                                    className="text-blue-600 font-medium hover:text-blue-800 transition"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE - Background Image */}
                <div
                    className="relative flex flex-col justify-center p-8 lg:p-12 text-white bg-cover bg-center min-h-[500px]"
                    style={{ backgroundImage: "url('/images/bg.jpg')" }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        {/* Powered By */}
                        <div className="text-center mb-12">
                            <p className="text-blue-200 text-lg mb-6 font-medium">
                                Powered by
                            </p>
                            <div className="flex justify-center">
                                <img
                                    src="/images/sait.png"
                                    alt="SAC Logo"
                                    className="h-28 lg:h-32 mx-auto invert "
                                />
                            </div>
                        </div>

                        {/* Reach Us */}
                        <div className="text-center w-full max-w-md">
                            <h2 className="text-3xl font-bold mb-6">
                                Reach Us
                            </h2>

                            {/* Social Icons */}
                            <div className="flex justify-center gap-6 mb-10">
                                <a
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <FaFacebook className="text-3xl" />
                                </a>
                                <a
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <FaInstagram className="text-3xl" />
                                </a>
                                <a
                                    href={socialLinks.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <FaTiktok className="text-3xl" />
                                </a>
                                <a
                                    href={socialLinks.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                >
                                    <FaYoutube className="text-3xl" />
                                </a>
                            </div>

                            {/* Contact */}
                            <div className="space-y-3 text-lg">
                                <button
                                    onClick={() => handleCall("061591368")}
                                    className="flex items-center justify-center gap-2 hover:text-blue-200 transition-colors w-full"
                                >
                                    <span>📞</span>
                                    <span>061 591368</span>
                                </button>
                                <button
                                    onClick={() => handleCall("9802835022")}
                                    className="flex items-center justify-center gap-2 hover:text-blue-200 transition-colors w-full"
                                >
                                    <span>📱</span>
                                    <span>9802835022</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}