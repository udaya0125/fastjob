// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }



import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleCall = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const socialLinks = {
        facebook: "https://www.facebook.com/saitpokhara",
        instagram: "https://www.instagram.com/saitsolutionpokhara/",
        tiktok: "https://www.tiktok.com/@saitsolutionnepal",
        youtube: "https://www.youtube.com/@saitsolutionnepal",
    };

    return (
        <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT SIDE - Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {/* Status Message */}
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        {/* Welcome */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome Back !!
                            </h1>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Email"
                                    autoComplete="username"
                                    isFocused={true}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Remember Me */}
                            {/* <div className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </div> */}

                            {/* Login Button */}
                            <PrimaryButton
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md flex justify-center"
                                disabled={processing}
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </PrimaryButton>

                            {/* Forgot Password */}
                            {canResetPassword && (
                                <div className="text-center pt-2">
                                    <Link
                                        href={route('password.request')}
                                        className="text-blue-600 font-medium hover:text-blue-800 transition"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            )}
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
                                    className="h-28 lg:h-32 mx-auto invert"
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
                                    onClick={() => handleCall("9801666530")}
                                    className="flex items-center justify-center gap-2 hover:text-blue-200 transition-colors w-full"
                                >
                                    <span>📱</span>
                                    <span>980-1666530</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}